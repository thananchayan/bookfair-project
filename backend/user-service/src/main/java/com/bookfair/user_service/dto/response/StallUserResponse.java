package com.bookfair.user_service.dto.response;

import com.bookfair.user_service.enums.BookGenres;
import com.bookfair.user_service.enums.UserProfession;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallUserResponse {

  private Long id;
  private String username;
  private String phonenumber;
  private String address;
  private UserProfession profession;
  private LocalDate date;
  private BookGenres bookGenres;

}
