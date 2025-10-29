package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.BookFairStatus;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallAllocationResponse {

  private Long id;
  private Long bookFairId;
  private Long stallId;
  private String stallLocation;
  private StallAllocationStatus status;
  private BookFairStatus bookFairStatus;
  private Long price;

}
