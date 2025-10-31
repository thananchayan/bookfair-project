package com.bookfair.reservation_service;

import com.bookfair.reservation_service.configuration.request.EmailRequest;
import io.swagger.v3.oas.annotations.Operation;
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

  @PostMapping("/send")
  @Operation(summary = "Send email notification")
  public ResponseEntity<EmailResponse> sendAccountCreationEmail(@RequestBody EmailRequest emailRequest) {
    try {
      emailService.sendAccountCreationEmail(emailRequest.getTo(), emailRequest.getUserName());
      return ResponseEntity.ok(new EmailResponse(true, "Email sent successfully"));
    } catch (Exception e) {
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new EmailResponse(false, "Failed to send email: " + e.getMessage()));
    }
  }
}
