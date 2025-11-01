package com.bookfair.reservation_service;

import com.bookfair.reservation_service.request.EmailRequest;
import com.bookfair.reservation_service.request.StallAllocationRequest;
import com.bookfair.reservation_service.request.StallRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class EmailService {

  private final JavaMailSender mailSender;
  private  NotificationRepository notificationRepository;


  public void sendHtmlEmail(EmailRequest request) throws MessagingException {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(request.getEmail());
      helper.setSubject(request.getSubject());
      helper.setText(request.getBody(), true);
      mailSender.send(message);
      log.info("HTML email sent successfully to: {}", request.getEmail());
    } catch (MessagingException e) {
      log.error("Failed to send HTML email to {}: {}", request.getEmail(), e.getMessage());
      throw new MessagingException("Failed to send HTML email: " + e.getMessage());
    }
  }

  public void sendAccountCreationEmail(EmailRequest emailRequest) {
    String userName = emailRequest.getUserName();
    String userEmail = emailRequest.getEmail();
    String htmlBody = buildAccountCreationTemplate(userName, userEmail);

    EmailRequest request = new EmailRequest(
        userEmail,
        userName,
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
    String htmlBody = buildReservationConfirmationTemplate(
        stallAllocationRequest.getEmailRequest().getUserName(),
        stallAllocationRequest
    );

    EmailRequest request = new EmailRequest(
        stallAllocationRequest.getEmailRequest().getEmail(),
        stallAllocationRequest.getEmailRequest().getUserName(),
        stallAllocationRequest.getEmailRequest().getSubject(),
        htmlBody,
        true
    );

    try {
      sendHtmlEmail(request);
      NotificationEntity notificationEntity = mapToEntity(stallAllocationRequest.emailRequest);
      notificationRepository.save(notificationEntity);
    } catch (MessagingException e) {
      log.error("Failed to send reservation confirmation to {}",
          stallAllocationRequest.getEmailRequest().getEmail(), e);
      throw new RuntimeException("Failed to send reservation confirmation: " + e.getMessage());
    }
  }

   private NotificationEntity mapToEntity(EmailRequest emailRequest) {
     return NotificationEntity.builder()
          .receipientEmail(emailRequest.getEmail())
          .subject(emailRequest.getSubject())
          .body(emailRequest.getBody())
          .sentAt(java.time.LocalDateTime.now())
          .build();
   }

  //html templates
  private String buildAccountCreationTemplate(String userName, String userEmail) {
    return """
        <!DOCTYPE html>
        <html>
        <head>
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
                        <p><strong>Account Created Successfully</strong></p>
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Name:</strong> %s</p>
                    </div>
                    <p>Your account has been successfully created and you're all set to explore our platform.</p>
                </div>
                <div class="footer">
                    <p><strong>BookFair Management System</strong></p>
                    <p>This is an automated email. Please do not reply to this message. </p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(userName, userEmail, userName);
  }

  private String buildReservationConfirmationTemplate(String userName,
      StallAllocationRequest stallAllocation) {
    StringBuilder stallsList = new StringBuilder();

    for (StallRequest stall : stallAllocation.getStallRequest()) {
      stallsList.append("""
          <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">%s</td>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;">
                  <span style="background-color: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">%s</span>
              </td>
          </tr>
          """.formatted(stall.getStallName(), stall.getStallSize()));
    }

    return """
        <!DOCTYPE html>
        <html>
        <head>
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
                .header p {
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.9;
                }
                .content {
                    padding: 40px 30px;
                }
                .success-badge {
                    background-color: #28a745;
                    color: white;
                    padding: 8px 20px;
                    border-radius: 20px;
                    display: inline-block;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 20px;
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
                    margin: 8px 0;
                }
                .info-box strong {
                    color: #667eea;
                }
                .stalls-table {
                    width: 100%%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background-color: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .stalls-table th {
                    background-color: #667eea;
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                }
                .stalls-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e9ecef;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #667eea;
                    margin: 25px 0 15px 0;
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
                    <h1>🎊 Reservation Confirmed!</h1>
                    <p>Your stall reservation is successful</p>
                </div>
        
                <div class="content">
                    <span class="success-badge">✓ CONFIRMED</span>
                    <p class="welcome-text">Dear %s,</p>
                    <p>Your stall reservation has been successfully confirmed.</p>
        
                    <div class="info-box">
                        <p><strong>Book Fair:</strong> %s</p>
                        <p><strong>Total Stalls Reserved:</strong> %d</p>
                    </div>
        
                    <p class="section-title">📋 Reserved Stalls</p>
                    <table class="stalls-table">
                        <thead>
                            <tr>
                                <th style="text-align: center;">Stall Name</th>
                                <th style="text-align: center;">Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            %s
                        </tbody>
                    </table>
        
                    <p style="margin-top: 25px; color: #666;">
                        Please keep this email for your records. If you have any questions, feel free to contact our support team.
                    </p>
                </div>
        
                <div class="footer">
                    <p><strong>BookFair Management System</strong></p>
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
        userName,
        stallAllocation.getBookFairName(),
        stallAllocation.getStallRequest().size(),
        stallsList.toString()
    );
  }

}
