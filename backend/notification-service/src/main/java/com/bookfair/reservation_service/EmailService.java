package com.bookfair.reservation_service;

import com.bookfair.reservation_service.configuration.request.EmailRequest;
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

  public void sendHtmlEmail(EmailRequest request) throws MessagingException {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(request.getTo());
      helper.setSubject(request.getSubject());
      helper.setText(request.getBody(), true);

      mailSender.send(message);
      log.info("HTML email sent successfully to: {}", request.getTo());
    } catch (MessagingException e) {
      log.error("Failed to send HTML email to {}: {}", request.getTo(), e.getMessage());
      throw new MessagingException("Failed to send HTML email: " + e.getMessage());
    }
  }

  public void sendAccountCreationEmail(String userEmail, String userName) {
    String htmlBody = buildAccountCreationTemplate(userName, userEmail);

    EmailRequest request = new EmailRequest(
        userEmail,
        userName,
        "Welcome to BookFair Management System! 🎉",
        htmlBody,
        true
    );

    try {
      sendHtmlEmail(request);
    } catch (MessagingException e) {
      log.error("Failed to send account creation email to {}", userEmail, e);
      throw new RuntimeException("Failed to send account creation email: " + e.getMessage());
    }
  }

  public void sendReservationConfirmation(String to, String userName, String stallName,
      String bookFairName) {
    String htmlBody = buildReservationConfirmationTemplate(userName, stallName, bookFairName);

    EmailRequest request = new EmailRequest(
        to,
        userName,
        "Reservation Confirmation - " + bookFairName,
        htmlBody,
        true
    );

    try {
      sendHtmlEmail(request);
    } catch (MessagingException e) {
      log.error("Failed to send reservation confirmation to {}", to, e);
      throw new RuntimeException("Failed to send reservation confirmation: " + e.getMessage());
    }
  }

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
                .header p {
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.9;
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
                .features {
                    margin: 30px 0;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    margin: 15px 0;
                }
                .feature-icon {
                    background-color: #667eea;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    font-weight: bold;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                    color: white;
                    padding: 15px 40px;
                    text-decoration: none;
                    border-radius: 50px;
                    margin: 20px 0;
                    font-weight: 600;
                    text-align: center;
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
                    <p>Your Gateway to Literary Excellence</p>
                </div>
        
                <div class="content">
                    <p class="welcome-text">Welcome Aboard, %s! 🎉</p>
        
                    <p>We're thrilled to have you join the BookFair Management System community!</p>
        
                    <div class="info-box">
                        <p><strong>Account Created Successfully</strong></p>
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Name:</strong> %s</p>
                    </div>
        
                    <p>Your account has been successfully created and you're all set to explore our platform. Here's what you can do:</p>
        
                    <div class="features">
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div>Browse and discover upcoming book fairs</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div>Reserve stalls for your book exhibitions</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div>Manage your reservations and bookings</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div>Connect with publishers and book enthusiasts</div>
                        </div>
                    </div>
        
                    <center>
                        <a href="#" class="button">Get Started Now</a>
                    </center>
        
                    <p style="margin-top: 30px; color: #666;">If you have any questions or need assistance, our support team is always here to help!</p>
                </div>
        
                <div class="footer">
                    <p><strong>BookFair Management System</strong></p>
                    <p>Connecting Books, Authors, and Readers</p>
                    <p style="margin-top: 15px; font-size: 12px;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(userName, userEmail, userName);
  }

  private String buildReservationConfirmationTemplate(String userName, String stallName,
      String bookFairName) {
    return """
        <html>
        <body>
            <h2>Reservation Confirmation</h2>
            <p>Dear %s,</p>
            <p>Your reservation has been confirmed!</p>
            <ul>
                <li><strong>Stall:</strong> %s</li>
                <li><strong>Book Fair:</strong> %s</li>
            </ul>
            <p>Thank you for your reservation.</p>
            <p>Best regards,<br>Book Fair Team</p>
        </body>
        </html>
        """.formatted(userName, stallName, bookFairName);
  }

}
