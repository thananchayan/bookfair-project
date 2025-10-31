package com.bookfair.reservation_service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
//@NoArgsConstructor
@AllArgsConstructor
public class EmailResponse {

  private boolean success;
  private String message;
}
