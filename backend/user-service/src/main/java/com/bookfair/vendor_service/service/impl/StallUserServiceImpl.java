package com.bookfair.vendor_service.service.impl;


import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserResponse;
import com.bookfair.vendor_service.entity.StallUserEntity;
import com.bookfair.vendor_service.repository.StallUserRepository;
import com.bookfair.vendor_service.service.StallUserService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class StallUserServiceImpl implements StallUserService {

  private final StallUserRepository stallUserRepository;

  @Override
  public StallUserResponse createStallUser(CreateStallUserRequest request) {
    if (stallUserRepository.existsByUsername(request.getUsername())) {
      throw new RuntimeException("Username already exists");
    }
    if (stallUserRepository.existsByPhoneNumber(request.getPhonenumber())) {
      throw new RuntimeException("Phone number already exists");
    }

    StallUserEntity entity = StallUserEntity.builder()
        .username(request.getUsername())
        .password(request.getPassword())
        .phoneNumber(request.getPhonenumber())
        .address(request.getAddress())
        .profession(request.getProfession())
        .date(java.time.LocalDate.now())
        .build();

    StallUserEntity savedEntity = stallUserRepository.save(entity);

    // Send email notification after successful user creation
//    sendAccountCreationEmail(savedEntity);
    return mapToResponse(savedEntity);
  }

  @Override
  public StallUserResponse getStallUserById(Long id) {
    StallUserEntity entity = stallUserRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Stall User not found"));
    return mapToResponse(entity);
  }

  @Override
  public StallUserResponse getStallUserByUsername(String username) {
    StallUserEntity entity = stallUserRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Stall User not found"));
    return mapToResponse(entity);
  }

  @Override
  public StallUserResponse getStallUserByQrId(String qrId) {
    StallUserEntity stallUserEntity = stallUserRepository.findByQrId(qrId)
        .orElseThrow(() -> new RuntimeException("Stall User not found"));
    return mapToResponse(stallUserEntity);
  }

  @Override
  public List<StallUserResponse> getAllStallUsers() {
    List<StallUserEntity> entities = stallUserRepository.findAll();
    return entities.stream()
        .map(this::mapToResponse)
        .toList();
  }


  @Override
  public StallUserResponse updateStallUser(Long id, UpdateStallUserRequest request) {
    StallUserEntity entity = stallUserRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Stall User not found"));

    if (!entity.getPassword().equals(request.getOld_password())) {
      throw new RuntimeException("Old password is incorrect");
    }

    if (!entity.getUsername().equals(request.getUsername()) &&
        stallUserRepository.existsByUsername(request.getUsername())) {
      throw new RuntimeException("Username already exists");
    }

    if (!entity.getPhoneNumber().equals(request.getPhonenumber()) &&
        stallUserRepository.existsByPhoneNumber(request.getPhonenumber())) {
      throw new RuntimeException("Username already exists");
    }

    entity.setUsername(request.getUsername());
    entity.setPassword(request.getNew_password());
    entity.setPhoneNumber(request.getPhonenumber());
    entity.setAddress(request.getAddress());
    entity.setProfession(request.getProfession());
    StallUserEntity updatedEntity = stallUserRepository.save(entity);
    return mapToResponse(updatedEntity);

  }

  @Override
  public void deleteStallUser(Long id) {
    StallUserEntity entity = stallUserRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Stall User not found"));
    stallUserRepository.delete(entity);
  }

  private StallUserResponse mapToResponse(StallUserEntity entity) {
    return StallUserResponse.builder()
        .id(entity.getId())
        .username(entity.getUsername())
        .phonenumber(entity.getPhoneNumber())
        .address(entity.getAddress())
        .profession(entity.getProfession())
        .date(entity.getDate())
        .build();
  }

//  private void sendAccountCreationEmail(StallUserEntity user) {
//    try {
//      EmailNotificationRequest emailRequest = EmailNotificationRequest.builder()
//          .email(user.getUsername())
//          .userName(user.getUsername())
//          .subject("Welcome to BookFair - Account Created Successfully")
//          .body("Your account has been created successfully. Welcome to BookFair!")
//          .build();
//
//      emailNotificationPublisher.publishEmailNotification(emailRequest);
//      log.info("Email notification sent for user: {}", user.getUsername());
//    } catch (Exception e) {
//      log.error("Failed to send email notification for user: {}", user.getUsername(), e);
//      // Don't throw exception - email failure shouldn't break user creation
//    }
//  }
}


