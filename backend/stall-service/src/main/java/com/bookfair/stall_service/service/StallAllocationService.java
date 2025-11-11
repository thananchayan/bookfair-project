package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.request.UpdateStallAllocationRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import java.util.List;

public interface StallAllocationService {

  ContentResponse<StallAllocationResponse> createStallAllocation(
      CreateStallAllocationRequest request);

  ContentResponse<StallAllocationResponse> getStallAllocationById(Long id);

  ContentResponse<List<StallAllocationResponse>> getAllStallAllocation();

  ContentResponse<StallAllocationResponse> updateStallAllocationById(Long id,
      UpdateStallAllocationRequest request);

  ContentResponse<Void> deleteStallAllocation(Long id);

  ContentResponse<StallAllocationResponse> allocateStallToBookFair(Long stallId, Long bookFairId);

  ContentResponse<List<StallAllocationResponse>> getAllReservationsByVendor(Long vendorId);
}
