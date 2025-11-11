package com.bookfair.notification_service;

import com.bookfair.notification_service.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

}
