package com.bookfair.stall_service.entity;

import com.bookfair.stall_service.enums.StallAllocationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stall_allocations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StallAllocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "hall_stall_id", nullable = false)
    private HallStallEntity hallStall;

    @ManyToOne
    @JoinColumn(name = "stall_entity_id", nullable = false)
    private StallEntity stall;

    @ManyToOne
    @JoinColumn(name = "book_fairs_id", nullable = false)
    private BookFairEntity bookFair;

    @Column(nullable = false)
    private Long stallPrice;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StallAllocationStatus stallAllocationStatus;

    @Column
    private Long bookingUserId;

    @Column
    private String reservationToken;


}