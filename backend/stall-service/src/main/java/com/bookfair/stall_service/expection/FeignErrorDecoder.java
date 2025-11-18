package com.bookfair.stall_service.expection;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class FeignErrorDecoder implements ErrorDecoder {

  @Override
  public Exception decode(String methodKey, Response response) {
    log.error("Feign client error: {} - {}", response.status(), methodKey);

    return switch (response.status()) {
      case 404 -> new IllegalArgumentException("User not found");
      case 503 -> new RuntimeException("User service unavailable");
      default -> new RuntimeException("User service error: " + response.status());
    };
  }
}
