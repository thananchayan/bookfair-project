package com.bookfair.vendor_service.service.impl;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserMessage;
import com.bookfair.vendor_service.dto.request.UpdateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserProfileResponse;
import com.bookfair.vendor_service.dto.response.StallUserResponse;
import com.bookfair.vendor_service.dto.response.StallUserResponseMessage;
import com.bookfair.vendor_service.listener.StallUserResponseListener;
import com.bookfair.vendor_service.service.StallUserPublisher;
import com.bookfair.vendor_service.service.VendorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bookfair.vendor_service.dto.response.VendorReservationResponse; // NEW IMPORT
import com.bookfair.vendor_service.feign.StallServiceClient; // NEW IMPORT
import java.util.List;
@Service
@RequiredArgsConstructor
@Slf4j
public class VendorServiceImpl implements VendorService {

  private final StallUserPublisher stallUserPublisher;
  private final StallUserResponseListener stallUserResponseListener;

  private final StallServiceClient stallServiceClient;
  @Override
  @Transactional
  public ContentResponse<StallUserResponse> registerUser(CreateStallUserRequest request) {
    log.info("Registering vendor with username in vendor serviceIMPL: {}", request.getUsername());
    stallUserPublisher.publishCreateStallUser(request);

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

  @Override
  public ContentResponse<StallUserResponse> updateUser(Long userID,
      UpdateStallUserRequest request) {
    log.info("Updating vendor with userId: {}", userID);
    UpdateStallUserMessage message = UpdateStallUserMessage.builder()
        .userId(userID)
        .username(request.getUsername())
        .oldPassword(request.getOld_password())
        .newPassword(request.getNew_password())
        .phonenumber(request.getPhonenumber())
        .address(request.getAddress())
        .profession(request.getProfession())
        .build();

    stallUserPublisher.publishUpdateStallUser(message);

    StallUserResponseMessage responseMessage = waitForUpdateResponse(5000);

    if (responseMessage == null) {
      return new ContentResponse<>(
          "vendor-update",
          "TIMEOUT",
          "408",
          "Request timeout. Please try again later.",
          null
      );
    }

    if ("success".equalsIgnoreCase(responseMessage.getStatus())) {
      return new ContentResponse<>(
          "vendor-update",
          "SUCCESS",
          "200",
          responseMessage.getMessage(),
          null
      );
    } else {
      return new ContentResponse<>(
          "vendor-update",
          "FAILURE",
          "500",
          responseMessage.getMessage(),
          null
      );
    }
  }

  @Override
  public ContentResponse<StallUserResponse> getVenderProfileByUsername(String username) {
    log.info("Getting vendor profile for username: {}", username);
    stallUserPublisher.publishGetStallUser(username);

    StallUserProfileResponse profileResponse = waitForGetResponse(5000);

    if (profileResponse == null) {
      return new ContentResponse<>(
          "vendor-profile",
          "TIMEOUT",
          "408",
          "Request timeout. Please try again later.",
          null
      );
    }

    if ("success".equalsIgnoreCase(profileResponse.getStatus())) {
      StallUserResponse userResponse = StallUserResponse.builder()
          .id(profileResponse.getId())
          .username(profileResponse.getUsername())
          .phonenumber(profileResponse.getPhonenumber())
          .address(profileResponse.getAddress())
          .profession(profileResponse.getProfession())
          .build();

      return new ContentResponse<>(
          "vendor-profile",
          "SUCCESS",
          "200",
          profileResponse.getMessage(),
          userResponse
      );
    } else {
      return new ContentResponse<>(
          "vendor-profile",
          "FAILURE",
          "404",
          profileResponse.getMessage(),
          null
      );
    }
  }

  @Override
  public ContentResponse<Void> deleteUser(Long userId) {
    log.info("Deleting vendor with userId in vendor serviceIMPL: {}", userId);
    stallUserPublisher.publishDeleteStallUser(userId);

    StallUserResponseMessage responseMessage = waitForDeleteResponse(5000);

    if (responseMessage == null) {
      return new ContentResponse<>(
          "vendor-delete",
          "TIMEOUT",
          "408",
          "Request timeout. Please try again later.",
          null
      );
    }

    if ("success".equalsIgnoreCase(responseMessage.getStatus())) {
      return new ContentResponse<>(
          "vendor-delete",
          "SUCCESS",
          "200",
          responseMessage.getMessage(),
          null
      );
    } else {
      return new ContentResponse<>(
          "vendor-delete",
          "FAILURE",
          "500",
          responseMessage.getMessage(),
          null
      );
    }
  }

  private StallUserProfileResponse waitForGetResponse(long timeoutMs) {
    long startTime = System.currentTimeMillis();
    while (System.currentTimeMillis() - startTime < timeoutMs) {
      StallUserProfileResponse response = stallUserResponseListener.getLatestGetResponse();
      if (response != null) {
        stallUserResponseListener.clearLatestGetResponse();
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


  private StallUserResponseMessage waitForUpdateResponse(long timeoutMs) {
    long startTime = System.currentTimeMillis();
    while (System.currentTimeMillis() - startTime < timeoutMs) {
      StallUserResponseMessage response = stallUserResponseListener.getLatestUpdateResponse();
      if (response != null) {
        stallUserResponseListener.clearLatestUpdateResponse();
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

  private StallUserResponseMessage waitForDeleteResponse(long timeoutMs) {
    long startTime = System.currentTimeMillis();
    while (System.currentTimeMillis() - startTime < timeoutMs) {
      StallUserResponseMessage response = stallUserResponseListener.getLatestDeleteResponse();
      if (response != null) {
        stallUserResponseListener.clearLatestDeleteResponse();
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

  // Add a new method in VendorServiceImpl.java
  @Override
  public ContentResponse<List<VendorReservationResponse>> getVendorReservations(Long vendorId) {
    log.info("Requesting reservations for vendorId: {}", vendorId);

    GetReservationsRequest request = GetReservationsRequest.builder()
            .vendorId(vendorId)
            .replyToQueue(RabbitMQConfig.VENDOR_RESERVATIONS_REPLY_QUEUE)
            .build();

    // 1. Publish the request
    rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,
            RabbitMQConfig.VENDOR_RESERVATIONS_GET_ROUTING_KEY,
            request
    );

    // 2. Wait for the reply (Need a custom listener/storage to receive the reply)
    // NOTE: For simplicity, assuming a shared listener/storage mechanism similar to StallUserResponseListener exists.
    // In a production system, this would require correlation IDs.
    // Assuming a ReservationResponseListener with getLatestReservationResponse(timeout) exists:

    // ReservationResponseListener responseListener = ... // You need to create and inject this
    // List<VendorReservationResponse> responseData = responseListener.getLatestReservationResponse(5000);

    // --- Mock Blocking Wait for Reservation Response ---
    // NOTE: Implement proper blocking wait using Condition/Lock or a dedicated message listener container.
    // Using a mock return for demonstration:
    List<VendorReservationResponse> mockResponse = List.of();

    if (mockResponse == null) { // or if timeout
      return new ContentResponse<>(
              "VendorReservations", "TIMEOUT", "408",
              "Reservation query timed out.", null
      );
    }

    return new ContentResponse<>(
            "VendorReservations", "SUCCESS", "200",
            "Reservations retrieved successfully", mockResponse
    );
    // --- End Mock ---
  }
  @Override
  public ContentResponse<List<VendorReservationResponse>> getVendorReservations(Long vendorId) {

    try {
      ContentResponse<List<VendorReservationResponse>> response =
              stallServiceClient.getReservationsByVendorId(vendorId);


      if ("SUCCESS".equalsIgnoreCase(response.getStatus())) {
        return new ContentResponse<>(
                "VendorReservations",
                "SUCCESS",
                "200",
                "Reservations retrieved successfully",
                response.getData()
        );
      } else {
        return new ContentResponse<>(
                "VendorReservations",
                "FAILURE",
                response.getStatusCode(),
                response.getMessage(),
                null
        );
      }
    } catch (Exception e) {
      log.error("Failed to get reservations for vendorId: {}", vendorId, e);
      return new ContentResponse<>(
              "VendorReservations",
              "FAILURE",
              "500",
              "Could not connect to Stall Service or internal error.",
              null
      );
    }
  }
}