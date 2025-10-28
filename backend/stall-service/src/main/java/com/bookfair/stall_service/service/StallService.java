package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallRequest;
import com.bookfair.stall_service.dto.request.UpdateStallRequest;
import com.bookfair.stall_service.dto.response.StallResponse;
import java.util.List;

public interface StallService {

  ContentResponse<StallResponse> createStall(CreateStallRequest createStallRequest);

  ContentResponse<List<StallResponse>> getAllStalls();

  ContentResponse<StallResponse> getStallById(Long id);

  ContentResponse<StallResponse> updateStall(Long id, UpdateStallRequest request);

  ContentResponse<Void> deleteStallById(Long id);

  ContentResponse<Void> deleteAllStalls();

}
