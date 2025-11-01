package com.bookfair.vendor_service.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfileUpdateRequest {

    @Size(min = 2, message = "Business Name must be at least 2 characters")
    private String businessName;

    private String contactPerson;

    // Field for literary genres
    private String literaryGenres;
}