package com.bookfair.stall_service.dto.response;

import com.bookfair.stall_service.enums.ReservationStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallReservationResponse {

    private Long id;
    private Long userId;
    private Long stallId;
    private Long bookFairId;
    private String qrCodePath;
    private String reservationToken;
    private ReservationStatus status;
}
