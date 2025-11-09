package com.bookfair.vendor_service.service;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserResponse;

public interface VendorService {

  ContentResponse<StallUserResponse> registerUser(CreateStallUserRequest request);
//    ContentResponse<VendorResponse> getVendorById(Long id);
//    ContentResponse<VendorResponse> updateVendorProfile(Long id, VendorProfileUpdateRequest request);
//    ContentResponse<Void> reserveStall(Long vendorId, Long stallId);
//    ContentResponse<Void> deleteVendor(Long id);
}