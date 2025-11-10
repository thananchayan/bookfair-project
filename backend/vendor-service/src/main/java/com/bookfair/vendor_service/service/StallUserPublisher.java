package com.bookfair.vendor_service.service;

import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserMessage;

public interface StallUserPublisher {

  void publishCreateStallUser(CreateStallUserRequest request);

  void publishUpdateStallUser(UpdateStallUserMessage message);

  void publishGetStallUser(String username);
}
