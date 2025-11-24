package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.HallStallEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HallStallRepository extends JpaRepository<HallStallEntity, Long> {

  List<HallStallEntity> findByBookFairId(Long bookFairId);
}
