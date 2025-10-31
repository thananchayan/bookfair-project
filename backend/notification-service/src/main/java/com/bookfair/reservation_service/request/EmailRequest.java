package com.bookfair.reservation_service.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
//@NoArgsConstructor
public class EmailRequest {

  private String email;
  private String userName;
  private String subject;
  private String body;
  private boolean isHtml;

}
