package com.bookfair.user_service.configuration;

import com.bookfair.user_service.dto.response.ContentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response,
      AccessDeniedException accessDeniedException) throws IOException {

    ContentResponse<Object> contentResponse = new ContentResponse<>(
        "error",
        null,
        "FAILURE",
        "403",
        "You are not authorized to perform this action"
    );

    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    response.setContentType("application/json");
    new ObjectMapper().writeValue(response.getOutputStream(), contentResponse);
  }
}