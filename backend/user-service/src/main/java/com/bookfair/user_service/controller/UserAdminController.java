package com.bookfair.user_service.controller;

import com.bookfair.user_service.dto.ContentResponse;
import com.bookfair.user_service.dto.request.CreateStallUserRequest;
import com.bookfair.user_service.dto.request.UpdateStallUserRequest;
import com.bookfair.user_service.dto.response.PageResponse;
import com.bookfair.user_service.dto.response.StallUserResponse;
import com.bookfair.user_service.service.UserAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserAdminController {

  private final UserAdminService service;

  // Create by staff/admin
  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @PostMapping
  public ResponseEntity<ContentResponse<StallUserResponse>> create(
      @Valid @RequestBody CreateStallUserRequest request) {
    StallUserResponse response = service.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(
        new ContentResponse<>("user-create", "SUCCESS", "201", "User created", response));
  }

  // Get by id
  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @GetMapping("/{id}")
  public ResponseEntity<ContentResponse<StallUserResponse>> getById(@PathVariable Long id) {
    StallUserResponse response = service.getById(id);
    return ResponseEntity.ok(
        new ContentResponse<>("user-get", "SUCCESS", "200", "User fetched", response));
  }

  // Search by username (email) or phone
  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @GetMapping("/by-username/{username}")
  public ResponseEntity<ContentResponse<StallUserResponse>> getByUsername(
      @PathVariable String username) {
    return ResponseEntity.ok(
        new ContentResponse<>("user-get-username", "SUCCESS", "200", "User fetched",
            service.getByUsername(username)));
  }

  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @GetMapping("/by-phone/{phone}")
  public ResponseEntity<ContentResponse<StallUserResponse>> getByPhone(@PathVariable String phone) {
    return ResponseEntity.ok(
        new ContentResponse<>("user-get-phone", "SUCCESS", "200", "User fetched",
            service.getByPhone(phone)));
  }

  // Page & filter (q matches username or phone)
  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @GetMapping
  public ResponseEntity<ContentResponse<PageResponse<StallUserResponse>>> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(required = false) String q) {
    Page<StallUserResponse> p = service.list(page, size, q);
    return ResponseEntity.ok(new ContentResponse<>(
        "user-list", "SUCCESS", "200", "Paged users",
        PageResponse.from(p)));
  }

  // Update any user (admin/staff). If you want only admin to change profession, enforce in service or via annotations.
  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<ContentResponse<StallUserResponse>> update(
      @PathVariable Long id, @Valid @RequestBody UpdateStallUserRequest request) {
    StallUserResponse response = service.update(id, request);
    return ResponseEntity.ok(
        new ContentResponse<>("user-update", "SUCCESS", "200", "User updated", response));
  }

  // Enable/disable (soft lock)
  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @PostMapping("/{id}/enable")
  public ResponseEntity<ContentResponse<Void>> enable(@PathVariable Long id) {
    service.setEnabled(id, true);
    return ResponseEntity.ok(
        new ContentResponse<>("user-enable", "SUCCESS", "200", "User enabled", null));
  }

  @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
  @PostMapping("/{id}/disable")
  public ResponseEntity<ContentResponse<Void>> disable(@PathVariable Long id) {
    service.setEnabled(id, false);
    return ResponseEntity.ok(
        new ContentResponse<>("user-disable", "SUCCESS", "200", "User disabled", null));
  }

  // Delete
  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<ContentResponse<Void>> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.ok(
        new ContentResponse<>("user-delete", "SUCCESS", "200", "User deleted", null));
  }
}
