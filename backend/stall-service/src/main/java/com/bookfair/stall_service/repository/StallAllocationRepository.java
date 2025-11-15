package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import jakarta.validation.constraints.NotNull;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StallAllocationRepository extends JpaRepository<StallAllocationEntity, Long> {

  boolean existsByStall_Id(Long stallId);

  boolean existsByHallStall_IdAndStall_Id(Long hallStallId, Long stallId);

  List<StallAllocationEntity> findByBookFair_Id(Long bookFairId);

  boolean existsByBookFair_Id(Long bookFairId);

  boolean existsByHallStall_Id(Long hallStallID);

  List<StallAllocationEntity> findByBookFair_IdAndStallAllocationStatusIn(Long bookFairId,
                                                                          Collection<StallAllocationStatus> statuses
  );

  boolean existsByStall_IdAndBookFair_Id(@NotNull(message = "Stall ID is required") Long stallId,
                                         @NotNull(message = "Book Fair ID is required") Long bookFairId);

  // Keep only one of these depending on your logic
  // If token is unique per reservation:
  Optional<StallAllocationEntity> findByReservationToken(String reservationToken);

  // If multiple allocations can share the same token:
  List<StallAllocationEntity> findAllByReservationToken(String reservationToken);

  List<StallAllocationEntity> findAllByBookingUserId(Long userId);
}
