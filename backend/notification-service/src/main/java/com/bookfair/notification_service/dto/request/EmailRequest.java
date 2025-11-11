package com.bookfair.notification_service.dto.request;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequest {

  private String email;
  private String subject;
  private String body;
  private boolean isHtml;

  private Map<String, byte[]> inlineImages;

  public EmailRequest(String email, String subject, String body, boolean html) {
    this.email = email;
    this.subject = subject;
    this.body = body;
    this.isHtml = html;
  }

}
