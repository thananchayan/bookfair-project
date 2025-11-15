package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.ReservationResponse;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.dto.response.StallReservationResponse;
import com.bookfair.stall_service.service.StallReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stall-reservations")
@RequiredArgsConstructor
public class StallReservationController {

  private final StallReservationService stallReservationService;

  @PostMapping
  public ContentResponse<ReservationResponse> createReservation(@RequestBody CreateStallReservationRequest request) {
    return stallReservationService.createReservation(request);
  }

  @GetMapping("/{id}")
  public ContentResponse<ReservationResponse> getReservationById(@PathVariable Long id) {
    return stallReservationService.getReservationById(id);
  }

  @GetMapping("/bookfair/{bookFairId}")
  public ContentResponse<List<StallAllocationResponse>> getAllReservationsForBookFair(@PathVariable Long bookFairId) {
    return stallReservationService.getAllReservationsForBookFair(bookFairId);
  }

  @DeleteMapping("/{id}/user/{userId}")
  public ContentResponse<Void> cancelReservation(@PathVariable Long id, @PathVariable Long userId) {
    return stallReservationService.cancelReservation(id, userId);
  }

  @GetMapping("/token/{token}")
  public ContentResponse<ReservationResponse> getReservationByToken(@PathVariable String token) {
    return stallReservationService.getReservationByToken(token);
  }

  @GetMapping("/stalls/{token}")
  public ContentResponse<List<StallReservationResponse>> getStallsByReservationToken(@PathVariable String token) {
    return stallReservationService.getStallsByReservationToken(token);
  }
}
