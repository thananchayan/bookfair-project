package com.bookfair.vendor_service.service;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserResponse;

public interface VendorService {

  ContentResponse<StallUserResponse> registerUser(CreateStallUserRequest request);

  ContentResponse<StallUserResponse> updateUser(Long userID, UpdateStallUserRequest request);

  ContentResponse<StallUserResponse> getVenderProfileByUsername(String username);

  ContentResponse<Void> deleteUser(Long userId);
//    ContentResponse<VendorResponse> getVendorById(Long id);
//    ContentResponse<VendorResponse> updateVendorProfile(Long id, VendorProfileUpdateRequest request);
//    ContentResponse<Void> reserveStall(Long vendorId, Long stallId);


  ContentResponse<UserReservationResponse> reserveStall(
          Long userId,
          StallReservationRequest request,
          String authorizationHeader);


  ContentResponse<List<UserReservationResponse>> getReservationHistory(
          Long userId,
          String authorizationHeader);
}