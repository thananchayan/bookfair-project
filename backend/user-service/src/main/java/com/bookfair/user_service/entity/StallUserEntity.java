package com.bookfair.user_service.entity;

import com.bookfair.user_service.enums.UserProfession;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StallUserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false, unique = true)
  private String phoneNumber;

  private String address;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private UserProfession profession;

  private LocalDate date;

  @Builder.Default
  @Column(nullable = false)
  private Boolean enabled = true;


}
