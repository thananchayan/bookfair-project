package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.StallReservationResponse;
import com.bookfair.stall_service.service.StallReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stall-reservation")
@RequiredArgsConstructor
public class StallReservationController {

    private final StallReservationService reservationService;

    @PostMapping
    public ResponseEntity<ContentResponse<StallReservationResponse>> createReservation(@Valid @RequestBody CreateStallReservationRequest request) {
        return ResponseEntity.ok(reservationService.createReservation(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse<StallReservationResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ContentResponse<List<StallReservationResponse>>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsForUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ContentResponse<Void>> cancelReservation(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(reservationService.cancelReservation(id, userId));
    }
}
