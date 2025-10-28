package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.Size;
import com.bookfair.stall_service.enums.Status;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StallResponse {

  private Long id;
  private String stallName;
  private Size size;
  private Status status;
  private String description;
}
