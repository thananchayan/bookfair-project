package com.bookfair.notification_service.dto;

import lombok.Data;

@Data
public class StallReservationResponse {

  private Long id;
  private Long userId;
  private Long bookFairId;
  private Long stallId;
  private String reservationToken;
  private String status;
  private String qrCodePath;
}
