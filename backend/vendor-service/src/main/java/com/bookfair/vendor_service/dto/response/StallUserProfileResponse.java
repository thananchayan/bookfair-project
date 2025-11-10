package com.bookfair.vendor_service.dto.response;

import com.bookfair.vendor_service.enums.UserProfession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallUserProfileResponse {

  private Long id;
  private String username;
  private String phonenumber;
  private String address;
  private UserProfession profession;
  private String status;
  private String message;
}
