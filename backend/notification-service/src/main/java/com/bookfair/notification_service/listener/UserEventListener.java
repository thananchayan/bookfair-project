package com.bookfair.notification_service.listener;

import com.bookfair.notification_service.dto.request.EmailRequest;
import com.bookfair.notification_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserEventListener {

  private final EmailService emailService;

  @RabbitListener(queues = "user.creation.queue")
  public void handleUserCreation(EmailRequest emailRequest) {
    log.info("Received user creation event for: {}", emailRequest.getEmail());
    try {
      emailService.sendAccountCreationEmail(emailRequest);
      log.info("Account creation email sent successfully to: {}", emailRequest.getEmail());
    } catch (Exception e) {
      log.error("Failed to send account creation email to {}: {}",
          emailRequest.getEmail(), e.getMessage(), e);
      // Message will be re-queued or sent to DLQ based on configuration
    }
  }
}
