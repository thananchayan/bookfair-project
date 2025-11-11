package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.entity.StallEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StallAllocationRepository extends JpaRepository<StallAllocationEntity, Long> {

  boolean existsByBookFairAndStall(BookFairEntity bookFair, StallEntity stall);

  boolean existsByBookFairAndStallLocation(BookFairEntity bookFair, String stallLocation);

  boolean existsByStall_Id(Long stallId);

  boolean existsByBookFair_Id(Long bookFairId);

  boolean existsByStall_IdAndBookFair_Id(Long stallId, Long bookFairId);

  long countByVendorIdAndBookFair(Long vendorId, BookFairEntity bookFair);

  boolean existsByBookFairAndStall(BookFairEntity bookFair, StallEntity stall);
  List<StallAllocationEntity> findByStall_Id(Long stallId);

  List<StallAllocationEntity> findByVendorId(Long vendorId);
}
