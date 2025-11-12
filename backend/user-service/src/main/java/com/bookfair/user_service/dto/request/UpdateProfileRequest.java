package com.bookfair.user_service.dto.request;

import com.bookfair.user_service.enums.UserProfession;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

  @NotBlank(message = "Username cannot be blank")
  @Email(message = "Username should be a valid email")
  private String username;
  @NotBlank(message = "Phone number cannot be blank")
  @Pattern(regexp = "^0[0-9]{9}$", message = "Phone number look like 07XXXXXXXXX")
  private String phonenumber;
  private String address;
  private UserProfession profession;
}
