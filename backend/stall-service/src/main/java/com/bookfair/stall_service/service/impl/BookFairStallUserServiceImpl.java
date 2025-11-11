package com.bookfair.stall_service.service.impl;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.EmailNotificationRequest;
import com.bookfair.stall_service.dto.request.StallReservationRequest;
import com.bookfair.stall_service.dto.response.UserReservationResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.BookFairStallUser;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.enums.BookFairStatus;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.BookFairStallUserRepository;
import com.bookfair.stall_service.repository.StallRepository;
import com.bookfair.stall_service.service.BookFairStallUserService;
import com.bookfair.stall_service.service.EmailNotificationPublisher;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookFairStallUserServiceImpl implements BookFairStallUserService {

    private final BookFairStallUserRepository reservationRepository;
    private final BookFairRepository bookFairRepository;
    private final StallRepository stallRepository;
    private final EmailNotificationPublisher emailNotificationPublisher;

    // Max 3 Stalls per business rule
    private static final int MAX_STALLS_PER_USER = 3;

    @Override
    @Transactional
    public ContentResponse<UserReservationResponse> reserveStall(
            Long userId,
            StallReservationRequest request) {

        // 1. Validate Entities
        BookFairEntity bookFair = bookFairRepository.findById(request.getBookFairId())
                .orElseThrow(() -> new IllegalArgumentException("Book Fair not found"));

        StallEntity stall = stallRepository.findById(request.getStallId())
                .orElseThrow(() -> new IllegalArgumentException("Stall not found"));

        // 2. Business Rules Check
        if (bookFair.getStatus() != BookFairStatus.UPCOMING) {
            throw new IllegalArgumentException("Cannot reserve stall for a Book Fair that is not UPCOMING.");
        }

        // Check Availability (Ensure no existing APPROVED or PENDING reservation for this stall/bookfair)
        if (reservationRepository.existsByStall_IdAndBookFair_IdAndStatusNot(
                stall.getId(),
                bookFair.getId(),
                StallAllocationStatus.CANCELLED)) { // Assumes PENDING/APPROVED are the blocking statuses
            throw new IllegalArgumentException("Stall is already reserved or pending for this Book Fair.");
        }

        // Check Max Stalls Rule
        long existingReservations = reservationRepository.countByUserIdAndBookFair(userId, bookFair);
        if (existingReservations >= MAX_STALLS_PER_USER) {
            throw new IllegalArgumentException("Maximum of 3 stalls already reserved for this user/business.");
        }

        // 3. Create Reservation
        String qrCode = UUID.randomUUID().toString();

        BookFairStallUser reservation = BookFairStallUser.builder()
                .userId(userId)
                .bookFair(bookFair)
                .stall(stall)
                .reservationDate(Instant.now())
                .status(StallAllocationStatus.APPROVED) // Assuming instant approval
                .qrCodeReference(qrCode)
                .build();

        reservationRepository.save(reservation);

        // 4. Trigger Notification (Asynchronous)
        sendReservationConfirmation(reservation);

        UserReservationResponse responseDto = mapToResponse(reservation);
        return new ContentResponse<>(
                "StallReservation",
                "Stall reserved successfully. Confirmation email sent.",
                "SUCCESS",
                "200",
                responseDto
        );
    }

    @Override
    public ContentResponse<List<UserReservationResponse>> getReservationsByUserId(Long userId) {
        List<BookFairStallUser> entities = reservationRepository.findByUserId(userId);

        List<UserReservationResponse> responses = entities.stream()
                .map(this::mapToResponse)
                .toList();

        return new ContentResponse<>(
                "UserReservations",
                "Reservations retrieved successfully",
                "SUCCESS",
                "200",
                responses
        );
    }

    private UserReservationResponse mapToResponse(BookFairStallUser entity) {
        return UserReservationResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .stallId(entity.getStall().getId())
                .bookFairId(entity.getBookFair().getId())
                .status(entity.getStatus().name())
                .qrCodeReference(entity.getQrCodeReference())
                .build();
    }

    private void sendReservationConfirmation(BookFairStallUser reservation) {
        // NOTE: In a real system, you'd need to call user-service to get the vendor's email first
        String vendorEmail = "vendor-id-" + reservation.getUserId() + "@example.com";

        EmailNotificationRequest emailRequest = EmailNotificationRequest.builder()
                .email(vendorEmail)
                .userName("Vendor " + reservation.getUserId())
                .subject("Stall Reservation Confirmed")
                .body("Your reservation for Stall: " + reservation.getStall().getStallName() +
                        " is confirmed. Your unique pass ID is: " + reservation.getQrCodeReference())
                .qrCodeReference(reservation.getQrCodeReference())
                .build();

        emailNotificationPublisher.publishEmailNotification(emailRequest);
    }
}