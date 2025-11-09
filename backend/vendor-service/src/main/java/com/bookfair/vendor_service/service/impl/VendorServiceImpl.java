package com.bookfair.vendor_service.service.impl;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserResponse;
import com.bookfair.vendor_service.dto.response.StallUserResponseMessage;
import com.bookfair.vendor_service.listener.StallUserResponseListener;
import com.bookfair.vendor_service.service.StallUserPublisher;
import com.bookfair.vendor_service.service.VendorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorServiceImpl implements VendorService {

  private final StallUserPublisher stallUserPublisher;
  private final StallUserResponseListener stallUserResponseListener;

  @Override
  @Transactional
  public ContentResponse<StallUserResponse> registerUser(CreateStallUserRequest request) {
    log.info("Registering vendor with username in vendor serviceIMPL: {}", request.getUsername());
    stallUserPublisher.publishCreateStallUser(request);

    // Wait up to 5 seconds for a response
    StallUserResponseMessage responseMessage = waitForResponse(5000);

    if (responseMessage == null) {
      return new ContentResponse<>(
          "vendor-registration",
          "TIMEOUT",
          "408",
          "Request timeout. Please try again later.",
          null
      );
    }
    if ("success".equalsIgnoreCase(responseMessage.getStatus())) {
      return new ContentResponse<>(
          "vendor-registration",
          "SUCCESS",
          "200",
          responseMessage.getMessage(),
          null
      );
    } else {
      return new ContentResponse<>(
          "vendor-registration",
          "FAILURE",
          "500",
          responseMessage.getMessage(),
          null
      );
    }
  }


  private StallUserResponseMessage waitForResponse(long timeoutMs) {
    long startTime = System.currentTimeMillis();
    while (System.currentTimeMillis() - startTime < timeoutMs) {
      StallUserResponseMessage response = stallUserResponseListener.getLatestResponse();
      if (response != null) {
        stallUserResponseListener.clearLatestResponse();
        return response;
      }
      try {
        Thread.sleep(100);
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        return null;
      }
    }
    return null;
  }
}