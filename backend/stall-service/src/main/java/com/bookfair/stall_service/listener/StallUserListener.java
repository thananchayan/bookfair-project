//package com.bookfair.stall_service.listener;
//
//import com.bookfair.stall_service.configuration.RabbitMQConfig;
//import com.bookfair.stall_service.dto.request.CreateStallUserRequest;
//import com.bookfair.stall_service.dto.response.StallUserResponse;
//import com.bookfair.stall_service.dto.response.StallUserResponseMessage;
//import com.bookfair.stall_service.service.StallUserService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class StallUserListener {
//
//  private final StallUserService stallUserService;
//  private final RabbitTemplate rabbitTemplate;
//
//  @RabbitListener(queues = RabbitMQConfig.STALL_USER_QUEUE)
//  public void handleCreateStallUser(CreateStallUserRequest request) {
//    log.info("Received CreateStallUserRequest in stall-service: {}", request.getUsername());
//    StallUserResponseMessage responseMessage;
//    try {
//      StallUserResponse response = stallUserService.createStallUser(request);
//      responseMessage = StallUserResponseMessage.builder()
//          .status("success")
//          .message("Stall user created successfully")
//          .errorCode(null)
//          .build();
//      log.info("Successfully processed CreateStallUserRequest for username: {}",
//          request.getUsername());
//    } catch (Exception e) {
//      log.error("Error processing CreateStallUserRequest for username: {}: {}",
//          request.getUsername(), e.getMessage());
//      responseMessage = StallUserResponseMessage.builder()
//          .status("failure")
//          .message(e.getMessage())
//          .errorCode("500")
//          .build();
//    }
//    rabbitTemplate.convertAndSend(
//        RabbitMQConfig.EXCHANGE,
//        RabbitMQConfig.STALL_USER_RESPONSE_ROUTING_KEY,
//        responseMessage
//    );
//  }
//}
