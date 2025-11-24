package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.Hall;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HallStallResponse {

  private Long id;
  private Long bookFairId;
  private String stallName;
  private Long hallId;
  private Hall hallName;

}
