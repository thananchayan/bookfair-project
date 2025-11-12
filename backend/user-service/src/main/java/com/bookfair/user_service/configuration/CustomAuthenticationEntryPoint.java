package com.bookfair.user_service.configuration;


import com.bookfair.user_service.dto.ContentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException authException) throws IOException {

    ContentResponse<Object> contentResponse = new ContentResponse<>(
        "error",
        null,
        "FAILURE",
        "401",
        "Authentication required or token invalid"
    );

    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    new ObjectMapper().writeValue(response.getOutputStream(), contentResponse);
  }
}