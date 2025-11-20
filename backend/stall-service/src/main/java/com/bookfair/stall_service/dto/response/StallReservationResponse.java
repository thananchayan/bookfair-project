package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.StallAllocationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallReservationResponse {

  private Long stallAllocationId;
  private String stallName;
  private StallAllocationStatus status;
}