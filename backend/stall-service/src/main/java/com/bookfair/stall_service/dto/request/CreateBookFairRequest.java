package com.bookfair.stall_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookFairRequest {

  @NotBlank(message = "Name is required")
  private String name;

  @NotNull(message = "Start date is required")
  private LocalDate startDate;

  @NotNull(message = "Start date is required")
  private LocalDate endDate;

  @NotBlank(message = "Organizer is required")
  private String organizer;

  @NotBlank(message = "Location is required")
  private String location;

  @PositiveOrZero(message = "Duration must be zero or positive")
  private Integer durationDays;

  private String description;

}
