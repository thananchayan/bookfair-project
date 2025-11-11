package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.StallReservationRequest;
import com.bookfair.stall_service.dto.response.UserReservationResponse;
import java.util.List;

public interface BookFairStallUserService {

    ContentResponse<UserReservationResponse> reserveStall(
            Long userId,
            StallReservationRequest request);

    ContentResponse<List<UserReservationResponse>> getReservationsByUserId(
            Long userId);
}