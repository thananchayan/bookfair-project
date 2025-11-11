package com.bookfair.stall_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificationRequest {
  private String email;
  private String userName;
  private String subject;
  private String body;
  private String qrCodeReference;
}

