package com.bookfair.vendor_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorReservationResponse {
    private Long reservationId;
    private Long stallId;
    private String stallName;
    private Long bookFairId;
    private String bookFairName;
    private String qrCodeReference;
    private String status;
 }