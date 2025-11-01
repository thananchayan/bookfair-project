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
        // Using the explicit constructor (type, status, statusCode, message, data)
        ContentResponse<Object> errorResponse = new ContentResponse<>(
                "error", // type
                RequestStatus.FAILURE.getStatus(), // status
                String.valueOf(e.getStatusCode().value()), // statusCode
                e.getReason(), // message
                null // data
        );
        return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
    }

    @ExceptionHandler(VendorAlreadyExistsException.class)
    public ResponseEntity<ContentResponse<Object>> handleVendorAlreadyExists(
            VendorAlreadyExistsException ex) {
        return ResponseEntity.badRequest().body(
                new ContentResponse<>(
                        "error",
                        RequestStatus.FAILURE.getStatus(),
                        "400",
                        ex.getMessage(),
                        null
                )
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
                new ContentResponse<>(
                        "error",
                        RequestStatus.FAILURE.getStatus(),
                        "400",
                        "Validation failed: " + errorMsg,
                        null
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ContentResponse<Object>> handleAll(Exception e) {
        e.printStackTrace();
        ContentResponse<Object> errorResponse = new ContentResponse<>(
                "error",
                RequestStatus.FAILURE.getStatus(),
                "500",
                "An unexpected internal server error occurred.",
                null
        );
        return ResponseEntity.internalServerError().body(errorResponse);
    }
}