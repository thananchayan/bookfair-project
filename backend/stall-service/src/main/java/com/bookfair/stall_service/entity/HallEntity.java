package com.bookfair.stall_service.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hall")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HallEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "book_fairs_id", nullable = false)
  private BookFairEntity bookFair;

  @Column(nullable = false)
  private String hallName;

  @Column
  private int rows;

  @Column
  private int columns;

  @Column
  private int innerRing;

  @Column
  private int outerRing;

  @Column
  private int hallSize;

  @OneToMany(mappedBy = "hallEntity", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<HallStallEntity> hallStalls;

}
