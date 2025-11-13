package com.bookfair.stall_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateHallRequest {

  @NotNull(message = "Book fair ID is required")
  private Long bookFairId;
  @NotNull(message = "Hall name is required")
  private String hallName;
  private int row;
  private int column;
  private int innerRing;
  private int outerRing;
}
