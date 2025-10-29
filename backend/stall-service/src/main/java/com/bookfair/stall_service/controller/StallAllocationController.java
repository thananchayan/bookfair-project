package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.service.StallAllocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
