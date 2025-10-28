package com.bookfair.stall_service.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RequestStatus {
  SUCCESS("success"),
  FAILURE("failure"),
  ERROR("error");

  private final String status;
}
