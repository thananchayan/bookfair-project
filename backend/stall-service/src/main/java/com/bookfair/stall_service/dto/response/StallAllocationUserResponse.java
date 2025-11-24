package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.Size;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallAllocationUserResponse {
  private String bookFairName;
  private String hallName;
  private String stallName;
  private Size stallSize;
  private Long price;
  private StallAllocationStatus stallAllocationStatus;
}
