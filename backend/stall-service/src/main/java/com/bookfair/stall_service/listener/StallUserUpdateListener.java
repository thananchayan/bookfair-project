package com.bookfair.stall_service.listener;

import com.bookfair.stall_service.dto.request.UpdateStallUserMessage;
import com.bookfair.stall_service.dto.request.UpdateStallUserRequest;
import com.bookfair.stall_service.dto.response.StallUserResponseMessage;
import com.bookfair.stall_service.service.StallUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StallUserUpdateListener {

  private final StallUserService stallUserService;
  private final RabbitTemplate rabbitTemplate;


  @RabbitListener(queues = "stall.user.update.queue")
  public void handleUpdateStallUser(UpdateStallUserMessage message) {
    log.info("Received update request for userId: {}", message.getUsername());

    StallUserResponseMessage response;
    try {
      UpdateStallUserRequest request = UpdateStallUserRequest.builder()
          .username(message.getUsername())
          .oldPassword(message.getOldPassword())
          .newPassword(message.getNewPassword())
          .phonenumber(message.getPhonenumber())
          .address(message.getAddress())
          .profession(message.getProfession())
          .build();

      stallUserService.updateStallUser(message.getUserId(), request);

      response = StallUserResponseMessage.builder()
          .status("success")
          .message("User updated successfully")
          .build();
    } catch (Exception e) {
      log.error("Error updating user: {}", e.getMessage());
      response = StallUserResponseMessage.builder()
          .status("failure")
          .message(e.getMessage())
          .errorCode("500")
          .build();
    }

    rabbitTemplate.convertAndSend(
        "bookfair.exchange",
        "stall.user.update.response",
        response
    );
  }
}
