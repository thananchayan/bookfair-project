package com.bookfair.vendor_service.dto;

import lombok.Data;

@Data
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
