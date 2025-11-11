package com.bookfair.notification_service.dto.request;

import com.bookfair.notification_service.enums.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StallRequest {

  public String stallName;
  public Size stallSize;
}
