package com.bookfair.notification_service.dto.request;

import com.bookfair.notification_service.enums.UserProfession;
import jakarta.validation.constraints.Email;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationEmailRequest {

  @Email(message = "Invalid email format")
  private String email;
  private UserProfession userProfession;
  private String subject;
  private String body;
  private String reservationToken;
  private Map<String, byte[]> inlineImages;
}
