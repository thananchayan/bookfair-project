package com.bookfair.stall_service.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMultipleStallAllocationRequest {

  @NotNull(message = "Book Fair ID is required")
  private Long bookFairId;

  @NotNull(message = "Hall IDs and Stall IDs are required")
  private List<HallStallAndStallIdsRequest> hallStallAndStallIds;

}
