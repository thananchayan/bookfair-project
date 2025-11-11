package com.bookfair.reservation_service.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QRCodeReadResponse {

  private String data;
  private boolean success;
  private String message;
}
