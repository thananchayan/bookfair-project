package com.bookfair.stall_service.dto.request;

import com.bookfair.stall_service.enums.StallAllocationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStallAllocationRequest {

  @NotNull(message = "Book fair ID is required")
  private Long bookFairId;

  @NotNull(message = "Stall ID is required")
  private Long stallId;

  @NotBlank(message = "Stall location is required")
  private String stallLocation;

  @NotNull(message = "Stall allocation status is required")
  private StallAllocationStatus status;

  private Long price;
}
