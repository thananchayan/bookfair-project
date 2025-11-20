package com.bookfair.stall_service.service;

import com.bookfair.stall_service.configuration.RabbitMQConfig;
import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.emailDto.ReservationEmailMessage;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.request.UserServiceRequest;
import com.bookfair.stall_service.dto.response.ReservationResponse;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.dto.response.StallReservationResponse;
import com.bookfair.stall_service.dto.response.UserServiceResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.enums.UserProfession;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.StallAllocationRepository;
import com.bookfair.stall_service.repository.StallRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StallReservationServiceImpl implements StallReservationService {

    private final StallRepository stallRepository;
    private final BookFairRepository bookFairRepository;
    private final StallAllocationRepository stallAllocationRepository;
    private final RabbitTemplate rabbitTemplate;
    private final UserServiceClient userServiceClient;


    @Override
    public ContentResponse<ReservationResponse> createReservation(
            CreateStallReservationRequest request) {

        List<Long> invalidIds = request.getStallAllocationId().stream()
                .filter(id -> !stallAllocationRepository.existsById(id))
                .toList();

        if (!invalidIds.isEmpty()) {
            throw new IllegalArgumentException("Invalid stall allocation IDs: " + invalidIds);
        }

        UserServiceRequest user = validateAndFetchUser(request.getUserId());

        List<StallAllocationEntity> stallAllocationEntity =
                stallAllocationRepository.findAllById(request.getStallAllocationId());

        List<StallAllocationEntity> existingAllocations = stallAllocationRepository.findByBookingUserId(
                request.getUserId());

        int allocatedStallByUser = existingAllocations.size();

        if ((allocatedStallByUser + request.getStallAllocationId().size()) > 3) {
            throw new IllegalArgumentException("Cannot reserve more than 3 stalls");
        }

//Validate all allocations belong to the same book fair
        List<Long> distinctBookFairIds = stallAllocationEntity.stream()
                .map(allocation -> allocation.getBookFair().getId())
                .distinct()
                .toList();
        if (distinctBookFairIds.isEmpty()) {
            throw new IllegalArgumentException("No valid stall allocations found");
        }

        if (distinctBookFairIds.size() > 1) {
            throw new IllegalArgumentException("All stall allocations must belong to the same book fair");
        }
        BookFairEntity bookFairEntity = bookFairRepository.findById(
                        distinctBookFairIds.get(0))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Book Fair with ID " + distinctBookFairIds.get(0) + " does not exist"));

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

        sendReservationEmail(request, bookFairEntity.getName(), stallAllocationEntity, token,
                user.getUsername(), user.getProfession());

        ReservationResponse response = ReservationResponse.builder()
                .userId(request.getUserId())
                .bookfairName(bookFairEntity.getName())
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

    @Override
    public ContentResponse<ReservationResponse> getReservationById(Long id) {
        StallAllocationEntity entity = stallAllocationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        StallReservationResponse stallReservationResponse = StallReservationResponse.builder()
                .stallAllocationId(entity.getId())
                .stallName(entity.getBookFair().getName())
                .status(entity.getStallAllocationStatus())
                .build();

        ReservationResponse response = ReservationResponse.builder()
                .userId(entity.getBookingUserId())
                .bookfairName(entity.getBookFair().getName())
                .stallReservationResponses(List.of(stallReservationResponse))
                .build();

        return new ContentResponse<>(
                "Reservation",
                "SUCCESS",
                "200",
                "Reservation fetched successfully",
                response);
    }

    @Override
    public ContentResponse<List<StallAllocationResponse>> getAllReservationsForBookFair(
            Long bookFairId) {
        if (!bookFairRepository.existsById(bookFairId)) {
            throw new IllegalArgumentException("Book Fair with ID " + bookFairId + " does not exist");
        }

        if (!stallAllocationRepository.existsByBookFair_Id(bookFairId)) {
            throw new IllegalArgumentException(
                    "No Stall Allocations found for Book Fair with ID " + bookFairId);
        }

        List<StallAllocationEntity> allocations = stallAllocationRepository
                .findByBookFair_Id(bookFairId);
        List<StallAllocationResponse> responseList = allocations.stream()
                .map(entity -> StallAllocationResponse.builder()
                        .id(entity.getId())
                        .userId(entity.getBookingUserId())
                        .bookFairId(entity.getBookFair().getId())
                        .hallStallID(entity.getHallStall().getId())
                        .stallId(entity.getStall().getId())
                        .reservationToken(entity.getReservationToken())
                        .price(entity.getStallPrice())
                        .stallAllocationStatus(entity.getStallAllocationStatus())
                        .build())
                .toList();
        return new ContentResponse<>(
                "StallAllocations",
                "SUCCESS",
                "200",
                "Stall allocations for book fair fetched successfully",
                responseList
        );

    }
    @Override
    public ContentResponse<List<StallReservationResponse>> getStallsByReservationToken(String token) {

        List<StallAllocationEntity> allocations =
                stallAllocationRepository.findByReservationToken(token);

        if (allocations.isEmpty()) {
            throw new IllegalArgumentException("No stalls found for this reservation token");
        }

        List<StallReservationResponse> stalls = allocations.stream()
                .map(e -> StallReservationResponse.builder()
                        .stallAllocationId(e.getId())
                        .stallName(e.getStall().getStallName())
                        .status(e.getStallAllocationStatus())
                        .build())
                .toList();

        return new ContentResponse<>(
                "Stalls",
                "SUCCESS",
                "200",
                "Stalls fetched successfully",
                stalls
        );
    }

    @Override
    public ContentResponse<Void> cancelReservation(Long id, Long userId) {
        StallAllocationEntity entity = stallAllocationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        if (entity.getBookingUserId() == null || !entity.getBookingUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized action: user does not own this reservation");
        }
        if (entity.getStallAllocationStatus() == StallAllocationStatus.CANCELLED) {
            throw new IllegalArgumentException("Reservation is already cancelled");
        }

        entity.setBookingUserId(null);
        entity.setReservationToken(null);
        entity.setStallAllocationStatus(StallAllocationStatus.PENDING);

        stallAllocationRepository.save(entity);

        return new ContentResponse<>(
                "Reservation",
                "SUCCESS",
                "200",
                "Reservation cancelled successfully",
                null
        );
    }

    @Override
    public ContentResponse<ReservationResponse> getReservationByToken(String token) {
        List<StallAllocationEntity> entity = stallAllocationRepository.findByReservationToken(token);
        if (entity.isEmpty()) {
            throw new IllegalArgumentException("Reservation not found");
        }

        StallAllocationEntity firstEntity = entity.get(0);

        List<StallReservationResponse> stallReservations = entity.stream()
                .map(e -> StallReservationResponse.builder()
                        .stallAllocationId(e.getId())
                        .stallName(e.getStall().getStallName())
                        .status(e.getStallAllocationStatus())
                        .build())
                .toList();

        ReservationResponse response = ReservationResponse.builder()
                .userId(firstEntity.getBookingUserId())
                .bookfairName(firstEntity.getBookFair().getName())
                .stallReservationResponses(stallReservations)
                .build();

        return new ContentResponse<>(
                "Reservation",
                "SUCCESS",
                "200",
                "Reservation fetched successfully",
                response
        );
    }

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

    private void sendReservationEmail(CreateStallReservationRequest request,
                                      String bookFairEntityName, List<StallAllocationEntity> allocationEntities, String token,
                                      String username, UserProfession profession) {
        try {
            List<ReservationEmailMessage.StallInfo> stallInfos = allocationEntities.stream()
                    .map(allocation -> ReservationEmailMessage.StallInfo.builder()
                            .hallName(allocation.getHallStall().getHallEntity().getHallName())
                            .stallName(allocation.getStall().getStallName())
                            .stallSize(allocation.getStall().getSize())
                            .build())
                    .toList();

            ReservationEmailMessage message = ReservationEmailMessage.builder()
                    .email(username)
                    .userProfession(profession)
                    .subject("Stall Reservation Confirmation - " + bookFairEntityName)
                    .bookFairName(bookFairEntityName)
                    .reservationToken(token)
                    .stalls(stallInfos)
                    .build();

            rabbitTemplate.convertAndSend(RabbitMQConfig.RESERVATION_EMAIL_QUEUE, message);
            log.info("Reservation email message sent to queue for user: {}", username);
        } catch (Exception e) {
            log.error("Failed to send reservation email message to queue", e);
        }
    }

    private String generateReservationToken(String username) {
        String uniqueString = username + System.currentTimeMillis();
        return UUID.nameUUIDFromBytes(uniqueString.getBytes()).toString();
    }

    private UserServiceRequest validateAndFetchUser(Long userId) {
        try {
            UserServiceResponse<UserServiceRequest> response =
                    userServiceClient.getUserById(userId);

            if (response == null || response.getData() == null) {
                throw new IllegalArgumentException("User with ID " + userId + " not found");
            }

            UserServiceRequest user = response.getData();

            if (Boolean.FALSE.equals(user.getEnabled())) {
                throw new IllegalArgumentException("User account is disabled or inactive");
            }

            return user;
        } catch (Exception e) {
            log.error("Failed to fetch user from user-service: {}", e.getMessage());
            throw new RuntimeException("Unable to validate user. Please try again later.");
        }
    }
}