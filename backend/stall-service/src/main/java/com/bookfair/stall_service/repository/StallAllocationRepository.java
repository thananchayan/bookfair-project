package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.entity.StallEntity;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StallAllocationRepository extends JpaRepository<StallAllocationEntity, Long> {

  boolean existsByBookFairAndStall(BookFairEntity bookFair, StallEntity stall);

  boolean existsByStallLocation(
      @NotBlank(message = "Stall location is required") String stallLocation);

  boolean existsByBookFairAndStallLocation(BookFairEntity bookFair, String stallLocation);

}
