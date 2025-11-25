package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateMultipleStallAllocationRequest;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.request.UpdateStallAllocationPrice;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import java.util.List;

public interface StallAllocationService {

  ContentResponse<StallAllocationResponse> createStallAllocation(
      CreateStallAllocationRequest request);

  ContentResponse<List<StallAllocationResponse>> createMultipleStallAllocation(
      CreateMultipleStallAllocationRequest request);

  ContentResponse<StallAllocationResponse> getStallAllocationById(Long id);

  ContentResponse<List<StallAllocationResponse>> getAllStallAllocation();

  ContentResponse<StallAllocationResponse> updateStallAllocationById(Long id,
      UpdateStallAllocationPrice request);

  ContentResponse<Void> deleteStallAllocation(Long id);

  ContentResponse<List<StallAllocationResponse>> getStallAllocationsByBoofairId(Long bookFairId);

  ContentResponse<List<StallAllocationResponse>> getStallAllocationsByBoofairIdAndStatus(
      Long bookFairId, StallAllocationStatus status);

  ContentResponse<List<StallEntity>> getAvailableStallsByBookFairId(Long bookFairId);

  ContentResponse<List<StallEntity>> getAllocatedStallsByBookFairId(Long bookFairId);
}