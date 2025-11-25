package com.bookfair.stall_service.dto.request;

import com.bookfair.stall_service.enums.Hall;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAllHallRequest {

  @NotNull(message = "Book fair ID is required")
  private Long bookFairId;
  @NotNull(message = "Hall name is required")
  private Hall hallName;
  private int row;
  private int column;
  private int innerRing;
  private int outerRing;
}
