package com.bookfair.stall_service.dto.emailDto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStallReservationEmailRequest {

  private Long userId;
  private String userEmail;
  private String userProfession;
  private List<Long> stallAllocationId;
}
