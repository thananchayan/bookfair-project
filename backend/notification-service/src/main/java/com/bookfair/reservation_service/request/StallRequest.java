package com.bookfair.reservation_service.request;

import com.bookfair.reservation_service.enums.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StallRequest {

  public String stallName;
  public Size stallSize;
}
