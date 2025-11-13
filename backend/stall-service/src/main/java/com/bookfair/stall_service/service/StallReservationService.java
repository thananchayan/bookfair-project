package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.ReservationResponse;

public interface StallReservationService {

    ContentResponse<ReservationResponse> createReservation(
            CreateStallReservationRequest request);

//  ContentResponse<StallReservationResponse> getReservationById(Long id);
//
//  ContentResponse<List<StallReservationResponse>> getReservationsForUser(Long userId);
//
//  ContentResponse<Void> cancelReservation(Long id, Long userId);
}