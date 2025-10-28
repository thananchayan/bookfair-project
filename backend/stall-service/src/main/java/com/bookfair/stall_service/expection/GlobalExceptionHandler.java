//package com.bookfair.stall_service.expection;
//
//import com.bookfair.stall_service.dto.ContentResponse;
//import com.bookfair.stall_service.enums.RequestStatus;
//import java.util.stream.Collectors;
//import lombok.AllArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.DisabledException;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//import org.springframework.web.server.ResponseStatusException;
//
//@RestControllerAdvice
//@AllArgsConstructor
//public class GlobalExceptionHandler {
//
//  @ExceptionHandler(ResponseStatusException.class)
//  public ResponseEntity<ContentResponse<Object>> handleResponseStatusException(
//      ResponseStatusException e) {
//    ContentResponse<Object> errorResponse = new ContentResponse<>(
//        "error",
//        null,
//        RequestStatus.FAILURE.getStatus(),
//        String.valueOf(e.getStatusCode().value()),
//        e.getReason()
//    );
//    return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
//  }
//
//  @ExceptionHandler(IllegalArgumentException.class)
//  public ResponseEntity<ContentResponse<Object>> handleIllegalArgument(
//      IllegalArgumentException ex) {
//    return ResponseEntity.badRequest().body(
//        new ContentResponse<>(
//            "error",
//            null,
//            RequestStatus.FAILURE.getStatus(),
//            "400",
//            ex.getMessage()
//        )
//    );
//  }
//
//
//  @ExceptionHandler(MethodArgumentNotValidException.class)
//  public ResponseEntity<ContentResponse<Object>> handleValidationException(
//      MethodArgumentNotValidException e) {
//    String errorMsg = e.getBindingResult()
//        .getFieldErrors()
//        .stream()
//        .map(error -> error.getField() + ": " + error.getDefaultMessage())
//        .collect(Collectors.joining(", "));
//
//    return ResponseEntity.badRequest().body(
//        new ContentResponse<>(
//            "error",
//            null,
//            RequestStatus.FAILURE.getStatus(),
//            "400",
//            errorMsg
//        )
//    );
//  }
//
//  @ExceptionHandler(BadCredentialsException.class)
//  public ResponseEntity<ContentResponse<Object>> handleBadCredentials(BadCredentialsException ex) {
//    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//        new ContentResponse<>(
//            "error",
//            null,
//            RequestStatus.FAILURE.getStatus(),
//            "401",
//            "Bad Credentials: "
//                + (ex.getMessage() != null ? ex.getMessage() : "Invalid username or password")
//        )
//    );
//  }
//
//
//  @ExceptionHandler(Exception.class)
//  public ResponseEntity<ContentResponse<Object>> handleAll(Exception e) {
//    e.printStackTrace();
//    ContentResponse<Object> errorResponse = new ContentResponse<>(
//        "error",
//        null,
//        RequestStatus.FAILURE.getStatus(),
//        "500",
//        "Something went wrong da"
//    );
//    return ResponseEntity.internalServerError().body(errorResponse);
//  }
//
//  @ExceptionHandler(DisabledException.class)
//  public ResponseEntity<ContentResponse<Object>> handleDisabled(DisabledException ex) {
//    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//        new ContentResponse<>(
//            "error",
//            null,
//            RequestStatus.FAILURE.getStatus(),
//            "401",
//            "Your account is disabled"
//        )
//    );
//  }
//
//  @ExceptionHandler(UsernameNotFoundException.class)
//  public ResponseEntity<ContentResponse<Object>> handleNotFound(UsernameNotFoundException ex) {
//    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//        new ContentResponse<>(
//            "error",
//            null,
//            RequestStatus.FAILURE.getStatus(),
//            "401",
//            "User name not found."
//        )
//    );
//
//  }
//
//  @ExceptionHandler(AccessDeniedException.class)
//  public ResponseEntity<ContentResponse<Object>> handleAccessDenied(AccessDeniedException ex) {
//    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
//        new ContentResponse<>(
//            "error",
//            null,
//            RequestStatus.FAILURE.getStatus(),
//            "403",
//            "You are not authorized to perform this action"
//        )
//    );
//  }
//
//  @ExceptionHandler(RuntimeException.class)
//  public ResponseEntity<ContentResponse<Object>> handleRuntimeException(RuntimeException ex) {
//    ContentResponse<Object> errorResponse = new ContentResponse<>(
//        "error",
//        null,
//        RequestStatus.FAILURE.getStatus(),
//        "500",
//        ex.getMessage() != null ? ex.getMessage() : "A runtime error occurred"
//    );
//    return ResponseEntity.internalServerError().body(errorResponse);
//  }
//}
