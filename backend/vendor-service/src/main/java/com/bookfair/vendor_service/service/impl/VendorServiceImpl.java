package com.bookfair.vendor_service.service.impl;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.VendorRegistrationRequest;
import com.bookfair.vendor_service.dto.request.VendorProfileUpdateRequest;
import com.bookfair.vendor_service.dto.response.VendorResponse;
import com.bookfair.vendor_service.entity.Vendor;
import com.bookfair.vendor_service.exception.VendorAlreadyExistsException;
import com.bookfair.vendor_service.repository.VendorRepo;
import com.bookfair.vendor_service.service.VendorService;
import com.bookfair.vendor_service.enums.RequestStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.bookfair.vendor_service.service.StallServiceClient;
@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepo vendorRepo;
    private final StallServiceClient stallServiceClient;

    @Override
    @Transactional
    public ContentResponse<VendorResponse> registerVendor(VendorRegistrationRequest request) {

        if (vendorRepo.existsByEmail(request.getEmail())) {
            throw new VendorAlreadyExistsException(request.getEmail());
        }

        Vendor vendor = vendorRepo.save(mapToEntity(request));

        return new ContentResponse<>(
                "Vendor",
                RequestStatus.SUCCESS.getStatus(),
                "201",
                "Vendor registered successfully",
                mapToResponse(vendor)
        );
    }

    @Override
    public ContentResponse<VendorResponse> getVendorById(Long id) {
        Vendor vendor = vendorRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found"));

        return new ContentResponse<>(
                "Vendor",
                RequestStatus.SUCCESS.getStatus(),
                "200",
                "Vendor details retrieved",
                mapToResponse(vendor)
        );
    }

    @Override
    @Transactional
    public ContentResponse<VendorResponse> updateVendorProfile(Long id, VendorProfileUpdateRequest request) {
        Vendor vendor = vendorRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found"));

        vendor.setBusinessName(request.getBusinessName());
        vendor.setContactPerson(request.getContactPerson());

        return new ContentResponse<>(
                "Vendor",
                RequestStatus.SUCCESS.getStatus(),
                "200",
                "Vendor updated successfully",
                mapToResponse(vendor)
        );
    }

    private Vendor mapToEntity(VendorRegistrationRequest request) {
        return Vendor.builder()
                .businessName(request.getBusinessName())
                .email(request.getEmail())
                .password(request.getPassword())
                .contactPerson(request.getContactPerson())
                .stallsReservedCount(0)
                .build();
    }

    private VendorResponse mapToResponse(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .businessName(vendor.getBusinessName())
                .email(vendor.getEmail())
                .contactPerson(vendor.getContactPerson())
                .stallsReservedCount(vendor.getStallsReservedCount())
                .build();
    }

    @Override
    @Transactional
    public ContentResponse<Void> reserveStall(Long vendorId, Long stallId){
        Vendor vendor = vendorRepo.findById(vendorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found"));

        if (vendor.getStallsReservedCount() >= 3){
            throw new IllegalArgumentException("Reservation limit reached. A vendor may reserve at most 3 stalls.");
        }

        ResponseEntity<ContentResponse<Object>> response = stallServiceClient.reserveStall(stallId,vendorId);

        if (response.getStatusCode().is2xxSuccessful()){
            vendor.setStallsReservedCount(vendor.getStallsReservedCount() + 1);
            vendorRepo.save(vendor);

            return new ContentResponse<>(
                    "Reservation",
                    RequestStatus.SUCCESS.getStatus(),
                    "200",
                    "Stall successfully reserved and count updated.",
                    null
            );
        }
        else {
            throw new ResponseStatusException(
                    response.getStatusCode(),
                    "Stall reservation failed on Stall Service: " + response.getBody().getMessage()
            );
        }
    }
}