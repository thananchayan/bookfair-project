package com.bookfair.vendor_service.service;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateVendorRequest;
import com.bookfair.vendor_service.dto.request.UpdateVendorRequest;
import com.bookfair.vendor_service.dto.response.VendorResponse;

import java.util.List;

public interface VendorService {

    ContentResponse<VendorResponse> createVendor(CreateVendorRequest createVendorRequest);

    ContentResponse<VendorResponse> getVendorById(Long id);

    ContentResponse<List<VendorResponse>> getAllVendors();

    ContentResponse<VendorResponse> updateVendor(Long id, UpdateVendorRequest updateVendorRequest);

    ContentResponse<Void> deleteVendorById(Long id);
}
