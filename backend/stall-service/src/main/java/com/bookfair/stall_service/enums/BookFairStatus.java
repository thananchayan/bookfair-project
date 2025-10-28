package com.bookfair.stall_service.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BookFairStatus {
  UPCOMING,
  ONGOING,
  COMPLETED,
  CANCELLED;
}
