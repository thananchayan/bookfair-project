//package com.bookfair.stall_service.service.impl;
//
//import com.bookfair.stall_service.configuration.RabbitMQConfig;
//import com.bookfair.stall_service.dto.request.EmailNotificationRequest;
//import com.bookfair.stall_service.service.EmailNotificationPublisher;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class EmailNotificationPublisherImpl implements EmailNotificationPublisher {
//
//  private final RabbitTemplate rabbitTemplate;
//
//  @Override
//  public void publishEmailNotification(EmailNotificationRequest request) {
//    log.info("Publishing email notification for user: {}", request.getUserName());
//    try {
//      rabbitTemplate.convertAndSend(
//          RabbitMQConfig.EXCHANGE,
//          RabbitMQConfig.EMAIL_NOTIFICATION_ROUTING_KEY,
//          request
//      );
//      log.info("Email notification published successfully for: {}", request.getEmail());
//    } catch (Exception e) {
//      log.error("Failed to publish email notification for: {}", request.getEmail(), e);
//      // Don't throw exception - email failure shouldn't break user creation
//    }
//  }
//}
//
