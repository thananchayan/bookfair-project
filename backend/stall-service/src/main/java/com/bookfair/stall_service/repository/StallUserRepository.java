package com.bookfair.stall_service.repository;

import com.bookfair.stall_service.entity.StallUserEntity;
import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StallUserRepository extends JpaRepository<StallUserEntity, Long> {

  boolean existsByUsername(String username);

  boolean existsByQrId(String qrId);

  Optional<StallUserEntity> findByUsername(String username);

  Optional<StallUserEntity> findByQrId(String qrId);

  boolean existsByPhoneNumber(@NotNull(message = "Phone number cannot be null") String phonenumber);
}
