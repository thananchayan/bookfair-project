package com.bookfair.stall_service.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StallAllocationStatus {
  PENDING,
  APPROVED,
  REJECTED,
  CANCELLED;


}
