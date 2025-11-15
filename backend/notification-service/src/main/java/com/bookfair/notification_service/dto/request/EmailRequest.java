package com.bookfair.notification_service.dto.request;

import com.bookfair.notification_service.enums.UserProfession;
import jakarta.validation.constraints.Email;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailRequest {

  @Email(message = "Invalid email format")
  private String email;
  private UserProfession userProfession;
  private String subject;
  private String body;
  private boolean isHtml;

  private Map<String, byte[]> inlineImages;

  public EmailRequest(String email, UserProfession userProfession, String subject, String body,
      boolean html) {
    this.email = email;
    this.userProfession = userProfession;
    this.subject = subject;
    this.body = body;
    this.isHtml = html;
  }

}
