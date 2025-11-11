//package com.bookfair.stall_service.listener;
//
//import com.bookfair.stall_service.configuration.RabbitMQConfig;
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
//public class StallUserDeleteListener {
//
//  private final StallUserService stallUserService;
//  private final RabbitTemplate rabbitTemplate;
//
//  @RabbitListener(queues = RabbitMQConfig.STALL_USER_DELETE_QUEUE)
//  public void handleDeleteStallUser(Long userId) {
//    log.info("Received DeleteStallUserRequest in stall-service for userId: {}", userId);
//    StallUserResponseMessage responseMessage;
//    try {
//      stallUserService.deleteStallUser(userId);
//      responseMessage = StallUserResponseMessage.builder()
//          .status("success")
//          .message("Stall user deleted successfully")
//          .errorCode(null)
//          .build();
//      log.info("Successfully processed DeleteStallUserRequest for userId: {}", userId);
//    } catch (Exception e) {
//      log.error("Error processing DeleteStallUserRequest for userId: {}: {}",
//          userId, e.getMessage());
//      responseMessage = StallUserResponseMessage.builder()
//          .status("failure")
//          .message(e.getMessage())
//          .errorCode("500")
//          .build();
//    }
//    rabbitTemplate.convertAndSend(
//        RabbitMQConfig.EXCHANGE,
//        RabbitMQConfig.STALL_USER_DELETE_RESPONSE_ROUTING_KEY,
//        responseMessage
//    );
//  }
//}
//
