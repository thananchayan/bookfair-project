package com.bookfair.stall_service.listener;

import com.bookfair.stall_service.dto.response.StallUserProfileResponse;
import com.bookfair.stall_service.entity.StallUserEntity;
import com.bookfair.stall_service.repository.StallUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StallUserGetListener {


  private final StallUserRepository stallUserRepository;
  private final RabbitTemplate rabbitTemplate;

  @RabbitListener(queues = "stall.user.get.queue")
  public void handleGetStallUser(String username) {
    log.info("Received get request for username: {}", username);

    StallUserProfileResponse response;
    try {
      StallUserEntity user = stallUserRepository.findByUsername(username)
          .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

      response = StallUserProfileResponse.builder()
          .id(user.getId())
          .username(user.getUsername())
          .phonenumber(user.getPhoneNumber())
          .address(user.getAddress())
          .profession(user.getProfession())
          .status("success")
          .message("User profile retrieved successfully")
          .build();
    } catch (Exception e) {
      log.error("Error retrieving user: {}", e.getMessage());
      response = StallUserProfileResponse.builder()
          .status("failure")
          .message(e.getMessage())
          .build();
    }

    rabbitTemplate.convertAndSend(
        "bookfair.exchange",
        "stall.user.get.response",
        response
    );
  }
}
