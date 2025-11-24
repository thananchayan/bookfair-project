package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateHallRequest;
import com.bookfair.stall_service.dto.response.HallResponse;
import com.bookfair.stall_service.dto.response.HallSizeResponse;
import com.bookfair.stall_service.service.HallService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/halls")
public class HallController {

  private final HallService hallService;

  @PostMapping
  public ResponseEntity<ContentResponse<HallResponse>> createHall(
      @RequestBody CreateHallRequest request) {
    ContentResponse<HallResponse> response = hallService.createHall(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping
  public ResponseEntity<ContentResponse<List<HallResponse>>> getAllHalls() {
    ContentResponse<List<HallResponse>> response = hallService.getAllHalls();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContentResponse<HallResponse>> getHallById(@PathVariable Long id) {
    ContentResponse<HallResponse> response = hallService.getHallById(id);
    return ResponseEntity.ok(response);
  }

  @PutMapping("updateHall/{id}")
  public ResponseEntity<ContentResponse<HallResponse>> updateHall(
      @PathVariable Long id,
      @RequestBody CreateHallRequest request) {
    ContentResponse<HallResponse> response = hallService.updateHall(id, request);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ContentResponse<Void>> deleteHall(@PathVariable Long id) {
    ContentResponse<Void> response = hallService.deleteHallById(id);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/hallSize/{bookFairId}")
  public ResponseEntity<HallSizeResponse> getHallsize(@PathVariable Long bookFairId) {
    HallSizeResponse response = hallService.getHallsize(bookFairId);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/bookfair/{bookFairId}")
  public ResponseEntity<List<HallResponse>> getHallsByBookfairId(@PathVariable Long bookFairId) {
    List<HallResponse> response = hallService.getHallsByBookfairId(bookFairId);
    return ResponseEntity.ok(response);
  }


}
