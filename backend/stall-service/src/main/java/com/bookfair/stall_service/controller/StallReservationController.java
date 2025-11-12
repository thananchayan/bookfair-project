package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.service.StallAllocationService;
import com.bookfair.stall_service.service.StallReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stall-reservation")
@RequiredArgsConstructor
public class StallReservationController {
    private final StallReservationService stallReservationService;

    @PostMapping
    public ResponseEntity<ContentResponse<StallAllocationResponse>> createStallReservation(
            @Valid @RequestBody CreateStallAllocationRequest request) {
        return ResponseEntity.ok(stallReservationService.createStallReservation(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse<StallAllocationResponse>> getAllStallReservationById(
            Long id) {
        return ResponseEntity.ok(stallReservationService.getAllStallReservationById(id));
    }


}
