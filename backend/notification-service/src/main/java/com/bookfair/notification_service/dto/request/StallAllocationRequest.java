package com.bookfair.notification_service.dto.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class StallAllocationRequest {

  public ReservationEmailRequest emailRequest;
  public String bookFairName;
  public List<StallRequest> stallRequest;

}
