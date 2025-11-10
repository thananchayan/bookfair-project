package com.bookfair.vendor_service.listener;

import com.bookfair.vendor_service.configuration.RabbitMQConfig;
import com.bookfair.vendor_service.dto.response.StallUserResponseMessage;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StallUserResponseListener {

  private final Map<String, StallUserResponseMessage> responseCache = new ConcurrentHashMap<>();

  @RabbitListener(queues = RabbitMQConfig.STALL_USER_RESPONSE_QUEUE)
  public void handleStallUserResponse(StallUserResponseMessage response) {
    log.info("Received response from stall-service: status={}, message={}",
        response.getStatus(), response.getMessage());
    responseCache.put("latest", response);
  }

  @RabbitListener(queues = RabbitMQConfig.STALL_USER_UPDATE_RESPONSE_QUEUE)
  public void handleStallUserUpdateResponse(StallUserResponseMessage response) {
    log.info("Received update response from stall-service: status={}, message={}",
        response.getStatus(), response.getMessage());
    responseCache.put("update", response);
  }

  public StallUserResponseMessage getLatestResponse() {
    return responseCache.get("latest");
  }

  public StallUserResponseMessage getLatestUpdateResponse() {
    return responseCache.get("update");
  }

  public void clearLatestResponse() {
    responseCache.remove("latest");
  }

  public void clearLatestUpdateResponse() {
    responseCache.remove("update");
  }
}
