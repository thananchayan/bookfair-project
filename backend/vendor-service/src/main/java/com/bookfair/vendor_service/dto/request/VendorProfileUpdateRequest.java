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

    // Fields related to the user requirement:
    // "In the home screen, the user is prompted to add the literary genres they will be displaying/selling"
    private String literaryGenres;

    // Note: If the vendor is allowed to change their password, a separate DTO for password change is safer.
}