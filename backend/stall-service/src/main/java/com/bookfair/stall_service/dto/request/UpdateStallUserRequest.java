package com.bookfair.stall_service.dto.request;

import com.bookfair.stall_service.enums.UserProfession;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateStallUserRequest {

  @NotBlank(message = "Username cannot be blank")
  @Email(message = "Username must be a valid email address")
  private String username;

  @NotBlank(message = "Old password cannot be blank")
  private String oldPassword;

  @NotBlank(message = "New password cannot be blank")
  private String newPassword;

  @NotBlank(message = "Phone number cannot be blank")
  @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
  private String phonenumber;

  private String address;

  @NotNull(message = "Profession cannot be null")
  private UserProfession profession;
}
