package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.StallReservationResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.entity.StallReservationEntity;
import com.bookfair.stall_service.enums.ReservationStatus;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.StallRepository;
import com.bookfair.stall_service.repository.StallReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StallReservationServiceImpl implements StallReservationService {

    private final StallRepository stallRepository;
    private final BookFairRepository bookFairRepository;
    private final StallReservationRepository stallReservationRepository;

    @Override
    public ContentResponse<StallReservationResponse> createReservation(CreateStallReservationRequest request) {
        StallEntity stall = stallRepository.findById(request.getStallId())
                .orElseThrow(() -> new IllegalArgumentException("Stall not found"));

        BookFairEntity bookFair = bookFairRepository.findById(request.getBookFairId())
                .orElseThrow(() -> new IllegalArgumentException("Book fair not found"));

        if (stallReservationRepository.existsByStall_Id(request.getStallId())) {
            throw new IllegalArgumentException("Stall already reserved");
        }

        if (stallReservationRepository.existsByUserIdAndBookFair_Id(request.getUserId(), request.getBookFairId())) {
            throw new IllegalArgumentException("User already reserved a stall in this fair");
        }

        String token = UUID.randomUUID().toString();

        StallReservationEntity reservation = StallReservationEntity.builder()
                .stall(stall)
                .bookFair(bookFair)
                .userId(request.getUserId())
                .status(ReservationStatus.CONFIRMED)
                .reservationToken(token)
                .qrCodePath(null)
                .build();

        stallReservationRepository.save(reservation);

        StallReservationResponse response = StallReservationResponse.builder()
                .id(reservation.getId())
                .userId(reservation.getUserId())
                .bookFairId(reservation.getBookFair().getId())
                .stallId(reservation.getStall().getId())
                .reservationToken(token)
                .status(reservation.getStatus())
                .qrCodePath(reservation.getQrCodePath())
                .build();

        return new ContentResponse<>("Reservation", "Stall reserved successfully", "SUCCESS", "200", response);
    }

    @Override
    public ContentResponse<StallReservationResponse> getReservationById(Long id) {
        StallReservationEntity entity = stallReservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        StallReservationResponse response = StallReservationResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .bookFairId(entity.getBookFair().getId())
                .stallId(entity.getStall().getId())
                .reservationToken(entity.getReservationToken())
                .status(entity.getStatus())
                .qrCodePath(entity.getQrCodePath())
                .build();

        return new ContentResponse<>("Reservation", "Reservation fetched successfully", "SUCCESS", "200", response);
    }

    @Override
    public ContentResponse<List<StallReservationResponse>> getReservationsForUser(Long userId) {
        List<StallReservationEntity> reservations = stallReservationRepository.findByUserId(userId);

        List<StallReservationResponse> responseList = reservations.stream()
                .map(entity -> StallReservationResponse.builder()
                        .id(entity.getId())
                        .userId(entity.getUserId())
                        .bookFairId(entity.getBookFair().getId())
                        .stallId(entity.getStall().getId())
                        .reservationToken(entity.getReservationToken())
                        .status(entity.getStatus())
                        .qrCodePath(entity.getQrCodePath())
                        .build())
                .collect(Collectors.toList());

        return new ContentResponse<>("Reservations", "User reservations fetched successfully", "SUCCESS", "200", responseList);
    }

    @Override
    public ContentResponse<Void> cancelReservation(Long id, Long userId) {
        StallReservationEntity entity = stallReservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        if (!entity.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized action: user does not own this reservation");
        }

        entity.setStatus(ReservationStatus.CANCELLED);
        stallReservationRepository.save(entity);

        return new ContentResponse<>("Reservation", "Reservation cancelled successfully", "SUCCESS", "200", null);
    }
}
