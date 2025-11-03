package com.bookfair.vendor_service.service;

import com.bookfair.vendor_service.dto.ContentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name="stall-service",url="${external.services.stall-service.url}")
public interface StallServiceClient {
    @PutMapping("/internal/stalls/reserve/{stallId/{vendorId}")
    ResponseEntity<ContentResponse<Object>> reserveStall(
            
    );
}
