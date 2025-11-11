package com.bookfair.notification_service.dto.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StallAllocationRequest {

  public EmailRequest emailRequest;
  public String bookFairName;
  public List<StallRequest> stallRequest;
}
