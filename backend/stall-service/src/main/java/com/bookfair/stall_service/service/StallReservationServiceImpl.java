//package com.bookfair.stall_service.service;
//
//import com.bookfair.stall_service.dto.ContentResponse;
//import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
//import com.bookfair.stall_service.dto.response.StallAllocationResponse;
//import com.bookfair.stall_service.entity.BookFairEntity;
//import com.bookfair.stall_service.entity.StallAllocationEntity;
//import com.bookfair.stall_service.entity.StallEntity;
//import com.bookfair.stall_service.enums.BookFairStatus;
//import com.bookfair.stall_service.enums.Status;
//import com.bookfair.stall_service.repository.BookFairRepository;
//import com.bookfair.stall_service.repository.StallAllocationRepository;
//import com.bookfair.stall_service.repository.StallRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class StallReservationServiceImpl implements StallReservationService{
//
//    private final BookFairService bookFairService;
//    private final StallService stallService;
//
//    private final StallAllocationRepository stallAllocationRepository;
//    private final BookFairRepository bookFairRepository;
//    private final StallRepository stallRepository;
//
//    @Override
//    public ContentResponse<StallAllocationResponse> createStallReservation(
//            CreateStallAllocationRequest request) {
//        if (!bookFairRepository.existsById(request.getBookFairId())) {
//            throw new IllegalArgumentException("Book Fair not found");
//        }
//
//        if (!stallRepository.existsById(request.getStallId())) {
//            throw new IllegalArgumentException("Stall not found");
//        }
//
//        BookFairEntity bookFairEntity = bookFairRepository.findById(request.getBookFairId()).get();
//        StallEntity stallEntity = stallRepository.findById(request.getStallId()).get();
//
//        if (stallAllocationRepository.existsByBookFairAndStall(bookFairEntity, stallEntity)) {
//            throw new IllegalArgumentException("Stall is already allocated to this Book Fair");
//        }
//        if (bookFairEntity.getStatus() == BookFairStatus.COMPLETED
//                || bookFairEntity.getStatus() == BookFairStatus.CANCELLED) {
//            throw new IllegalArgumentException(
//                    "Cannot allocate stall to a completed or cancelled Book Fair");
//        }
//        if (stallEntity.getStatus() == Status.BLOCKED) {
//            throw new IllegalArgumentException("Stall is blocked and cannot be allocated");
//        }
//
//        if (stallAllocationRepository.existsByBookFairAndStallLocation(bookFairEntity,
//                request.getStallLocation())) {
//            throw new IllegalArgumentException("Stall location is already taken in this Book Fair");
//        }
//
//        StallAllocationEntity entity = mapToEntity(request);
//        stallAllocationRepository.save(entity);
//        StallAllocationResponse response = mapToResponse(entity);
//        return new ContentResponse<>(
//                "StallAllocation",
//                "Stall Allocation created successfully",
//                "SUCCESS",
//                "200",
//                response
//        );
//    }
//
//
//}




package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateStallAllocationRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.entity.StallEntity;
import com.bookfair.stall_service.enums.BookFairStatus;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.enums.Status;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.StallAllocationRepository;
import com.bookfair.stall_service.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StallReservationServiceImpl implements StallReservationService {

    private final StallAllocationRepository stallAllocationRepository;
    private final BookFairRepository bookFairRepository;
    private final StallRepository stallRepository;

    @Override
    public ContentResponse<StallAllocationResponse> createStallReservation(CreateStallAllocationRequest request) {
        // Validate BookFair existence
        BookFairEntity bookFair = bookFairRepository.findById(request.getBookFairId())
                .orElseThrow(() -> new IllegalArgumentException("Book Fair not found"));

        // Validate Stall existence
        StallEntity stall = stallRepository.findById(request.getStallId())
                .orElseThrow(() -> new IllegalArgumentException("Stall not found"));

        // Check if the same stall is already allocated for the same book fair
        if (stallAllocationRepository.existsByBookFairAndStall(bookFair, stall)) {
            throw new IllegalArgumentException("This stall is already allocated for this Book Fair");
        }

        // Prevent allocation for completed or cancelled fairs
        if (bookFair.getStatus() == BookFairStatus.COMPLETED ||
                bookFair.getStatus() == BookFairStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot allocate stall to a completed or cancelled Book Fair");
        }

        // Prevent allocation if stall is blocked
        if (stall.getStatus() == Status.BLOCKED) {
            throw new IllegalArgumentException("This stall is blocked and cannot be allocated");
        }

        // Prevent duplicate location allocation
        if (stallAllocationRepository.existsByBookFairAndStallLocation(bookFair, request.getStallLocation())) {
            throw new IllegalArgumentException("This stall location is already taken for this Book Fair");
        }

        // Map request to entity
        StallAllocationEntity entity = mapToEntity(request, bookFair, stall);
        stallAllocationRepository.save(entity);

        // Map entity to response
        StallAllocationResponse response = mapToResponse(entity);

        return new ContentResponse<>(
                "StallReservation",
                "Stall reservation created successfully",
                "SUCCESS",
                "200",
                response
        );
    }

    @Override
    public ContentResponse<StallAllocationResponse> getAllStallReservationById(Long id) {
        Optional<StallAllocationEntity> reservation = stallAllocationRepository.findById(id);
        if (reservation.isEmpty()) {
            throw new IllegalArgumentException("Reservation not found for ID: " + id);
        }

        StallAllocationResponse response = mapToResponse(reservation.get());
        return new ContentResponse<>(
                "StallReservation",
                "Reservation fetched successfully",
                "SUCCESS",
                "200",
                response
        );
    }

    // ---------------- Helper Mapping Methods ----------------

    private StallAllocationEntity mapToEntity(CreateStallAllocationRequest request,
                                              BookFairEntity bookFair,
                                              StallEntity stall) {
        return StallAllocationEntity.builder()
                .bookFair(bookFair)
                .stall(stall)
                .stallLocation(request.getStallLocation())
                .stallPrice(request.getPrice())
                .stallAllocationStatus(StallAllocationStatus.RESERVED)
                .build();
    }

    private StallAllocationResponse mapToResponse(StallAllocationEntity entity) {
        return StallAllocationResponse.builder()
                .id(entity.getId())
                .bookFairId(entity.getBookFair().getId())
                .stallId(entity.getStall().getId())
                .stallLocation(entity.getStallLocation())
                .status(entity.getStallAllocationStatus())
                .bookFairStatus(entity.getBookFair().getStatus())
                .price(entity.getStallPrice())
                .build();
    }
}
