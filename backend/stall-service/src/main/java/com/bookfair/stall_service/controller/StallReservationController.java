package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.QrReadResponse;
import com.bookfair.stall_service.dto.response.ReservationResponse;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.service.StallReservationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stall-reservation")
@RequiredArgsConstructor
public class StallReservationController {

  private final StallReservationService reservationService;

  @PostMapping
  public ResponseEntity<ContentResponse<ReservationResponse>> createReservation(
      @Valid @RequestBody CreateStallReservationRequest request) {
    return ResponseEntity.ok(reservationService.createReservation(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContentResponse<ReservationResponse>> getById(@PathVariable Long id) {
    return ResponseEntity.ok(reservationService.getReservationById(id));
  }

  @GetMapping("/bookfair/{bookFairId}")
  public ResponseEntity<ContentResponse<List<StallAllocationResponse>>> getAllReservationsForBookFair(
      @PathVariable Long bookFairId) {
    return ResponseEntity.ok(reservationService.getAllReservationsForBookFair(bookFairId));
  }

  //
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<ContentResponse<List<StallReservationResponse>>> getForUser(@PathVariable Long userId) {
//        return ResponseEntity.ok(reservationService.getReservationsForUser(userId));
//    }
//
  @DeleteMapping("/{userId}")
  public ResponseEntity<ContentResponse<Void>> cancelReservation(@PathVariable Long userId,
      @RequestParam Long hallStallId) {
    return ResponseEntity.ok(reservationService.cancelReservation(hallStallId, userId));
  }

  @GetMapping("token/{token}")
  public ResponseEntity<ContentResponse<QrReadResponse>> getReservationByToken(
      @PathVariable String token) {
    return ResponseEntity.ok(reservationService.getReservationByToken(token));
  }


}