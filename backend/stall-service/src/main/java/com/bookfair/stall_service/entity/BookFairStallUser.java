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
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bookfair_stall_users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookFairStallUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "book_fair_id", nullable = false)
    private BookFairEntity bookFair;

    @ManyToOne
    @JoinColumn(name = "stall_id", nullable = false)
    private StallEntity stall;


    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "reservation_date", nullable = false)
    private Instant reservationDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StallAllocationStatus status; // E.g., PENDING, APPROVED, CANCELLED

    @Column(name = "qr_code_ref", unique = true)
    private String qrCodeReference; // Unique pass ID

}