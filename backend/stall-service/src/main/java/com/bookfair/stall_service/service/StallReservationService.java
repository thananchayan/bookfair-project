package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.QrReadResponse;
import com.bookfair.stall_service.dto.response.ReservationResponse;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.dto.response.StallReservationResponse;
import java.util.List;

public interface StallReservationService {

  ContentResponse<ReservationResponse> createReservation(
      CreateStallReservationRequest request);

  ContentResponse<ReservationResponse> getReservationById(Long id);
//
//  ContentResponse<List<StallReservationResponse>> getReservationsForUser(Long userId);
//
//  ContentResponse<Void> cancelReservation(Long id, Long userId);

  ContentResponse<List<StallAllocationResponse>> getAllReservationsForBookFair(Long bookFairId);

  ContentResponse<Void> cancelReservation(Long id, Long userId);

  ContentResponse<QrReadResponse> getReservationByToken(String token);

  ContentResponse<List<StallReservationResponse>> getStallsByReservationToken(String token);
}