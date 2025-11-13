package com.bookfair.stall_service.dto.request;

import com.bookfair.stall_service.enums.StallAllocationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStallAllocationPrice {

  private StallAllocationStatus stallAllocationStatus;
  private Long price;
}
