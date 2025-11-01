package com.bookfair.reservation_service;

import com.bookfair.reservation_service.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

}
