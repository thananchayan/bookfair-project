package com.bookfair.vendor_service.repository;

import com.bookfair.vendor_service.entity.Vendor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepo extends JpaRepository<Vendor,Long> {
    Optional<Vendor> findByEmail(String email);
    boolean existsByEmail(String email);
}
