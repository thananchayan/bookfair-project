package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.request.UpdateStallAllocationRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.service.StallAllocationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bookfair.stall_service.dto.request.UserStallReservationRequest;
import com.bookfair.stall_service.service.StallAllocationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stall-allocations")
@RequiredArgsConstructor
public class StallAllocationController {

  private final StallAllocationService stallAllocationService;


  @PostMapping
  public ResponseEntity<ContentResponse<StallAllocationResponse>> createStallAllocation(
      @Valid @RequestBody CreateStallAllocationRequest request) {
    return ResponseEntity.ok(stallAllocationService.createStallAllocation(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContentResponse<StallAllocationResponse>> getAllStallAllocationsById(
      Long id) {
    return ResponseEntity.ok(stallAllocationService.getStallAllocationById(id));
  }

  @GetMapping("/getAll")
  public ResponseEntity<ContentResponse<List<StallAllocationResponse>>> getAllStallAllocations() {
    return ResponseEntity.ok(stallAllocationService.getAllStallAllocation());
  }

  @DeleteMapping
  public ResponseEntity<ContentResponse<Void>> deleteStallAllocation(Long id) {
    return ResponseEntity.ok(stallAllocationService.deleteStallAllocation(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ContentResponse<StallAllocationResponse>> updateStallAllocation(
      @Valid @RequestBody UpdateStallAllocationRequest request, Long id) {
    return ResponseEntity.ok(stallAllocationService.updateStallAllocationById(id, request));
  }

  @PostMapping("/reserve")
  public ResponseEntity<ContentResponse<StallAllocationResponse>> reserveStall(
          @Valid @RequestBody UserStallReservationRequest request,
          Authentication authentication) {

    Long vendorId;
    String vendorEmail;

    Object principal = authentication.getPrincipal();

    if (principal instanceof UserDetails userDetails) {
      vendorEmail = userDetails.getUsername();

      try {
        vendorId = Long.parseLong(authentication.getName());
      } catch (NumberFormatException e) {
        throw new SecurityException("Vendor ID could not be extracted/parsed from authentication context. Check JWT configuration.");
      }
    } else {
      throw new SecurityException("User not authenticated or invalid principal type.");
    }

    ContentResponse<StallAllocationResponse> response =
            stallAllocationService.reserveStall(request, vendorId, vendorEmail);

    return ResponseEntity.ok(response);
  }

  @GetMapping("/vendor/{vendorId}")
  public ResponseEntity<ContentResponse<List<StallAllocationResponse>>> getAllReservationsByVendor(
          @PathVariable Long vendorId) {


    ContentResponse<List<StallAllocationResponse>> response =
            stallAllocationService.getAllReservationsByVendor(vendorId);

    return ResponseEntity.ok(response);
  }
}
