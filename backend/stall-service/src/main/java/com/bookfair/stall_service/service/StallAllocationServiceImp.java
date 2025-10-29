package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.request.UpdateStallAllocationRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.enums.BookFairStatus;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.enums.Status;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.StallAllocationRepository;
import com.bookfair.stall_service.repository.StallRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StallAllocationServiceImp implements StallAllocationService {

  private final BookFairService bookFairService;
  private final StallService stallService;

  private final StallAllocationRepository stallAllocationRepository;
  private final BookFairRepository bookFairRepository;
  private final StallRepository stallRepository;

  @Override
  public ContentResponse<StallAllocationResponse> createStallAllocation(
      CreateStallAllocationRequest request) {
    if (!bookFairRepository.existsById(request.getBookFairId())) {
      throw new IllegalArgumentException("Book Fair not found");
    }

    if (!stallRepository.existsById(request.getStallId())) {
      throw new IllegalArgumentException("Stall not found");
    }

    BookFairEntity bookFairEntity = bookFairRepository.findById(request.getBookFairId()).get();
    StallEntity stallEntity = stallRepository.findById(request.getStallId()).get();

    if (stallAllocationRepository.existsByBookFairAndStall(bookFairEntity, stallEntity)) {
      throw new IllegalArgumentException("Stall is already allocated to this Book Fair");
    }
    if (bookFairEntity.getStatus() == BookFairStatus.COMPLETED
        || bookFairEntity.getStatus() == BookFairStatus.CANCELLED) {
      throw new IllegalArgumentException(
          "Cannot allocate stall to a completed or cancelled Book Fair");
    }
    if (stallEntity.getStatus() == Status.BLOCKED) {
      throw new IllegalArgumentException("Stall is blocked and cannot be allocated");
    }

    StallAllocationEntity entity = mapToEntity(request);
    stallAllocationRepository.save(entity);
    StallAllocationResponse response = mapToResponse(entity);
    return new ContentResponse<>(
        "StallAllocation",
        "Stall Allocation created successfully",
        "SUCCESS",
        "200",
        response
    );
  }

  @Override
  public ContentResponse<StallAllocationResponse> getStallAllocationById(Long id) {
    return null;
  }

  @Override
  public ContentResponse<List<StallAllocationResponse>> getAll() {
    return null;
  }

  @Override
  public ContentResponse<StallAllocationResponse> updateStallAllocationById(Long id,
      UpdateStallAllocationRequest request) {
    return null;
  }

  @Override
  public ContentResponse<Void> deleteStallAllocation(Long id) {
    return null;
  }

  @Override
  public ContentResponse<StallAllocationResponse> allocateStallToBookFair(Long stallId,
      Long bookFairId) {
    return null;
  }

  private StallAllocationEntity mapToEntity(CreateStallAllocationRequest request) {
    return StallAllocationEntity.builder()
        .bookFair(bookFairRepository.findById(request.getBookFairId()).get())
        .stall(stallRepository.findById(request.getStallId()).get())
        .stallLocation(request.getStallLocation())
        .stallPrice(request.getPrice())
        .stallAllocationStatus(StallAllocationStatus.PENDING)
        .build();
  }

  private StallAllocationResponse mapToResponse(StallAllocationEntity entity) {
    StallAllocationResponse response = new StallAllocationResponse();
    response.setId(entity.getId());
    response.setBookFairId(entity.getBookFair().getId());
    response.setStallId(entity.getStall().getId());
    response.setStallLocation(entity.getStallLocation());
    response.setStatus(entity.getStallAllocationStatus());
    response.setPrice(entity.getStallPrice());
    response.setBookFairStatus(entity.getBookFair().getStatus());
    return response;
  }

}
