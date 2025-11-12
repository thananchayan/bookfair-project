
package com.bookfair.user_service.service;

import com.bookfair.user_service.dto.request.CreateStallUserRequest;
import com.bookfair.user_service.dto.request.UpdateStallUserRequest;
import com.bookfair.user_service.dto.response.StallUserResponse;
import org.springframework.data.domain.Page;

public interface UserAdminService {

  StallUserResponse create(CreateStallUserRequest request);

  StallUserResponse getById(Long id);

  StallUserResponse getByUsername(String username);

  StallUserResponse getByPhone(String phone);

  Page<StallUserResponse> list(int page, int size, String q);

  StallUserResponse update(Long id, UpdateStallUserRequest request);

  void setEnabled(Long id, boolean enabled);

  void delete(Long id);
}
