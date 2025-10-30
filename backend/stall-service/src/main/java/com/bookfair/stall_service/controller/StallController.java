package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallRequest;
import com.bookfair.stall_service.dto.request.UpdateStallRequest;
import com.bookfair.stall_service.dto.response.StallResponse;
import com.bookfair.stall_service.service.StallService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/stalls")
@RequiredArgsConstructor
public class StallController {

  private final StallService stallService;

  @PostMapping
  public ResponseEntity<ContentResponse<StallResponse>> createStall(
      @Valid @RequestBody CreateStallRequest createStallRequest) {
    return ResponseEntity.ok(stallService.createStall(createStallRequest));
  }

  @GetMapping("/getAll")
  public ResponseEntity<ContentResponse<List<StallResponse>>> getAllStalls() {
    return ResponseEntity.ok(stallService.getAllStalls());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContentResponse<StallResponse>> getStallById(@PathVariable Long id) {
    return ResponseEntity.ok(stallService.getStallById(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ContentResponse<StallResponse>> updateStall(
      @PathVariable Long id,
      @Valid @RequestBody UpdateStallRequest updateStallRequest) {
    return ResponseEntity.ok(stallService.updateStall(id, updateStallRequest));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ContentResponse<Void>> deleteStallById(@PathVariable Long id) {
    return ResponseEntity.ok(stallService.deleteStallById(id));
  }

//  @DeleteMapping("/deleteAll")
//  public ResponseEntity<ContentResponse<Void>> deleteAllStalls() {
//    return ResponseEntity.ok(stallService.deleteAllStalls());
//  }
}
