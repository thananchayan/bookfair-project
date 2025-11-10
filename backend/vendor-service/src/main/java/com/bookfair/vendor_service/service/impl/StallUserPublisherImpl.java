package com.bookfair.vendor_service.service.impl;

import com.bookfair.vendor_service.configuration.RabbitMQConfig;
import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserMessage;
import com.bookfair.vendor_service.service.StallUserPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StallUserPublisherImpl implements StallUserPublisher {

  private final RabbitTemplate rabbitTemplate;

  @Override
  public void publishCreateStallUser(CreateStallUserRequest request) {
    log.info("Publishing CreateStallUserRequest in vendor service: {}", request.getUsername());
    rabbitTemplate.convertAndSend(
        RabbitMQConfig.STALL_USER_QUEUE,
        request
    );
  }

  @Override
  public void publishUpdateStallUser(UpdateStallUserMessage message) {
    log.info("Publishing stall user update request for userId: {}", message.getUsername());
    rabbitTemplate.convertAndSend(
        RabbitMQConfig.EXCHANGE,
        RabbitMQConfig.STALL_USER_UPDATE_ROUTING_KEY,
        message
    );
  }

  @Override
  public void publishGetStallUser(String username) {
    String usernameMessage = username;
    log.info("Publishing GetStallUserRequest in vendor service for username: {}", username);
    rabbitTemplate.convertAndSend(
        RabbitMQConfig.EXCHANGE,
        RabbitMQConfig.STALL_USER_GET_ROUTING_KEY,
        usernameMessage
    );
  }
}
