package com.bookfair.stall_service.dto.emailDto;

import com.bookfair.stall_service.enums.Hall;
import com.bookfair.stall_service.enums.Size;
import com.bookfair.stall_service.enums.UserProfession;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationEmailMessage {

  private String email;
  private UserProfession userProfession;
  private String subject;
  private String bookFairName;
  private String reservationToken;
  private List<StallInfo> stalls;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class StallInfo {

    private Hall hallName;
    private String stallName;
    private Size stallSize;
  }
}
