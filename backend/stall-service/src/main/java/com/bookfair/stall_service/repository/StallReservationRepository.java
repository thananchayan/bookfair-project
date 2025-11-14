//package com.bookfair.stall_service.repository;
//
//import com.bookfair.stall_service.entity.StallReservationEntity;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface StallReservationRepository extends JpaRepository<StallReservationEntity, Long> {
//    List<StallReservationEntity> findByUserId(Long userId);
//    boolean existsByUserIdAndBookFair_Id(Long userId, Long bookFairId);
//    boolean existsByStall_Id(Long stallId);
//}
