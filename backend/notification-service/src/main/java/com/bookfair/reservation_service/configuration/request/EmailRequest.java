package com.bookfair.reservation_service.configuration.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
//@NoArgsConstructor
public class EmailRequest {

  private String to;
  private String userName;
  private String subject;
  private String body;
  private boolean isHtml;

}
