package com.bookfair.vendor_service.dto;

import com.bookfair.vendor_service.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentResponse<T> {

    // Fields used in your service implementations:
    private String status;
    private String statusCode;
    private String message;
    private String type;
    private T data;

    public static <T> ContentResponse<T> success(T content, String message) {
        return ContentResponse.<T>builder()
                .type("success")
                .data(content)
                .status(RequestStatus.SUCCESS.getStatus())
                .statusCode("200")
                .message(message)
                .build();
    }
}