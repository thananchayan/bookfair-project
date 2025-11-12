package com.bookfair.user_service.repository;


import com.bookfair.user_service.entity.StallUserEntity;
import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StallUserRepository extends JpaRepository<StallUserEntity, Long> {

  boolean existsByUsername(String username);

  Optional<StallUserEntity> findByUsername(String username);

  Optional<StallUserEntity> findByPhoneNumber(String phoneNumber);


  boolean existsByPhoneNumber(@NotNull(message = "Phone number cannot be null") String phonenumber);

  @Query("""
      select u from StallUserEntity u
      where lower(u.username) like lower(concat('%', ?1, '%'))
         or u.phoneNumber like concat('%', ?2, '%')
      """)
  Page<StallUserEntity> searchByUsernameOrPhone(String usernameLike, String phoneLike,
      Pageable pageable);
}
