
package com.bookfair.user_service.service.impl;

import com.bookfair.user_service.dto.request.ChangePasswordRequest;
import com.bookfair.user_service.dto.request.CreateStallUserRequest;
import com.bookfair.user_service.dto.request.LoginRequest;
import com.bookfair.user_service.dto.request.UpdateProfileRequest;
import com.bookfair.user_service.dto.response.AuthResponse;
import com.bookfair.user_service.dto.response.StallUserResponse;
import com.bookfair.user_service.entity.StallUserEntity;
import com.bookfair.user_service.enums.UserProfession;
import com.bookfair.user_service.repository.StallUserRepository;
import com.bookfair.user_service.security.CustomUserDetails;
import com.bookfair.user_service.security.JwtService;
import com.bookfair.user_service.service.AuthService;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final StallUserRepository repo;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authManager;
  private final JwtService jwt;

  // ========= AUTH =========

  @Override
  @Transactional
  public StallUserResponse signup(CreateStallUserRequest req) {
    if (repo.existsByUsername(req.getUsername())) {
      throw new IllegalArgumentException("Username already exists");
    }
    if (repo.existsByPhoneNumber(req.getPhonenumber())) {
      throw new IllegalArgumentException("Phone number already exists");
    }

    // basic normalization
    String email = req.getUsername().trim().toLowerCase();
    String phone = req.getPhonenumber().trim();
    UserProfession profession = normalizeProfession(req.getProfession());
    if (profession == UserProfession.ADMIN) {
      throw new IllegalArgumentException("Cannot register as ADMIN profession");
    }

    StallUserEntity user = StallUserEntity.builder()
        .username(email)
        .password(encoder.encode(req.getPassword()))
        .phoneNumber(phone)
        .address(req.getAddress())
        .profession(profession)
        .date(LocalDate.now())
        .enabled(true)
        .build();

    user = repo.save(user);
    return toResponse(user);
  }

  @Override
  public AuthResponse login(LoginRequest req) {
    Authentication auth = new UsernamePasswordAuthenticationToken(
        req.getUsername(), req.getPassword());
    authManager.authenticate(auth); // throws BAD_CREDENTIALS if invalid

    // load by username OR phone
    StallUserEntity user = repo.findByUsername(req.getUsername())
        .orElseThrow(
            () -> new IllegalArgumentException("User not found"));

    String role = "ROLE_" + user.getProfession().name();
    String token = jwt.generate(
        new org.springframework.security.core.userdetails.User(
            user.getUsername(), user.getPassword(),
            java.util.List.of(
                new org.springframework.security.core.authority.SimpleGrantedAuthority(role))
        ),
        user.getId(),
        role
    );

    return new AuthResponse(token, "Bearer", user.getId(), role, user.getUsername());
  }

  @Override
  public StallUserResponse me(Object principal) {
    StallUserEntity user = resolveCurrentUser(principal);
    return toResponse(user);
  }

  // ========= SELF (CURRENT USER) =========

  @Override
  @Transactional
  public StallUserResponse updateMyProfile(Authentication authentication,
      UpdateProfileRequest req) {
    StallUserEntity user = resolveCurrentUser(authentication.getPrincipal());

    // Uniqueness checks if email/phone changed
    String newEmail = req.getUsername().trim().toLowerCase();
    if (!newEmail.equalsIgnoreCase(user.getUsername())
        && repo.existsByUsername(newEmail)) {
      throw new IllegalArgumentException("Email already exists");
    }

    String newPhone = req.getPhonenumber().trim();
    if (!newPhone.equals(user.getPhoneNumber())
        && repo.existsByPhoneNumber(newPhone)) {
      throw new IllegalArgumentException("Phone number already exists");
    }

    user.setUsername(newEmail);
    user.setPhoneNumber(newPhone);
    user.setAddress(req.getAddress());

    if (req.getProfession() != null) {
      user.setProfession(normalizeProfession(req.getProfession()));
    }

    user = repo.save(user);
    return toResponse(user);
  }

  @Override
  @Transactional
  public void changeMyPassword(Authentication authentication, ChangePasswordRequest req) {
    StallUserEntity me = resolveCurrentUser(authentication.getPrincipal());

    if (!encoder.matches(req.getOldPassword(), me.getPassword())) {
      throw new IllegalArgumentException("Old password is incorrect");
    }
    if (req.getOldPassword().equals(req.getNewPassword())) {
      throw new IllegalArgumentException("New password cannot be the same as old password");
    }

    me.setPassword(encoder.encode(req.getNewPassword()));
    repo.save(me);
  }

  @Override
  public StallUserResponse getMe(Authentication authentication) {
    StallUserEntity user = resolveCurrentUser(authentication.getPrincipal());
    return toResponse(user);
  }

  // ========= HELPERS =========

  private StallUserEntity resolveCurrentUser(Object principal) {
    if (principal instanceof CustomUserDetails cud) {
      Long id = cud.getId();
      return repo.findById(id)
          .orElseThrow(
              () -> new IllegalArgumentException("User not found"));
    }
    // Fallback (very rare, depending on your Security config)
    if (principal instanceof org.springframework.security.core.userdetails.User springUser) {
      String username = springUser.getUsername();
      Optional<StallUserEntity> opt = repo.findByUsername(username);
      if (opt.isPresent()) {
        return opt.get();
      }
    }
    throw new IllegalArgumentException("UnAuthenticated User");
  }

  private UserProfession normalizeProfession(UserProfession p) {
    // Guard against enum typos or legacy values if migrated
    if (p == null) {
      return UserProfession.VENDOR; // sensible default
    }
    return p;
  }

  private StallUserResponse toResponse(StallUserEntity u) {
    return StallUserResponse.builder()
        .id(u.getId())
        .username(u.getUsername())
        .phonenumber(u.getPhoneNumber())
        .address(u.getAddress())
        .profession(u.getProfession())
        .date(u.getDate())
        .build();
  }
}
