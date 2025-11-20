package com.bookfair.notification_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallServiceResponse {

  private String action;
  private String status;
  private String code;
  private String message;
  private QrReadResponse data;
}
