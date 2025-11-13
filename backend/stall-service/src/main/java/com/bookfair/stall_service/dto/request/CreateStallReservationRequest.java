package com.bookfair.stall_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStallReservationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Stall ID is required")
    private Long stallId;

    @NotNull(message = "Book fair ID is required")
    private Long bookFairId;
}
