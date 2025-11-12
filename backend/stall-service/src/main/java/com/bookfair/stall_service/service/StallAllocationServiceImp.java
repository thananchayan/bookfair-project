package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.request.UpdateStallAllocationPrice;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.HallEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.enums.BookFairStatus;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.enums.Status;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.HallRepository;
import com.bookfair.stall_service.repository.HallStallRepository;
import com.bookfair.stall_service.repository.StallAllocationRepository;
import com.bookfair.stall_service.repository.StallRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StallAllocationServiceImp implements StallAllocationService {


  private final StallAllocationRepository stallAllocationRepository;
  private final BookFairRepository bookFairRepository;
  private final StallRepository stallRepository;
  private final HallStallRepository hallStallRepository;
  private final HallRepository hallRepository;

  @Override
  public ContentResponse<StallAllocationResponse> createStallAllocation(
      CreateStallAllocationRequest request) {

    StallEntity stallEntity = stallRepository.findById(request.getStallId())
        .orElseThrow(() -> new IllegalArgumentException("Stall not found"));

    HallEntity hallEntity = hallStallRepository.findById(request.getHallStallID())
        .orElseThrow(() -> new IllegalArgumentException("Hall Stall not found"))
        .getHallEntity();

//    BookFairEntity bookFairEntity = bookFairRepository.findById(hallEntity.getBookFair().getId()).get();
    BookFairEntity bookFairEntity = bookFairRepository.findById(request.getBookFairId())
        .orElseThrow(() -> new IllegalArgumentException("Book Fair not found"));

//  if(stallAllocationRepository.existsByHallStall_IdAndStall_Id(request.getHallStallID(), request.getStallId())){
//      	throw new IllegalArgumentException("Stall is already allocated to this Hall Stall");
//    }

    if (stallAllocationRepository.existsByHallStall_Id(request.getHallStallID())) {
      throw new IllegalArgumentException("A Hall stall is already allocated ");
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
    if (!stallAllocationRepository.existsById(id)) {
      throw new IllegalArgumentException("Stall Allocation not found");
    }
    StallAllocationEntity entity = stallAllocationRepository.findById(id).get();
    StallAllocationResponse response = mapToResponse(entity);
    return new ContentResponse<>(
        "StallAllocation",
        "Stall Allocation retrieved successfully",
        "SUCCESS",
        "200",
        response
    );
  }

  @Override
  public ContentResponse<List<StallAllocationResponse>> getStallAllocationByBookFairId(
      Long bookFairId) {
    List<StallAllocationEntity> response = stallAllocationRepository.findByBookFair_Id(bookFairId);
    List<StallAllocationResponse> stallAllocationResponses = response.stream()
        .map(this::mapToResponse)
        .toList();
    return new ContentResponse<>(
        "StallAllocation",
        "SUCCESS",
        "200",
        "Stall Allocations for Book Fair retrieved successfully",
        stallAllocationResponses
    );
  }


  @Override
  public ContentResponse<List<StallAllocationResponse>> getAllStallAllocation() {
    List<StallAllocationEntity> entity = stallAllocationRepository.findAll();
    List<StallAllocationResponse> response = entity.stream()
        .map(this::mapToResponse)
        .toList();
    return new ContentResponse<>(
        "StallAllocation",
        "All Stall Allocations retrieved successfully",
        "SUCCESS",
        "200",
        response
    );

  }


  @Override
  public ContentResponse<StallAllocationResponse> updateStallAllocationById(Long id,
      UpdateStallAllocationPrice request) {
    StallAllocationEntity stallAllocationEntity = stallAllocationRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Stall Allocation not found"));

    if (!(stallAllocationEntity.getStallAllocationStatus() == StallAllocationStatus.PENDING)) {
      throw new IllegalArgumentException(
          "Only pending stall allocations can be updated");
    }

    stallAllocationEntity.setStallPrice(request.getPrice());
    stallAllocationEntity.setStallAllocationStatus(request.getStallAllocationStatus());

    stallAllocationRepository.save(stallAllocationEntity);
    StallAllocationResponse response = mapToResponse(stallAllocationEntity);
    return new ContentResponse<>(
        "StallAllocation",
        "Stall Allocation updated successfully",
        "SUCCESS",
        "200",
        response
    );
  }

  @Override
  public ContentResponse<Void> deleteStallAllocation(Long id) {
    StallAllocationEntity allocation = stallAllocationRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Stall Allocation not found"));
    BookFairEntity bookFairEntity = bookFairRepository.findById(allocation.getBookFair().getId())
        .orElseThrow(() -> new IllegalArgumentException("Book Fair not found"));

    if (bookFairEntity.getStatus() == BookFairStatus.COMPLETED
        || bookFairEntity.getStatus() == BookFairStatus.CANCELLED) {
      throw new IllegalArgumentException(
          "Cannot delete stall allocation from a completed or cancelled Book Fair");
    }
    stallAllocationRepository.deleteById(id);
    return new ContentResponse<>(
        "StallAllocation",
        "Stall Allocation deleted successfully",
        "SUCCESS",
        "200",
        null
    );
  }

  @Override
  public ContentResponse<StallAllocationResponse> allocateStallToBookFair(Long stallId,
      Long bookFairId) {
    return null;
  }

  private StallAllocationEntity mapToEntity(CreateStallAllocationRequest request) {
    return StallAllocationEntity.builder()
        .bookFair(bookFairRepository.findById(request.getBookFairId()).get())
        .hallStall(hallStallRepository.findById(request.getHallStallID()).get())
        .stall(stallRepository.findById(request.getStallId()).get())
        .stallPrice(request.getPrice())
        .stallAllocationStatus(StallAllocationStatus.PENDING)
        .build();
  }

  private StallAllocationResponse mapToResponse(StallAllocationEntity entity) {
    StallAllocationResponse response = new StallAllocationResponse();
    response.setId(entity.getId());
    response.setBookFairId(entity.getBookFair().getId());
    response.setHallStallID(entity.getHallStall().getId());
    response.setStallId(entity.getStall().getId());
    response.setPrice(entity.getStallPrice());
    response.setStallAllocationStatus(entity.getStallAllocationStatus());
    response.setUserId(entity.getBookingUserId());
    response.setReservationToken(entity.getReservationToken());
    return response;
  }

}
