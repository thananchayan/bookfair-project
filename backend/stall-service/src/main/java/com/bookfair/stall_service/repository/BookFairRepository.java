package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.enums.BookFairStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookFairRepository extends JpaRepository<BookFairEntity, Long> {

  boolean existsByName(String name);

  List<BookFairEntity> findByStatus(BookFairStatus bookFairStatus);
}
