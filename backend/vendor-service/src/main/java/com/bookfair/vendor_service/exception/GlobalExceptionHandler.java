package com.bookfair.vendor_service.exception;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.enums.RequestStatus;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
@AllArgsConstructor
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ContentResponse<Object>> handleResponseStatusException(
            ResponseStatusException e) {
        ContentResponse<Object> errorResponse = ContentResponse.builder()
                .type("error")
                .data(null)
                .status(RequestStatus.FAILURE.getStatus())
                .statusCode(String.valueOf(e.getStatusCode().value()))
                .message(e.getReason())
                .build();
        return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
    }

    @ExceptionHandler(VendorAlreadyExistsException.class)
    public ResponseEntity<ContentResponse<Object>> handleVendorAlreadyExists(
            VendorAlreadyExistsException ex) {
        return ResponseEntity.badRequest().body(
                ContentResponse.builder()
                        .type("error")
                        .data(null)
                        .status(RequestStatus.FAILURE.getStatus())
                        .statusCode("400")
                        .message(ex.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ContentResponse<Object>> handleValidationException(
            MethodArgumentNotValidException e) {
        String errorMsg = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(
                ContentResponse.builder()
                        .type("error")
                        .data(null)
                        .status(RequestStatus.FAILURE.getStatus())
                        .statusCode("400")
                        .message("Validation failed: " + errorMsg)
                        .build()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ContentResponse<Object>> handleAll(Exception e) {
        e.printStackTrace();
        ContentResponse<Object> errorResponse = ContentResponse.builder()
                .type("error")
                .data(null)
                .status(RequestStatus.FAILURE.getStatus())
                .statusCode("500")
                .message("An unexpected internal server error occurred.")
                .build();
        return ResponseEntity.internalServerError().body(errorResponse);
    }
}