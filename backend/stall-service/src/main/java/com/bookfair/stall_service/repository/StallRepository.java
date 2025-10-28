package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.StallEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StallRepository extends JpaRepository<StallEntity, Long> {

  boolean existsByStallName(String stallName);
}
