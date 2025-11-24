package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateBookFairRequest;
import com.bookfair.stall_service.dto.request.UpdateBookFairRequest;
import com.bookfair.stall_service.dto.response.BookFairResponse;
import com.bookfair.stall_service.enums.BookFairStatus;
import java.util.List;

public interface BookFairService {

  ContentResponse<BookFairResponse> createBookFair(CreateBookFairRequest createBookFairRequest);

  ContentResponse<BookFairResponse> getBookFairById(Long id);

  ContentResponse<List<BookFairResponse>> getAll();

  ContentResponse<BookFairResponse> updateBookFair(Long id, UpdateBookFairRequest request);

  ContentResponse<BookFairResponse> findById(Long id);

  ContentResponse<Void> deleteBookFairById(Long id);

  //set status of book fair
  BookFairResponse setBookFairStatus(Long id, BookFairStatus status);

  ContentResponse<List<BookFairResponse>> getBookfairBystatus(BookFairStatus status);
}
