package com.bookfair.stall_service.dto.request;

import com.bookfair.stall_service.enums.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateStallRequest {

  @NotBlank(message = "Stall name is required")
  private String stallName;
  @NotNull(message = "Size is required")
  private Size size;
  private String description;
}
