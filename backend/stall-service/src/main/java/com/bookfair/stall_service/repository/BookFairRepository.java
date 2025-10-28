package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.BookFairEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookFairRepository extends JpaRepository<BookFairEntity, Long> {

  boolean existsByName(String name);
}
