package com.bookfair.vendor_service.service;


import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserResponse;
import java.util.List;

public interface StallUserService {

  StallUserResponse createStallUser(CreateStallUserRequest request);

  StallUserResponse getStallUserById(Long id);

  StallUserResponse getStallUserByUsername(String username);

  StallUserResponse getStallUserByQrId(String qrId);

  List<StallUserResponse> getAllStallUsers();

  StallUserResponse updateStallUser(Long id, UpdateStallUserRequest request);

  void deleteStallUser(Long id);

}
