package com.bookfair.vendor_service.controller;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserResponse;
import com.bookfair.vendor_service.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  public ResponseEntity<ContentResponse<StallUserResponse>> registerVendor(
      @Valid @RequestBody CreateStallUserRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(vendorService.registerUser(request));
  }

  //  @GetMapping("/{id}")
//  public ResponseEntity<ContentResponse<VendorResponse>> getVendorProfile(@PathVariable Long id) {
//    return ResponseEntity.ok(vendorService.getVendorById(id));
//  }
//
  @PutMapping("/{id}")
  public ResponseEntity<ContentResponse<StallUserResponse>> updateVendorProfile(
      @PathVariable Long id,
      @Valid @RequestBody UpdateStallUserRequest request) {
    return ResponseEntity.ok(vendorService.updateUser(id, request));
  }
//
//  @PostMapping("/{vendorId}/reserve/{stalId}")
//  public ResponseEntity<ContentResponse<Void>> reserveStall(
//      @PathVariable Long vendorId,
//      @PathVariable Long stallId) {
//    return ResponseEntity.ok(vendorService.reserveStall(vendorId, stallId));
//  }

}