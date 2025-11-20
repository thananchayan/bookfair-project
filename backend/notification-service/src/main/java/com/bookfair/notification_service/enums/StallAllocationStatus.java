package com.bookfair.notification_service.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StallAllocationStatus {
  PENDING,
  APPROVED,
  CANCELLED,
  COMPLETED;


}
