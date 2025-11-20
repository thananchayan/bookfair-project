package com.bookfair.stall_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserServiceResponse<T> {

  private String action;
  private String status;
  private String code;
  private String message;
  private T data;
}
