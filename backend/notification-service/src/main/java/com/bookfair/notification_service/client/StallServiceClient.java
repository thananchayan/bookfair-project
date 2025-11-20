package com.bookfair.notification_service.client;

import com.bookfair.notification_service.dto.response.StallServiceResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name = "stall-service", url = "${stall-service.url}")
public interface StallServiceClient {

  @GetMapping("/api/stall-reservation/token/{token}")
  StallServiceResponse getReservationByToken(@PathVariable("token") String token);
}
