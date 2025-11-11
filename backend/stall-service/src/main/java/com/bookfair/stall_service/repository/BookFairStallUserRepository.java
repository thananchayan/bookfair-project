package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.BookFairStallUser;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookFairStallUserRepository extends JpaRepository<BookFairStallUser, Long> {

    long countByUserIdAndBookFair(Long userId, BookFairEntity bookFair);

    boolean existsByStall_IdAndBookFair_IdAndStatusNot(
            Long stallId,
            Long bookFairId,
            StallAllocationStatus status
    );

    List<BookFairStallUser> findByUserId(Long userId);

    List<BookFairStallUser> findByBookFair(BookFairEntity bookFair);
}