package com.bookfair.reservation_service.configuration.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateAccount {

  private String to;
  private String subject;
  private String body;
  private boolean isHtml;
}
