package com.bookfair.vendor_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallUserResponseMessage {

  private String status;
  private String message;
  private String errorCode;
}
