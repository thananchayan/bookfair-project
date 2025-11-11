package com.bookfair.user_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContentResponse<T> {

  private String type;
  private String status;
  private String statusCode;
  private String message;
  private T data;

  public ContentResponse(String type, String status, String statusCode, String message, T data) {
    this.type = type;
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
