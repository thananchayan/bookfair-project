package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateBookFairRequest;
import com.bookfair.stall_service.dto.request.UpdateBookFairRequest;
import com.bookfair.stall_service.dto.response.BookFairResponse;
import com.bookfair.stall_service.service.BookFairService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookfairs")
public class BookFairController {

  private final BookFairService bookFairService;

  @PostMapping
  public ResponseEntity<ContentResponse<BookFairResponse>> createBookFair(
      @Valid @RequestBody CreateBookFairRequest request) {
    return ResponseEntity.ok(bookFairService.createBookFair(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContentResponse<BookFairResponse>> getBookFairById(@PathVariable Long id) {
    return ResponseEntity.ok(bookFairService.getBookFairById(id));
  }

  @GetMapping("/getAll")
  public ResponseEntity<ContentResponse<List<BookFairResponse>>> getAllBookFairs() {
    return ResponseEntity.ok(bookFairService.getAll());
  }

  @PutMapping("/{id}")
  public ResponseEntity<ContentResponse<BookFairResponse>> updateBookFair(
      @PathVariable Long id,
      @Valid @RequestBody UpdateBookFairRequest request) {
    return ResponseEntity.ok(bookFairService.updateBookFair(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ContentResponse<Void>> deleteBookFair(@PathVariable Long id) {
    return ResponseEntity.ok(bookFairService.deleteBookFairById(id));
  }

}
