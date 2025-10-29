package com.bookfair.vendor_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {
    private Long id;
    private String businessName;
    private String email;
    private String contactPerson;
    private Integer stallsReservedCount;
}
