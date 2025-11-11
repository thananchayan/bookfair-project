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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bookfair.vendor_service.dto.response.VendorReservationResponse;
import java.util.List;
import org.springframework.security.core.Authentication;


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

  @GetMapping("/{username}/profile")
  public ResponseEntity<ContentResponse<StallUserResponse>> getVendorProfileByUsername(
      @PathVariable String username) {
    return ResponseEntity.ok(vendorService.getVenderProfileByUsername(username));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ContentResponse<StallUserResponse>> updateVendorProfile(
      @PathVariable Long id,
      @Valid @RequestBody UpdateStallUserRequest request) {
    return ResponseEntity.ok(vendorService.updateUser(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ContentResponse<Void>> deleteVendor(@PathVariable Long id) {
    return ResponseEntity.ok(vendorService.deleteUser(id));
  }

  @GetMapping("/reservations")
  public ResponseEntity<ContentResponse<List<VendorReservationResponse>>> getVendorReservations(
          Authentication authentication) {

    Long vendorId;
    try {
      vendorId = Long.parseLong(authentication.getName());
    } catch (NumberFormatException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ContentResponse<>(
              "VendorReservations", "FAILURE", "401", "Invalid vendor ID in token.", null
      ));
    }
    return ResponseEntity.ok(vendorService.getVendorReservations(vendorId));
  }

}