package com.bookfair.stall_service.dto.request;

import com.bookfair.stall_service.enums.UserProfession;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserServiceRequest {

  private Long id;
  private String username;
  private String phone;
  private UserProfession profession;
  private Boolean enabled;
}
