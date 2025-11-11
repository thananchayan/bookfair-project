package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallRequest;
import com.bookfair.stall_service.dto.request.UpdateStallRequest;
import com.bookfair.stall_service.dto.response.StallResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.enums.Size;
import com.bookfair.stall_service.enums.Status;
import com.bookfair.stall_service.repository.StallAllocationRepository;
import com.bookfair.stall_service.repository.StallRepository;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StallServiceImpl implements StallService {

  private final StallRepository stallRepository;
  private final StallAllocationRepository stallAllocationRepository;


  @Override
  public ContentResponse<StallResponse> createStall(CreateStallRequest createStallRequest) {
    if (stallRepository.existsByStallName(createStallRequest.getStallName())) {
      throw new IllegalArgumentException("Stall name already exists");
    }

    StallEntity stall = mapToEntity(createStallRequest);
    StallEntity savedStall = stallRepository.save(stall);
    StallResponse stallResponse = mapToResponse(savedStall);
    return new ContentResponse<>(
        "Stall Create",
        "SUCCESS",
        "200",
        "Stall created successfully",
        stallResponse
    );
  }

  @Override
  public ContentResponse<List<StallResponse>> getAllStalls() {
    List<StallEntity> stalls = stallRepository.findAll();
    return new ContentResponse<>(
        "Stall List",
        "SUCCESS",
        "200",
        "Stalls retrieved successfully",
        stalls.stream().map(this::mapToResponse).toList()
    );
  }

  @Override
  public ContentResponse<StallResponse> getStallById(Long id) {
    if (!stallRepository.existsById(id)) {
      throw new IllegalArgumentException("Stall not found");
    } else {
      StallEntity stallEntity = stallRepository.findById(id).get();
      StallResponse stallResponse = mapToResponse(stallEntity);
      return new ContentResponse<>(
          "Stall Detail",
          "SUCCESS",
          "200",
          "Stall retrieved successfully",
          stallResponse
      );
    }
  }

  @Override
  public ContentResponse<StallResponse> updateStall(Long id, UpdateStallRequest request) {
    StallEntity existingStall = stallRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Stall not found"));

    String newStallName = request.getStallName();
    if (newStallName != null && !newStallName.equals(existingStall.getStallName())) {
      if (stallRepository.existsByStallName(newStallName)) {
        throw new IllegalArgumentException("Stall name already exists");
      }
    }

    existingStall.setStallName(request.getStallName());
    existingStall.setSize(request.getSize());
    existingStall.setStatus(request.getStatus());
    existingStall.setDescription(request.getDescription());

    StallEntity updatedStall = stallRepository.save(existingStall);
    StallResponse stallResponse = mapToResponse(updatedStall);
    return new ContentResponse<>(
        "Stall Update",
        "SUCCESS",
        "200",
        "Stall updated successfully",
        stallResponse
    );
  }

  @Override
  public ContentResponse<Void> deleteStallById(Long id) {
    StallEntity existingStall = stallRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Stall not found"));

    boolean isStallAllocated = stallAllocationRepository.existsByStall_Id(id);
    if (isStallAllocated) {
      throw new IllegalStateException(
          "Stall is allocated to a book fair and cannot be deleted.");
    }

//    List<StallAllocationEntity> allocatedStallAllocationEntities = stallAllocationRepository.findByStall_Id(
//        id);
//    List<BookFairEntity> allocatedBookFairs = bookFairsFromAllocations(
//        allocatedStallAllocationEntities);
//
//    //need to check is allocatedBookFairs status equall to upcoming or ongoing
//    boolean isAllocatedBookFairEntities = allocatedBookFairs.stream()
//        .anyMatch(bf ->
//            bf.getStatus() == BookFairStatus.UPCOMING
//                || bf.getStatus() == BookFairStatus.ONGOING);
//
//    boolean isAllocatedStallAllocationEntities = allocatedStallAllocationEntities.stream()
//        .anyMatch(sa ->
//            sa.getStallAllocationStatus() == StallAllocationStatus.PENDING ||
//                sa.getStallAllocationStatus() == StallAllocationStatus.APPROVED);
//
//    if (isAllocatedBookFairEntities) {
//      throw new IllegalStateException(
//          "Stall is allocated to an upcoming or ongoing book fair and cannot be deleted.");
//    }

    stallRepository.delete(existingStall);
    return new ContentResponse<>(
        "Stall Delete",
        "SUCCESS",
        "200",
        "Stall deleted successfully",
        null
    );
  }

  @Override
  public ContentResponse<Void> deleteAllStalls() {
    stallRepository.deleteAll();
    return new ContentResponse<>(
        "Stall Delete All",
        "SUCCESS",
        "200",
        "All stalls deleted successfully",
        null
    );
  }

  @Override
  public List<BookFairEntity> bookFairsFromAllocations(List<StallAllocationEntity> allocations) {
    if (allocations == null || allocations.isEmpty()) {
      return List.of();
    }
    return allocations.stream()
        .map(StallAllocationEntity::getBookFair)
        .filter(Objects::nonNull)
        .collect(Collectors.toMap(BookFairEntity::getId, bf -> bf, (a, b) -> a))
        .values()
        .stream()
        .collect(Collectors.toList());
  }

  private StallEntity mapToEntity(CreateStallRequest createStallRequest) {
    return StallEntity.builder()
        .stallName(createStallRequest.getStallName())
        .size(Size.SMALL)
        .description(createStallRequest.getDescription())
        .status(Status.AVAILABLE)
        .build();
  }


  private StallResponse mapToResponse(StallEntity stallEntity) {
    return StallResponse.builder()
        .id(stallEntity.getId())
        .stallName(stallEntity.getStallName())
        .size(stallEntity.getSize())
        .status(stallEntity.getStatus())
        .description(stallEntity.getDescription())
        .build();
  }

}
