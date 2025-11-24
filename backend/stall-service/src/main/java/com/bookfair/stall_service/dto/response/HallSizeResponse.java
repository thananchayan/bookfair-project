package com.bookfair.stall_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HallSizeResponse {

  private int topRows;
  private int topCols;
  private int leftRows;
  private int leftCols;
  private int rightRows;
  private int rightCols;
  private int innerRing;
  private int outerRing;
}
