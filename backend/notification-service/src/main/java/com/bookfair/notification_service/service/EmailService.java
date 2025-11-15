package com.bookfair.notification_service.service;

import com.bookfair.notification_service.dto.request.EmailRequest;
import com.bookfair.notification_service.dto.request.StallAllocationRequest;
import com.bookfair.notification_service.dto.request.StallRequest;
import com.bookfair.notification_service.entity.NotificationEntity;
import com.bookfair.notification_service.entity.NotificationRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class EmailService {

  @Autowired
  private QRCodeService qrCodeService;

  private final JavaMailSender mailSender;
  private NotificationRepository notificationRepository;

  public void sendHtmlEmail(EmailRequest request) throws MessagingException {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(request.getEmail());
      helper.setSubject(request.getSubject());
      helper.setText(request.getBody(), true);

      if (request.getInlineImages() != null) {
        for (Map.Entry<String, byte[]> e : request.getInlineImages().entrySet()) {
          String contentId = e.getKey();
          byte[] bytes = e.getValue();
          helper.addInline(contentId, new ByteArrayResource(bytes), "image/png");
        }
      }

      mailSender.send(message);
      log.info("HTML email sent successfully to: {}", request.getEmail());
    } catch (MessagingException e) {
      log.error("Failed to send HTML email to {}: {}", request.getEmail(), e.getMessage());
      throw new MessagingException("Failed to send HTML email: " + e.getMessage());
    }
  }

  public void sendAccountCreationEmail(EmailRequest emailRequest) {
    String userEmail = emailRequest.getEmail();
    String htmlBody = buildAccountCreationTemplate(emailRequest);

    EmailRequest request = new EmailRequest(
        userEmail,
        emailRequest.getUserProfession(),
        emailRequest.getSubject(),
        htmlBody,
        true
    );
    try {
      NotificationEntity notificationEntity = mapToEntity(emailRequest);
      notificationRepository.save(notificationEntity);
      sendHtmlEmail(request);
    } catch (MessagingException e) {
      log.error("Failed to send account creation email to {}", userEmail, e);
      throw new RuntimeException("Failed to send account creation email: " + e.getMessage());
    }
  }

  public void sendReservationConfirmation(StallAllocationRequest stallAllocationRequest) {
    try {
      String userEmail = stallAllocationRequest.getEmailRequest().getEmail();
      String reservationToken = stallAllocationRequest.getEmailRequest().getReservationToken();

      String qrData = String.format(
          "Email: %s\nBookFair: %s\nReservation ID: %s",
          userEmail,
          stallAllocationRequest.getBookFairName(),
          reservationToken
      );

      final String qrImgString;
      final byte[] qrBytes;
      try {
        qrImgString = generateQRCode(qrData);
        qrBytes = Base64.getDecoder().decode(qrImgString);

      } catch (com.google.zxing.WriterException | java.io.IOException e) {
        log.error("Failed to generate QR code for reservation {}: {}", reservationToken,
            e.getMessage(), e);
        throw new RuntimeException("Failed to generate QR code: " + e.getMessage(), e);
      }

      // Append QR code image to email body
      String htmlBody = buildReservationConfirmationTemplate(
          userEmail,
          stallAllocationRequest
      );

      //create email request
      EmailRequest request = new EmailRequest(
          userEmail,
          stallAllocationRequest.getEmailRequest().getUserProfession(),
          stallAllocationRequest.getEmailRequest().getSubject(),
          htmlBody,
          true
      );

      NotificationEntity notificationEntity = NotificationEntity.builder()
          .receipientEmail(userEmail)
          .userProfession(stallAllocationRequest.getEmailRequest().getUserProfession())
          .subject(stallAllocationRequest.getEmailRequest().getSubject())
          .body("Reservation confirmed : " + qrData)
          .reservationToken(reservationToken)
          .sentAt(java.time.LocalDateTime.now())
          .build();

      notificationRepository.save(notificationEntity);
      log.info("Reservation confirmation mail sent to: {}", userEmail);

      sendHtmlEmailWithAttachment(request, qrBytes,
          "reservation-" + reservationToken.substring(0, 8) + ".png");

    } catch (MessagingException e) {
      log.error("Failed to send reservation confirmation to {}",
          stallAllocationRequest.getEmailRequest().getEmail(), e);
      throw new RuntimeException("Failed to send reservation confirmation: " + e.getMessage());
    }
  }

  private NotificationEntity mapToEntity(EmailRequest emailRequest) {
    return NotificationEntity.builder()
        .receipientEmail(emailRequest.getEmail())
        .userProfession(emailRequest.getUserProfession())
        .subject(emailRequest.getSubject())
        .body(emailRequest.getBody() != null ? emailRequest.getBody() : "Email body not available")
        .sentAt(java.time.LocalDateTime.now())
        .build();
  }

  private void sendHtmlEmailWithAttachment(EmailRequest request, byte[] qrBytes, String filename)
      throws MessagingException {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(request.getEmail());
      helper.setSubject(request.getSubject());
      helper.setText(request.getBody(), true);

      if (request.getInlineImages() != null) {
        for (Map.Entry<String, byte[]> e : request.getInlineImages().entrySet()) {
          helper.addInline(e.getKey(), new ByteArrayResource(e.getValue()), "image/png");
        }
      }
      // Add QR code as downloadable attachment
      helper.addAttachment(filename, new ByteArrayResource(qrBytes), "image/png");

      mailSender.send(message);
      log.info("Email with attachment sent to: {}", request.getEmail());
    } catch (MessagingException e) {
      log.error("Failed to send email to {}: {}", request.getEmail(), e.getMessage());
      throw e;
    }
  }

  public String generateQRCode(String data) throws WriterException, IOException {
    QRCodeWriter qrCodeWriter = new QRCodeWriter();

    Map<EncodeHintType, Object> hints = new HashMap<>();
    hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
    hints.put(EncodeHintType.MARGIN, 1);

    BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 300, 300, hints);

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

    byte[] qrCodeBytes = outputStream.toByteArray();
    return Base64.getEncoder().encodeToString(qrCodeBytes);
  }

  //generate unique reservation token using user email
  public String generateReservationToken(String email) {
    String uniqueString = email + System.currentTimeMillis();
    return UUID.nameUUIDFromBytes(uniqueString.getBytes()).toString();
  }

  //html templates
  private String buildAccountCreationTemplate(EmailRequest request) {
    return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Account Creation - BookFair Management System</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: #ffffff;
                    margin: 20px;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }
                .content {
                    padding: 40px 30px;
                }
                .welcome-text {
                    font-size: 18px;
                    color: #667eea;
                    margin-bottom: 20px;
                    font-weight: 600;
                }
                .info-box {
                    background-color: #f8f9fa;
                    border-left: 4px solid #667eea;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .info-box p {
                    margin: 5px 0;
                }
                .info-box strong {
                    color: #667eea;
                }
                .body-content {
                    background-color: #fefefe;
                    border: 1px solid #e9ecef;
                    padding: 15px;
                    border-radius: 6px;
                    margin-top: 15px;
                    white-space: pre-wrap;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    border-top: 1px solid #e9ecef;
                }
                .footer p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 BookFair Management System</h1>
                </div>
                <div class="content">
                    <p class="welcome-text">Welcome, %s!</p>
                    <div class="info-box">
                        <p><strong>Account Details</strong></p>
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Role:</strong> %s</p>
                        <p><strong>Created Date:</strong> %s</p>
                    </div>
                    <div class="info-box">
                        <p><strong>Subject:</strong> %s</p>
                    </div>
                    <div class="body-content">
                        %s
                    </div>
                    <p style="margin-top: 20px;">Your account has been successfully created and is now active on our system.</p>
                </div>
                <div class="footer">
                    <p><strong>BookFair Management System</strong></p>
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
        request.getEmail(),
        request.getEmail(),
        request.getUserProfession(),
        java.time.LocalDate.now(),
        request.getSubject(),
        request.getBody()
    );
  }


  private String buildReservationConfirmationTemplate(String userName,
      StallAllocationRequest stallAllocation) {

    StringBuilder stallsList = new StringBuilder();
    var stalls = stallAllocation.getStallRequest();
    if (stalls != null) {
      for (StallRequest stall : stalls) {
        stallsList.append("""
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">%s</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;">%s</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;">
                    <span style="background-color: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">%s</span>
                </td>
            </tr>
            """.formatted(stall.getHallName(), stall.getStallName(), stall.getStallSize()));
      }
    }

    return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Stall Reservation Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: white;">Reservation Confirmed!</h1>
                <p style="margin: 10px 0 0 0; color: white; opacity: 0.9;">Your stall reservation is successful</p>
            </div>
        
            <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <span style="background-color: #28a745; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600; margin-bottom: 20px;">✓ CONFIRMED</span>
        
                <p style="font-size: 18px; color: #667eea; margin-bottom: 20px; font-weight: 600;">Dear %s,</p>
                <p>Your stall reservation has been successfully confirmed for <strong>%s</strong>.</p>
        
                <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
                    <p style="margin: 8px 0;"><strong style="color: #667eea;">Book Fair:</strong> %s</p>
                    <p style="margin: 8px 0;"><strong style="color: #667eea;">Total Stalls Reserved:</strong> %d</p>
                </div>
        
                <p style="font-size: 16px; font-weight: 600; color: #667eea; margin: 25px 0 15px 0;">📋 Reserved Stalls</p>
                <table style="width: 100%%; border-collapse: collapse; margin: 20px 0; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <thead>
                        <tr>
                            <th style="background-color: #667eea; color: white; padding: 15px; text-align: left; font-weight: 600;">Hall Name</th>
                            <th style="background-color: #667eea; color: white; padding: 15px; text-align: center; font-weight: 600;">Stall Name</th>
                            <th style="background-color: #667eea; color: white; padding: 15px; text-align: center; font-weight: 600;">Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        %s
                    </tbody>
                </table>
        
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> Please save this QR code or keep this email handy for venue entry.</p>
                </div>
        
                <p style="margin-top: 25px; color: #666;">
                    Please keep this email for your records. If you have any questions, feel free to contact our support team.
                </p>
            </div>
        
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                <p><strong>BookFair Management System</strong></p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </body>
        </html>
        """.formatted(
        userName,
        stallAllocation.getBookFairName(),
        stallAllocation.getBookFairName(),
        stallAllocation.getStallRequest() == null ? 0 : stallAllocation.getStallRequest().size(),
        stallsList.toString()
    );
  }


}
