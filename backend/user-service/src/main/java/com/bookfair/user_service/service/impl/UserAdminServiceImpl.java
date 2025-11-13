package com.bookfair.user_service.service.impl;

import com.bookfair.user_service.dto.request.CreateStallUserRequest;
import com.bookfair.user_service.dto.request.UpdateStallUserRequest;
import com.bookfair.user_service.dto.response.StallUserResponse;
import com.bookfair.user_service.entity.StallUserEntity;
import com.bookfair.user_service.repository.StallUserRepository;
import com.bookfair.user_service.service.UserAdminService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserAdminServiceImpl implements UserAdminService {

  private final StallUserRepository repo;
  private final PasswordEncoder encoder;

  // ---------- CREATE ----------
  @Override
  @Transactional
  public StallUserResponse create(CreateStallUserRequest req) {
    String email = req.getUsername().trim().toLowerCase();
    String phone = req.getPhonenumber().trim();

    if (repo.existsByUsername(email)) {
      throw new IllegalArgumentException("Username already exists");
    }
    if (repo.existsByPhoneNumber(phone)) {
      throw new IllegalArgumentException("Phone number already exists");
    }

    StallUserEntity u = StallUserEntity.builder()
        .username(email)
        .password(encoder.encode(req.getPassword()))
        .phoneNumber(phone)
        .address(req.getAddress())
        .profession(req.getProfession())
        .enabled(true)
        .build();

    return toResponse(repo.save(u));
  }

  // ---------- READ ----------
  @Override
  public StallUserResponse getById(Long id) {
    return toResponse(findOr404(id));
  }

  @Override
  public StallUserResponse getByUsername(String username) {
    return toResponse(
        repo.findByUsername(username.trim().toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("User not found"))
    );
  }

  @Override
  public StallUserResponse getByPhone(String phone) {
    return toResponse(
        repo.findByPhoneNumber(phone.trim())
            .orElseThrow(() -> new IllegalArgumentException("Phone number not found"))
    );
  }

  // ---------- LIST / SEARCH ----------
  @Override
  public Page<StallUserResponse> list(int page, int size, String q) {
    Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1),
        Sort.by(Sort.Direction.DESC, "id"));
    Page<StallUserEntity> data;
    if (StringUtils.hasText(q)) {
      String term = q.trim();
      data = repo.searchByUsernameOrPhone(term, term, pageable);
    } else {
      data = repo.findAll(pageable);
    }
    return data.map(this::toResponse);
  }

  // ---------- UPDATE ----------
  @Override
  @Transactional
  public StallUserResponse update(Long id, UpdateStallUserRequest req) {
    StallUserEntity u = findOr404(id);

    // uniqueness checks (if changed)
    String newEmail = req.getUsername().trim().toLowerCase();
    if (!newEmail.equalsIgnoreCase(u.getUsername()) && repo.existsByUsername(newEmail)) {
      throw new IllegalArgumentException("Username already exists");
    }
    String newPhone = req.getPhonenumber().trim();
    if (!newPhone.equals(u.getPhoneNumber()) && repo.existsByPhoneNumber(newPhone)) {
      throw new IllegalArgumentException("Phone number already exists");
    }

    // update core fields
    u.setUsername(newEmail);
    u.setPhoneNumber(newPhone);
    u.setAddress(req.getAddress());
    if (req.getProfession() != null) {
      u.setProfession(req.getProfession());
    }

    // Admin/staff update behavior:
    // - If a NEW password is supplied, reset it (admin override). We don't require old_password here.
    if (StringUtils.hasText(req.getNew_password())) {
      u.setPassword(encoder.encode(req.getNew_password()));
    }

    return toResponse(repo.save(u));
  }

  // ---------- ENABLE/DISABLE ----------
  @Override
  @Transactional
  public void setEnabled(Long id, boolean enabled) {
    StallUserEntity u = findOr404(id);
    u.setEnabled(enabled);
    repo.save(u);
  }

  // ---------- DELETE ----------
  @Override
  @Transactional
  public void delete(Long id) {
    StallUserEntity u = findOr404(id);
    repo.delete(u);
  }

  // ---------- HELPERS ----------
  private StallUserEntity findOr404(Long id) {
    return repo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
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
