//package com.bookfair.stall_service.entity;
//
//import com.bookfair.stall_service.enums.ReservationStatus;
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "stall_reservations")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class StallReservationEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "stall_id", nullable = false)
//    private StallEntity stall;
//
//    @ManyToOne
//    @JoinColumn(name = "book_fair_id", nullable = false)
//    private BookFairEntity bookFair;
//
//    @Column(nullable = false)
//    private Long userId;  // reference to StallUser (can later be replaced by a foreign key if same DB)
//
//    @Enumerated(EnumType.STRING)
//    private ReservationStatus status; // PENDING, CONFIRMED, CANCELLED
//
//    private String qrCodePath;
//
//    private String reservationToken;
//}
