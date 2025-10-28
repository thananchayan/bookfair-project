package com.bookfair.stall_service.entity;

import com.bookfair.stall_service.enums.BookFairStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "book_fairs")
public class BookFairEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, name = "start_date")
  private LocalDate startDate;

  @Column(nullable = false, name = "end_date")
  private LocalDate endDate;

  @Column(nullable = false, name = "organizer")
  private String organizer;

  @Column(nullable = false)
  private String location;

  @Column(name = "duration_days")
  private Integer durationDays;

  @Column(length = 2000)
  private String description;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private BookFairStatus status;
}
