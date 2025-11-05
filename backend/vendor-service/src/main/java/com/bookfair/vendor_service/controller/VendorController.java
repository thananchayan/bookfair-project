package com.bookfair.vendor_service.controller;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.VendorRegistrationRequest;
import com.bookfair.vendor_service.dto.request.VendorProfileUpdateRequest;
import com.bookfair.vendor_service.dto.response.VendorResponse;
import com.bookfair.vendor_service.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/vendors")
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/register")
    public ResponseEntity<ContentResponse<VendorResponse>> registerVendor(
            @Valid @RequestBody VendorRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vendorService.registerVendor(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse<VendorResponse>> getVendorProfile(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentResponse<VendorResponse>> updateVendorProfile(
            @PathVariable Long id,
            @Valid @RequestBody VendorProfileUpdateRequest request) {
        return ResponseEntity.ok(vendorService.updateVendorProfile(id, request));
    }

    @PostMapping("/{vendorId}/reserve/{stalId}")
    public ResponseEntity<ContentResponse<Void>> reserveStall(
            @PathVariable Long vendorId,
            @PathVariable Long stallId){
                return ResponseEntity.ok(vendorService.reserveStall(vendorId,stallId));
    }

}