package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.HallEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HallRepository extends JpaRepository<HallEntity, Long> {

  boolean existsByBookFairIdAndHallName(Long bookFairId, String hallName);

  List<HallEntity> findByBookFairId(Long bookFairId);
}
