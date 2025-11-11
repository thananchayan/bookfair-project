package com.bookfair.vendor_service.feign;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.StallReservationRequest;
import com.bookfair.vendor_service.dto.response.UserReservationResponse;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@FeignClient(name = "stall-service", url = "${stall.service.url:http://stall-service}", path = "/api/reserve-management")
public interface StallServiceClient {


    @PostMapping("/reserve/{userId}")
    ContentResponse<UserReservationResponse> reserveStall(
            @PathVariable("userId") Long userId,
            @RequestBody StallReservationRequest request,

            @RequestHeader("Authorization") String authorizationHeader
    );

    @GetMapping("/user/{userId}")
    ContentResponse<List<UserReservationResponse>> getReservationsByUserId(
            @PathVariable("userId") Long userId,

            @RequestHeader("Authorization") String authorizationHeader
    );
}