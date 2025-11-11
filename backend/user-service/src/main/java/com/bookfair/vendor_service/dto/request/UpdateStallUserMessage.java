package com.bookfair.vendor_service.dto.request;

import com.bookfair.vendor_service.enums.UserProfession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStallUserMessage {

  private Long userId;
  private String username;
  private String oldPassword;
  private String newPassword;
  private String phonenumber;
  private String address;
  private UserProfession profession;
}

