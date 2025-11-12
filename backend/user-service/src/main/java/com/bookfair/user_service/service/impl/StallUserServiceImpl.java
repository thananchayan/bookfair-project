package com.bookfair.user_service.service.impl;


import com.bookfair.user_service.dto.request.CreateStallUserRequest;
import com.bookfair.user_service.dto.request.EmailRequest;
import com.bookfair.user_service.dto.request.UpdateStallUserRequest;
import com.bookfair.user_service.dto.response.StallUserResponse;
import com.bookfair.user_service.entity.StallUserEntity;
import com.bookfair.user_service.repository.StallUserRepository;
import com.bookfair.user_service.service.StallUserService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class StallUserServiceImpl implements StallUserService {

  private final StallUserRepository stallUserRepository;
  private final RabbitTemplate rabbitTemplate;

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
    log.info("User created successfully: {}", entity.getUsername());

    // Send email notification after successful user creation
    sendAccountCreationEmail(savedEntity);
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

  private void sendAccountCreationEmail(StallUserEntity user) {
    EmailRequest emailRequest = EmailRequest.builder()
        .email(user.getUsername())
        .subject("BookFair - Account Created Successfully")
        .body("Your account has been created successfully. Welcome to BookFair!")
        .build();

    try {
      rabbitTemplate.convertAndSend(
          "user.exchange",
          "user.created",
          emailRequest
      );
      log.info("User creation event published for: {}", user.getUsername());
    } catch (Exception e) {
      log.error("Failed to publish user creation event for {}: {}",
          user.getUsername(), e.getMessage());
      // Don't throw exception - email failure shouldn't break user creation
    }
  }
}


