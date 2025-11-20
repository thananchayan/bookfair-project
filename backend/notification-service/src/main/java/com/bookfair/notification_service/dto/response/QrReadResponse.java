package com.bookfair.notification_service.dto.response;


import com.bookfair.notification_service.enums.Size;
import com.bookfair.notification_service.enums.StallAllocationStatus;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrReadResponse {

  private Long userId;
  private String bookFairName;
  private List<StallInfo> stalls;
  private StallAllocationStatus status;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class StallInfo {

    private String hallName;
    private String stallName;
    private Size stallSize;
  }

}
