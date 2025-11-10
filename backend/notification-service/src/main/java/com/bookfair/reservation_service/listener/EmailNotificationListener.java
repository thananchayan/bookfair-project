package com.bookfair.reservation_service.listener;

import com.bookfair.reservation_service.dto.request.EmailRequest;
import com.bookfair.reservation_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationListener {

  private final EmailService emailService;

  @RabbitListener(queues = "email.notification.queue")
  public void handleEmailNotification(EmailRequest emailRequest) {
    log.info("Received email notification request for: {}", emailRequest.getEmail());
    try {
      emailService.sendAccountCreationEmail(emailRequest);
      log.info("Email notification sent successfully to: {}", emailRequest.getEmail());
    } catch (Exception e) {
      log.error("Failed to send email notification to {}: {}",
          emailRequest.getEmail(), e.getMessage(), e);
    }
  }
}
