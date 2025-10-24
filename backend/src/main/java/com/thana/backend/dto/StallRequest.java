package com.thana.backend.dto;

import com.thana.backend.Enum.StallSize;
import com.thana.backend.Enum.StallStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StallRequest {

  private String name;
  private String location;
  private StallSize stallSize;
  private StallStatus stallStatus;
}
