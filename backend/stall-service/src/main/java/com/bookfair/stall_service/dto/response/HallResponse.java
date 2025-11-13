package com.bookfair.stall_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HallResponse {

  private Long id;
  private Long bookFairId;
  private String hallName;
  private int row;
  private int column;
  private int innerRing;
  private int outerRing;
  private int hallSize;
}
