package com.thana.backend.entity;

import com.thana.backend.Enum.StallSize;
import com.thana.backend.Enum.StallStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Table(name = "stalls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stall {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NonNull
  @Column(nullable = false)
  private String name;

  @NonNull
  @Column(nullable = false)
  private String location;
  @NonNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private StallSize stallSize;

  @NonNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private StallStatus stallStatus;

}
