package com.bookfair.stall_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReservationResponse {
    private Long id;
    private Long userId;
    private Long stallId;
    private Long bookFairId;
    private String status;
    private String qrCodeReference;
}