package com.bookfair.stall_service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStallReservationRequest {

  @NotNull(message = "User ID is required")
  private Long userId;

  @NotNull(message = "Stall Allocation IDs are required")
  @Size(min = 1, max = 3, message = "You can reserve  stalls between 1 and 3")
  private List<Long> stallAllocationId;
}