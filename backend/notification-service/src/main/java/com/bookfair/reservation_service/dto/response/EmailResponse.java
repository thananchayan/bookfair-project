package com.bookfair.reservation_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
//@NoArgsConstructor
@AllArgsConstructor
public class EmailResponse {

  private String status;
  private String module;
  private String message;
}
