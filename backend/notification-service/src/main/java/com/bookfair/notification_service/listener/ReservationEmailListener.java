package com.bookfair.notification_service.listener;

import com.bookfair.notification_service.dto.request.EmailRequest;
import com.bookfair.notification_service.dto.request.ReservationEmailMessage;
import com.bookfair.notification_service.dto.request.StallAllocationRequest;
import com.bookfair.notification_service.dto.request.StallRequest;
import com.bookfair.notification_service.service.EmailService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationEmailListener {

  private final EmailService emailService;

  @RabbitListener(queues = "reservation.email.queue")
  public void handleReservationEmail(ReservationEmailMessage message) {
    try {
      log.info("Received reservation email request for: {}", message.getEmail());

      EmailRequest emailRequest = EmailRequest.builder()
          .email(message.getEmail())
          .userProfession(message.getUserProfession())
          .subject(message.getSubject())
          .build();

      List<StallRequest> stallRequests = message.getStalls().stream()
          .map(stall -> StallRequest.builder()
              .stallName(stall.getStallName())
              .stallSize(stall.getStallSize())
              .build())
          .toList();

      StallAllocationRequest request = StallAllocationRequest.builder()
          .emailRequest(emailRequest)
          .bookFairName(message.getBookFairName())
          .stallRequest(stallRequests)
          .build();

      emailService.sendReservationConfirmation(request);
      log.info("Reservation email sent successfully to: {}", message.getEmail());
    } catch (Exception e) {
      log.error("Failed to process reservation email for: {}", message.getEmail(), e);
    }
  }
}
