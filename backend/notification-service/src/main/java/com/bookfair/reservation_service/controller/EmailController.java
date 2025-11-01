package com.bookfair.reservation_service.controller;

import com.bookfair.reservation_service.EmailResponse;
import com.bookfair.reservation_service.request.EmailRequest;
import com.bookfair.reservation_service.request.StallAllocationRequest;
import com.bookfair.reservation_service.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailController {

  private final EmailService emailService;

  public EmailController(EmailService emailService) {
    this.emailService = emailService;
  }

  @PostMapping("/createAccount")
  public ResponseEntity<EmailResponse> accountCreationEmail(
      @RequestBody EmailRequest emailRequest) {
    try {
      emailService.sendAccountCreationEmail(emailRequest);
      return ResponseEntity.ok(
          new EmailResponse(
              "SUCCESS",
              "Create Account",
              "Email sent successfully"
          ));
    } catch (Exception e) {
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new EmailResponse(
              "FAILURE",
              "Create Account",
              "Failed to send email: " + e.getMessage()
          ));
    }
  }

  @PostMapping("/createReservation")
  public ResponseEntity<EmailResponse> stallReservationEmail(
      @RequestBody StallAllocationRequest stallAllocationRequest) {
    try {
      emailService.sendReservationConfirmation(stallAllocationRequest);
      return ResponseEntity.ok(
          new EmailResponse(
              "SUCCESS",
              "Stall Reservation",
              "Email sent successfully"
          ));
    } catch (Exception e) {
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new EmailResponse(
              "FAILURE",
              "Stall Reservation",
              "Failed to send email: " + e.getMessage()
          ));
    }
  }


}
