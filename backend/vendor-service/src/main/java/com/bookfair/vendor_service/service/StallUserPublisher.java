package com.bookfair.vendor_service.service;

import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;

public interface StallUserPublisher {

  void publishCreateStallUser(CreateStallUserRequest request);
}
