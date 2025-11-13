package com.bookfair.user_service.service;

import com.bookfair.user_service.dto.request.ChangePasswordRequest;
import com.bookfair.user_service.dto.request.CreateStallUserRequest;
import com.bookfair.user_service.dto.request.LoginRequest;
import com.bookfair.user_service.dto.request.UpdateProfileRequest;
import com.bookfair.user_service.dto.response.AuthResponse;
import com.bookfair.user_service.dto.response.StallUserResponse;
import org.springframework.security.core.Authentication;

public interface AuthService {

  // Auth
  StallUserResponse signup(CreateStallUserRequest req);

  AuthResponse login(LoginRequest req);

  StallUserResponse me(Object principal);

  // Self (current user)
  StallUserResponse updateMyProfile(Object principal, UpdateProfileRequest req);

  void changeMyPassword(Authentication authentication, ChangePasswordRequest req);

  StallUserResponse getMe(Authentication authentication);
}