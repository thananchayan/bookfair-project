package com.bookfair.reservation_service.request;

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
