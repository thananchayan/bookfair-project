package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateBookFairRequest;
import com.bookfair.stall_service.dto.request.UpdateBookFairRequest;
import com.bookfair.stall_service.dto.response.BookFairResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.enums.BookFairStatus;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.StallAllocationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookFairServiceImpl implements BookFairService {

  private final BookFairRepository bookFairRepository;
  private final StallAllocationRepository stallAllocationRepository;

  @Override
  public ContentResponse<BookFairResponse> createBookFair(
      CreateBookFairRequest createBookFairRequest) {
    if (bookFairRepository.existsByName(createBookFairRequest.getName())) {
      throw new IllegalArgumentException("Book fair with this name already exists");
    }
    BookFairEntity bookFairEntity = mapToEntity(createBookFairRequest);
    bookFairRepository.save(bookFairEntity);
    BookFairResponse bookFairResponse = mapToRespnse(bookFairEntity);
    return new ContentResponse<>(
        "BookFair",
        "Book fair created successfully",
        "SUCCESS",
        "200",
        bookFairResponse
    );
  }

  @Override
  public ContentResponse<BookFairResponse> getBookFairById(Long id) {
    BookFairEntity existingEntity = bookFairRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Book fair not found"));
    BookFairResponse bookFairResponse = mapToRespnse(existingEntity);
    return new ContentResponse<>(
        "BookFair",
        "Book fair retrieved successfully",
        "SUCCESS",
        "200",
        bookFairResponse
    );
  }

  @Override
  public ContentResponse<List<BookFairResponse>> getAll() {
    List<BookFairEntity> bookFairEntities = bookFairRepository.findAll();
    List<BookFairResponse> bookFairResponses = bookFairEntities.stream()
        .map(this::mapToRespnse)
        .toList();
    return new ContentResponse<>(
        "BookFair",
        "Book fairs retrieved successfully",
        "SUCCESS",
        "200",
        bookFairResponses
    );
  }


  @Override
  public ContentResponse<BookFairResponse> updateBookFair(Long id,
      UpdateBookFairRequest updateBookFairRequest) {
    BookFairEntity existingEntity = bookFairRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Book fair not found"));
    if (bookFairRepository.existsByName(updateBookFairRequest.getName())) {
      throw new IllegalArgumentException("Book fair with this name already exists");
    }
    java.time.LocalDate start = updateBookFairRequest.getStartDate();
    java.time.LocalDate end = updateBookFairRequest.getEndDate();

    if (start == null || end == null) {
      throw new IllegalArgumentException("Start date and end date are required");
    }
    if (end.isBefore(start)) {
      throw new IllegalArgumentException("End date cannot be before start date");
    }

    int durationDays = (int) java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;

    existingEntity.setName(updateBookFairRequest.getName());
    existingEntity.setStartDate(updateBookFairRequest.getStartDate());
    existingEntity.setEndDate(updateBookFairRequest.getEndDate());
    existingEntity.setOrganizer(updateBookFairRequest.getOrganizer());
    existingEntity.setDurationDays(durationDays);
    existingEntity.setDescription(updateBookFairRequest.getDescription());
    existingEntity.setLocation(updateBookFairRequest.getLocation());

    bookFairRepository.save(existingEntity);
    BookFairResponse bookFairResponse = mapToRespnse(existingEntity);
    return new ContentResponse<>(
        "BookFair",
        "Book fair updated successfully",
        "SUCCESS",
        "200",
        bookFairResponse
    );
  }

  @Override
  public ContentResponse<BookFairResponse> findById(Long id) {
    BookFairEntity bookFairEntity = bookFairRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Book fair not found"));
    BookFairResponse bookFairResponse = mapToRespnse(bookFairEntity);
    return new ContentResponse<>(
        "BookFair",
        "Book fair retrieved successfully",
        "SUCCESS",
        "200",
        bookFairResponse
    );
  }

  @Override
  public ContentResponse<Void> deleteBookFairById(Long id) {
    BookFairEntity bookFairEntity = bookFairRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Book fair not found"));
    if (stallAllocationRepository.existsByBookFair_Id(id)) {
      throw new IllegalArgumentException("Cannot delete book fair with allocated stalls");
    }
    bookFairRepository.delete(bookFairEntity);
    return new ContentResponse<>(
        "BookFair",
        "Book fair deleted successfully",
        "SUCCESS",
        "200",
        null
    );
  }

  @Override
  public BookFairResponse setBookFairStatus(Long id, BookFairStatus status) {
    if (!bookFairRepository.existsById(id)) {
      throw new IllegalArgumentException("Book fair not found");
    }
    BookFairEntity bookFairEntity = bookFairRepository.findById(id).get();
    if (bookFairEntity.getStatus() == BookFairStatus.COMPLETED
        || bookFairEntity.getStatus() == BookFairStatus.CANCELLED) {
      throw new IllegalArgumentException(
          "Cannot change status of completed or cancelled book fair");
    }
    bookFairEntity.setStatus(status);
    bookFairRepository.save(bookFairEntity);
    BookFairResponse bookFairResponse = mapToRespnse(bookFairEntity);
    return bookFairResponse;

  }

  @Override
  public ContentResponse<List<BookFairResponse>> getBookfairBystatus(BookFairStatus status) {
    List<BookFairEntity> bookFairEntities = bookFairRepository
        .findByStatus(status);
    List<BookFairResponse> bookFairResponses = bookFairEntities.stream()
        .map(this::mapToRespnse)
        .toList();
    return new ContentResponse<>(
        "BookFair",
        "SUCCESS",
        "200",
        "Upcoming book fairs retrieved successfully",
        bookFairResponses
    );
  }

  private BookFairEntity mapToEntity(CreateBookFairRequest createBookFairRequest) {
    java.time.LocalDate start = createBookFairRequest.getStartDate();
    java.time.LocalDate end = createBookFairRequest.getEndDate();
    if (start == null || end == null) {
      throw new IllegalArgumentException("Start date and end date are required");
    }
    if (end.isBefore(start)) {
      throw new IllegalArgumentException("End date cannot be before start date");
    }

    int durationDays = (int) java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;

    return BookFairEntity.builder()
        .name(createBookFairRequest.getName())
        .startDate(createBookFairRequest.getStartDate())
        .endDate(createBookFairRequest.getEndDate())
        .organizer(createBookFairRequest.getOrganizer())
        .durationDays(durationDays)
        .description(createBookFairRequest.getDescription())
        .status(BookFairStatus.UPCOMING)
        .location(createBookFairRequest.getLocation())
        .build();
  }

  private BookFairResponse mapToRespnse(BookFairEntity bookFairEntity) {
    return BookFairResponse.builder()
        .id(bookFairEntity.getId())
        .name(bookFairEntity.getName())
        .startDate(bookFairEntity.getStartDate())
        .endDate(bookFairEntity.getEndDate())
        .organizer(bookFairEntity.getOrganizer())
        .durationDays(bookFairEntity.getDurationDays())
        .description(bookFairEntity.getDescription())
        .status(bookFairEntity.getStatus())
        .location(bookFairEntity.getLocation())
        .build();
  }


}
