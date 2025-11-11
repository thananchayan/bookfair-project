package com.bookfair.stall_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StallReservationRequest {

    @NotNull(message = "Book Fair ID is required for reservation")
    private Long bookFairId;

    @NotNull(message = "Stall ID is required for reservation")
    private Long stallId;
}