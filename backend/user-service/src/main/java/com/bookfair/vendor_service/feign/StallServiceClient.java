package com.bookfair.vendor_service.feign;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.response.VendorReservationResponse;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "stall-service", path = "/api/stall-allocations")
public interface StallServiceClient {


    @GetMapping("/vendor/{vendorId}")
    ContentResponse<List<VendorReservationResponse>> getReservationsByVendorId(
            @PathVariable("vendorId") Long vendorId);
}