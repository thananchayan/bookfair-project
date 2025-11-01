package com.bookfair.vendor_service.service.impl;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.VendorRegistrationRequest;
import com.bookfair.vendor_service.dto.request.VendorProfileUpdateRequest;
import com.bookfair.vendor_service.dto.response.VendorResponse;
import com.bookfair.vendor_service.entity.Vendor;
import com.bookfair.vendor_service.exception.VendorAlreadyExistsException;
import com.bookfair.vendor_service.repository.VendorRepo;
import com.bookfair.vendor_service.service.VendorService;
import com.bookfair.vendor_service.enums.RequestStatus; // Explicitly import RequestStatus
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepo vendorRepo;

    @Override
    @Transactional
    public ContentResponse<VendorResponse> registerVendor(VendorRegistrationRequest request) {

        // Check if the vendor already exists by email
        if (vendorRepo.existsByEmail(request.getEmail())) {
            throw new VendorAlreadyExistsException(request.getEmail());
        }

        Vendor newVendor = Vendor.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .businessName(request.getBusinessName())
                .contactPerson(request.getContactPerson())
                .stallsReservedCount(0)
                .build();

        Vendor savedVendor = vendorRepo.save(newVendor);


        VendorResponse response = VendorResponse.builder()
                .id(savedVendor.getId())
                .email(savedVendor.getEmail())
                .businessName(savedVendor.getBusinessName())
                .contactPerson(savedVendor.getContactPerson())
                .stallsReservedCount(savedVendor.getStallsReservedCount())
                .build();

        return ContentResponse.<VendorResponse>builder()
                .type("success")
                .status(RequestStatus.SUCCESS.getStatus())
                .statusCode("201")
                .message("Vendor registration successful.")
                .data(response)
                .build();
    }

    @Override
    public ContentResponse<VendorResponse> getVendorById(Long id) {
        Vendor vendor = vendorRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found with id: " + id));

        VendorResponse response = VendorResponse.builder()
                .id(vendor.getId())
                .email(vendor.getEmail())
                .businessName(vendor.getBusinessName())
                .contactPerson(vendor.getContactPerson())
                .stallsReservedCount(vendor.getStallsReservedCount())
                .build();

        return ContentResponse.<VendorResponse>builder()
                .type("success")
                .status(RequestStatus.SUCCESS.getStatus())
                .statusCode("200")
                .message("Vendor profile retrieved successfully.")
                .data(response)
                .build();
    }

    @Override
    @Transactional
    public ContentResponse<VendorResponse> updateVendorProfile(Long id, VendorProfileUpdateRequest request) {
        Vendor vendor = vendorRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found with id: " + id));

        if (request.getBusinessName() != null && !request.getBusinessName().isBlank()) {
            vendor.setBusinessName(request.getBusinessName());
        }
        if (request.getContactPerson() != null && !request.getContactPerson().isBlank()) {
            vendor.setContactPerson(request.getContactPerson());
        }


        Vendor updatedVendor = vendorRepo.save(vendor);

        VendorResponse response = VendorResponse.builder()
                .id(updatedVendor.getId())
                .email(updatedVendor.getEmail())
                .businessName(updatedVendor.getBusinessName())
                .contactPerson(updatedVendor.getContactPerson())
                .stallsReservedCount(updatedVendor.getStallsReservedCount())
                .build();

        return ContentResponse.<VendorResponse>builder()
                .type("success")
                .status(RequestStatus.SUCCESS.getStatus())
                .statusCode("200")
                .message("Vendor profile updated successfully.")
                .data(response)
                .build();
    }
}