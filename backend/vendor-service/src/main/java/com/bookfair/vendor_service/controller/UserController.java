package com.bookfair.vendor_service.controller;


import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateStallUserRequest;
import com.bookfair.vendor_service.dto.request.UpdateStallUserRequest;
import com.bookfair.vendor_service.dto.response.StallUserResponse;
import com.bookfair.vendor_service.service.StallUserService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final StallUserService stallUserService;

  @PostMapping
  public ResponseEntity<ContentResponse<StallUserResponse>> createStallUser(
      @Valid @RequestBody CreateStallUserRequest request) {
    StallUserResponse response = stallUserService.createStallUser(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new ContentResponse<>(
            "StallUser-create",
            "SUCCESS",
            "200",
            "Stall user created successfully",
            response
        ));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContentResponse<StallUserResponse>> getStallUserById(
      @PathVariable Long id) {
    StallUserResponse response = stallUserService.getStallUserById(id);
    return ResponseEntity.ok(new ContentResponse<>(
        "success",
        "SUCCESS",
        "200",
        "Stall user retrieved successfully",
        response
    ));
  }

  @GetMapping("/username/{username}")
  public ResponseEntity<ContentResponse<StallUserResponse>> getStallUserByUsername(
      @PathVariable String username) {
    StallUserResponse response = stallUserService.getStallUserByUsername(username);
    return ResponseEntity.ok(new ContentResponse<>(
        "success",
        "SUCCESS",
        "200",
        "Stall user retrieved successfully",
        response
    ));
  }

  @GetMapping("/qr/{qrId}")
  public ResponseEntity<ContentResponse<StallUserResponse>> getStallUserByQrId(
      @PathVariable String qrId) {
    StallUserResponse response = stallUserService.getStallUserByQrId(qrId);
    return ResponseEntity.ok(new ContentResponse<>(
        "success",
        "SUCCESS",
        "200",
        "Stall user retrieved successfully",
        response
    ));
  }

  @GetMapping
  public ResponseEntity<ContentResponse<List<StallUserResponse>>> getAllStallUsers() {
    List<StallUserResponse> responses = stallUserService.getAllStallUsers();
    return ResponseEntity.ok(
        new ContentResponse<>(
            "success",
            "SUCCESS",
            "200",
            "All stall users retrieved successfully",
            responses
        ));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ContentResponse<StallUserResponse>> updateStallUser(
      @PathVariable Long id,
      @Valid @RequestBody UpdateStallUserRequest request) {
    StallUserResponse response = stallUserService.updateStallUser(id, request);
    return ResponseEntity.ok(new ContentResponse<>(
        "success",
        "SUCCESS",
        "200",
        "Stall user updated successfully",
        response));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ContentResponse<Void>> deleteStallUser(@PathVariable Long id) {
    stallUserService.deleteStallUser(id);
    return ResponseEntity.ok(new ContentResponse<>(
        "success",
        "SUCCESS",
        "200",
        "Stall user deleted successfully",
        null
    ));
  }

}
