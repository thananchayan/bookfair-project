package com.bookfair.notification_service.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bookfair.notification_service.dto.ContentResponse;
import com.bookfair.notification_service.dto.StallReservationResponse;
import java.util.List;


@FeignClient(name = "stall-service", url = "http://localhost:8081")
public interface StallServiceClient {

    @GetMapping("/api/stall-reservation/by-token/{token}")
    ContentResponse<List<StallReservationResponse>> getByToken(@PathVariable String token);
}
