package com.bookfair.stall_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStallAllocationRequest {

  @NotNull(message = "Book Fair ID is required")
  private Long bookFairId;

  @NotNull(message = "Hall Stall ID is required")
  private Long hallStallID;

  @NotNull(message = "Stall ID is required")
  private Long stallId;

  private Long price;
}
