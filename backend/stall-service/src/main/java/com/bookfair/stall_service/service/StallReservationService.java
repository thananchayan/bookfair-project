package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;

public interface StallReservationService {
    ContentResponse<StallAllocationResponse> createStallReservation(
            CreateStallAllocationRequest request);

    ContentResponse<StallAllocationResponse> getAllStallReservationById(Long id);
}
