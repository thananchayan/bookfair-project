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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}