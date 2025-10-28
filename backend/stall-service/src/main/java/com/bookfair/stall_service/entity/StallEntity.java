package com.bookfair.stall_service.entity;

import com.bookfair.stall_service.enums.Size;
import com.bookfair.stall_service.enums.Status;
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

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "stall_entity")
public class StallEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(nullable = false, unique = true)
  private String stallName;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private Size size;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private Status status;
//
//  @Column(nullable = false, unique = true)
//  private String location;
//
//  @Column(nullable = false)
//  private double price;

  private String description;

}
