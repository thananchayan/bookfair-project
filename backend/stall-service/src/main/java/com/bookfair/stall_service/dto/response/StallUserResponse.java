package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.UserProfession;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StallUserResponse {

  private Long id;
  private String username;
  private String phonenumber;
  private String address;
  private UserProfession profession;
  private LocalDate date;
}
