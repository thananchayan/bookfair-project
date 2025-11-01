package com.bookfair.vendor_service.service;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.VendorRegistrationRequest;
import com.bookfair.vendor_service.dto.request.VendorProfileUpdateRequest;
import com.bookfair.vendor_service.dto.response.VendorResponse;

public interface VendorService {
    ContentResponse<VendorResponse> registerVendor(VendorRegistrationRequest request);
    ContentResponse<VendorResponse> getVendorById(Long id);
    ContentResponse<VendorResponse> updateVendorProfile(Long id, VendorProfileUpdateRequest request);
}