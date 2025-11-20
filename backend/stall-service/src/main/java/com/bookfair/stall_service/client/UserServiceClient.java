package com.bookfair.stall_service.client;

import com.bookfair.stall_service.dto.request.UserServiceRequest;
import com.bookfair.stall_service.dto.response.UserServiceResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserServiceClient {

  @GetMapping("/api/users/adminSite/{id}")
  UserServiceResponse<UserServiceRequest> getUserById(@PathVariable Long id);

}
