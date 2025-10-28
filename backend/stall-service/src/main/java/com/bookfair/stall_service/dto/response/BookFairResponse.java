package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.BookFairStatus;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookFairResponse {

  private Long id;
  private String name;
  private LocalDate startDate;
  private LocalDate endDate;
  private String organizer;
  private String location;
  private Integer durationDays;
  private String description;
  private BookFairStatus status;
}
