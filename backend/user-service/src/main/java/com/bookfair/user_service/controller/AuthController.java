package com.bookfair.user_service.controller;

import com.bookfair.user_service.dto.ContentResponse;
import com.bookfair.user_service.dto.request.CreateStallUserRequest;
import com.bookfair.user_service.dto.request.LoginRequest;
import com.bookfair.user_service.dto.response.AuthResponse;
import com.bookfair.user_service.dto.response.StallUserResponse;
import com.bookfair.user_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  // Public signup
  @PostMapping("/signup")
  public ResponseEntity<ContentResponse<StallUserResponse>> signup(
      @Valid @RequestBody CreateStallUserRequest req) {
    StallUserResponse created = authService.signup(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(
        new ContentResponse<>("signup", "SUCCESS", "201", "User registered successfully", created)
    );
  }

  // Public login -> JWT
  @PostMapping("/login")
  public ResponseEntity<ContentResponse<AuthResponse>> login(
      @Valid @RequestBody LoginRequest req) {
    AuthResponse tokens = authService.login(req);
    return ResponseEntity.ok(
        new ContentResponse<>("login", "SUCCESS", "200", "Login successful", tokens)
    );
  }

  // Who am I (uses JWT)
  @GetMapping("/me")
  public ResponseEntity<ContentResponse<StallUserResponse>> me(
      Authentication authentication) {
    StallUserResponse me = authService.getMe(authentication);
    return ResponseEntity.ok(
        new ContentResponse<>("me", "SUCCESS", "200", "Profile fetched", me)
    );
  }
}
