package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.request.EmailNotificationRequest;

public interface EmailNotificationPublisher {
  void publishEmailNotification(EmailNotificationRequest request);
}

