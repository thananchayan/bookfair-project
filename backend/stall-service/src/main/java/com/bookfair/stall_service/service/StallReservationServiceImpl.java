package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.ReservationResponse;
import com.bookfair.stall_service.dto.response.StallReservationResponse;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.StallAllocationRepository;
import com.bookfair.stall_service.repository.StallRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StallReservationServiceImpl implements StallReservationService {

    private final StallRepository stallRepository;
    private final BookFairRepository bookFairRepository;
    private final StallAllocationRepository stallAllocationRepository;


    @Override
    public ContentResponse<ReservationResponse> createReservation(
            CreateStallReservationRequest request) {

        List<Long> invalidIds = request.getStallAllocationId().stream()
                .filter(id -> !stallAllocationRepository.existsById(id))
                .toList();

        if (!invalidIds.isEmpty()) {
            throw new IllegalArgumentException("Invalid stall allocation IDs: " + invalidIds);
        }

        List<StallAllocationEntity> stallAllocationEntity = stallAllocationRepository.findAllById(
                request.getStallAllocationId());

        Long allocatedStallByUser = stallAllocationEntity.stream()
                .filter(
                        a -> a.getBookingUserId() != null && a.getBookingUserId().equals(request.getUserId()))
                .count();

        if ((allocatedStallByUser + request.getStallAllocationId().size()) > 3) {
            throw new IllegalArgumentException("Cannot reserve more than 3 stalls");
        }

//Validate all allocations belong to the same book fair

        List<Long> distinctBookFairIds = stallAllocationEntity.stream()
                .map(allocation -> allocation.getHallStall().getHallEntity().getBookFair().getId())
                .distinct()
                .toList();
        if (distinctBookFairIds.size() > 1) {
            throw new IllegalArgumentException("All stall allocations must belong to the same book fair");
        }

        for (StallAllocationEntity allocation : stallAllocationEntity) {
            if (!allocation.getStallAllocationStatus().equals(StallAllocationStatus.PENDING)) {
                throw new IllegalArgumentException(
                        "Stall Allocation with ID " + allocation.getId() + " is not available for reservation");
            }
        }
        String token = generateReservationToken("user" + request.getUserId() + "@bookfair.com");

        //add userId and token in stallAllocationEntity for perticular user
        for (StallAllocationEntity allocation : stallAllocationEntity) {
            allocation.setBookingUserId(request.getUserId());
            allocation.setReservationToken(token);
            allocation.setStallAllocationStatus(StallAllocationStatus.APPROVED);
        }

        stallAllocationRepository.saveAll(stallAllocationEntity);

        ReservationResponse response = ReservationResponse.builder()
                .userId(request.getUserId())
                .bookfairName(bookFairRepository.findById(
                        distinctBookFairIds.get(0)).get().getName())
                .stallReservationResponses(stallAllocationEntity.stream()
                        .map(allocation -> StallReservationResponse.builder()
                                .stallAllocationId(allocation.getId())
                                .stallName(allocation.getStall().getStallName())
                                .status(allocation.getStallAllocationStatus())
                                .build())
                        .toList())
                .build();
        return new ContentResponse<>(
                "Reservation",
                "SUCCESS",
                "201",
                "Reservation created successfully",
                response
        );


    }

//    @Override
//    public ContentResponse<StallReservationResponse> getReservationById(Long id) {
//        StallReservationEntity entity = stallReservationRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
//
//        StallReservationResponse response = StallReservationResponse.builder()
//                .stallAllocationId(entity.getId())
//                .userId(entity.getUserId())
//                .bookFairId(entity.getBookFair().getId())
//                .stallId(entity.getStall().getId())
//                .reservationToken(entity.getReservationToken())
//                .status(entity.getStatus())
//                .qrCodePath(entity.getQrCodePath())
//                .build();
//
//        return new ContentResponse<>("Reservation", "Reservation fetched successfully", "SUCCESS", "200", response);
//    }
//
//    @Override
//    public ContentResponse<List<StallReservationResponse>> getReservationsForUser(Long userId) {
//        List<StallReservationEntity> reservations = stallReservationRepository.findByUserId(userId);
//
//        List<StallReservationResponse> responseList = reservations.stream()
//                .map(entity -> StallReservationResponse.builder()
//                        .stallAllocationId(entity.getId())
//                        .userId(entity.getUserId())
//                        .bookFairId(entity.getBookFair().getId())
//                        .stallId(entity.getStall().getId())
//                        .reservationToken(entity.getReservationToken())
//                        .status(entity.getStatus())
//                        .qrCodePath(entity.getQrCodePath())
//                        .build())
//                .collect(Collectors.toList());
//
//        return new ContentResponse<>("Reservations", "User reservations fetched successfully", "SUCCESS", "200", responseList);
//    }
//
//    @Override
//    public ContentResponse<Void> cancelReservation(Long id, Long userId) {
//        StallReservationEntity entity = stallReservationRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
//
//        if (!entity.getUserId().equals(userId)) {
//            throw new IllegalArgumentException("Unauthorized action: user does not own this reservation");
//        }
//
//        entity.setStatus(ReservationStatus.CANCELLED);
//        stallReservationRepository.save(entity);
//
//        return new ContentResponse<>("Reservation", "Reservation cancelled successfully", "SUCCESS", "200", null);
//    }

    private String generateReservationToken(String username) {
        String uniqueString = username + System.currentTimeMillis();
        return UUID.nameUUIDFromBytes(uniqueString.getBytes()).toString();
    }
}