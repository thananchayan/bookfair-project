package com.bookfair.vendor_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetReservationsRequest {
    private Long vendorId;
    private String replyToQueue; // For Request-Reply pattern
}