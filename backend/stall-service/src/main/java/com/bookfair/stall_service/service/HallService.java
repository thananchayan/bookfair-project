package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateHallRequest;
import com.bookfair.stall_service.dto.response.HallResponse;
import com.bookfair.stall_service.dto.response.HallSizeResponse;
import java.util.List;


public interface HallService {

  ContentResponse<HallResponse> createHall(CreateHallRequest request);

  ContentResponse<List<HallResponse>> getAllHalls();

  ContentResponse<HallResponse> getHallById(Long id);

  ContentResponse<Void> deleteHallById(Long id);

  ContentResponse<HallResponse> updateHall(Long id, CreateHallRequest request);

  HallSizeResponse getHallsize(Long bookFairId);

  List<HallResponse> getHallsByBookfairId(Long bookFairId);

}
