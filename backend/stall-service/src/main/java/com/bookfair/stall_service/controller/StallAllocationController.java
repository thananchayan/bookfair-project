package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateMultipleStallAllocationRequest;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.request.UpdateStallAllocationPrice;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.service.StallAllocationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

  @PostMapping("/multipleStallAllocations")
  public ResponseEntity<ContentResponse<List<StallAllocationResponse>>> createMultipleStallAllocation(
      @Valid @RequestBody CreateMultipleStallAllocationRequest request) {
    return ResponseEntity.ok(stallAllocationService.createMultipleStallAllocation(request));
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

  @PutMapping("update/{id}")
  public ResponseEntity<ContentResponse<StallAllocationResponse>> updateStallAllocation(
      @Valid @RequestBody UpdateStallAllocationPrice request, Long id) {
    return ResponseEntity.ok(stallAllocationService.updateStallAllocationById(id, request));
  }

  @GetMapping("/bookfair/{bookFairId}")
  public ResponseEntity<ContentResponse<List<StallAllocationResponse>>> getStallAllocationsByBoofairId(
      Long bookFairId) {
    return ResponseEntity.ok(stallAllocationService.getStallAllocationsByBoofairId(bookFairId));
  }

  @GetMapping("/bookfair/status/{bookFairId}")
  public ResponseEntity<ContentResponse<List<StallAllocationResponse>>> getActiveStallAllocationsByBoofairId(
      @PathVariable Long bookFairId, @RequestParam StallAllocationStatus status) {
    return ResponseEntity.ok(
        stallAllocationService.getStallAllocationsByBoofairIdAndStatus(bookFairId, status));
  }

  @GetMapping("/availableStalls/{bookFairId}")
  public ResponseEntity<ContentResponse<List<StallEntity>>> getAvailableStallsByBookFairId(
      @PathVariable Long bookFairId) {
    return ResponseEntity.ok(stallAllocationService.getAvailableStallsByBookFairId(bookFairId));
  }

  @GetMapping("/allocated/{bookFairId}")
  public ResponseEntity<ContentResponse<List<StallEntity>>> getAllocatedStallsByBookFairId(
      @PathVariable Long bookFairId) {
    return ResponseEntity.ok(stallAllocationService.getAllocatedStallsByBookFairId(bookFairId));
  }
}