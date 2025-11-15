package com.bookfair.notification_service.entity;

import com.bookfair.notification_service.enums.UserProfession;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notifications")
public class NotificationEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(nullable = false, name = "receipient_email")
  @Email
  private String receipientEmail;

  @Column(nullable = false)
  private UserProfession userProfession;

  @Column(nullable = false)
  private String subject;

  @Column(nullable = false)
  private String body;

  @Column(nullable = false)
  private LocalDateTime sentAt;

  @Column(name = "reservation_token", unique = true)
  private String reservationToken;

  @Column(name = "qr_code_data", columnDefinition = "TEXT")
  private String qrCodeData;


}
