package com.bookfair.stall_service.service;

import com.bookfair.stall_service.configuration.RabbitMQConfig;
import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.emailDto.ReservationEmailMessage;
import com.bookfair.stall_service.dto.request.CreateStallReservationRequest;
import com.bookfair.stall_service.dto.response.ReservationResponse;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.dto.response.StallReservationResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.StallAllocationEntity;
import com.bookfair.stall_service.enums.StallAllocationStatus;
import com.bookfair.stall_service.enums.UserProfession;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.StallAllocationRepository;
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

  private final BookFairRepository bookFairRepository;
  private final StallAllocationRepository stallAllocationRepository;
  private final RabbitTemplate rabbitTemplate;

  @Override
  public ContentResponse<ReservationResponse> createReservation(CreateStallReservationRequest request) {
    List<Long> invalidIds = request.getStallAllocationId().stream()
            .filter(id -> !stallAllocationRepository.existsById(id))
            .toList();

    if (!invalidIds.isEmpty()) {
      throw new IllegalArgumentException("Invalid stall allocation IDs: " + invalidIds);
    }

    List<StallAllocationEntity> allocations = stallAllocationRepository.findAllById(request.getStallAllocationId());

    long allocatedByUser = allocations.stream()
            .filter(a -> a.getBookingUserId() != null && a.getBookingUserId().equals(request.getUserId()))
            .count();

    if ((allocatedByUser + request.getStallAllocationId().size()) >= 3) {
      throw new IllegalArgumentException("Cannot reserve more than 3 stalls");
    }

    List<Long> distinctBookFairIds = allocations.stream()
            .map(a -> a.getBookFair().getId())
            .distinct()
            .toList();

    if (distinctBookFairIds.size() > 1) {
      throw new IllegalArgumentException("All stall allocations must belong to the same book fair");
    }

    BookFairEntity bookFair = bookFairRepository.findById(distinctBookFairIds.get(0))
            .orElseThrow(() -> new IllegalArgumentException("Book Fair with ID " + distinctBookFairIds.get(0) + " does not exist"));

    for (StallAllocationEntity a : allocations) {
      if (!a.getStallAllocationStatus().equals(StallAllocationStatus.PENDING)) {
        throw new IllegalArgumentException("Stall Allocation with ID " + a.getId() + " is not available for reservation");
      }
    }

    String token = generateReservationToken("user" + request.getUserId() + "@bookfair.com");

    allocations.forEach(a -> {
      a.setBookingUserId(request.getUserId());
      a.setReservationToken(token);
      a.setStallAllocationStatus(StallAllocationStatus.APPROVED);
    });

    stallAllocationRepository.saveAll(allocations);

    sendReservationEmail(bookFair.getName(), allocations, token, "sathurshans04@gmail.com", UserProfession.PUBLISHER);

    List<StallReservationResponse> stallResponses = allocations.stream()
            .map(a -> StallReservationResponse.builder()
                    .stallAllocationId(a.getId())
                    .stallName(a.getStall().getStallName())
                    .status(a.getStallAllocationStatus())
                    .build())
            .toList();

    ReservationResponse response = ReservationResponse.builder()
            .userId(request.getUserId())
            .bookfairName(bookFair.getName())
            .stallReservationResponses(stallResponses)
            .build();

    return new ContentResponse<>("Reservation", "SUCCESS", "201", "Reservation created successfully", response);
  }

  @Override
  public ContentResponse<ReservationResponse> getReservationById(Long id) {
    StallAllocationEntity entity = stallAllocationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

    StallReservationResponse stallResponse = StallReservationResponse.builder()
            .stallAllocationId(entity.getId())
            .stallName(entity.getStall().getStallName())
            .status(entity.getStallAllocationStatus())
            .build();

    ReservationResponse response = ReservationResponse.builder()
            .userId(entity.getBookingUserId())
            .bookfairName(entity.getBookFair().getName())
            .stallReservationResponses(List.of(stallResponse))
            .build();

    return new ContentResponse<>("Reservation", "SUCCESS", "200", "Reservation fetched successfully", response);
  }

  @Override
  public ContentResponse<List<StallAllocationResponse>> getAllReservationsForBookFair(Long bookFairId) {
    if (!bookFairRepository.existsById(bookFairId)) {
      throw new IllegalArgumentException("Book Fair with ID " + bookFairId + " does not exist");
    }

    List<StallAllocationEntity> allocations = stallAllocationRepository.findByBookFair_Id(bookFairId);

    List<StallAllocationResponse> responseList = allocations.stream()
            .map(a -> StallAllocationResponse.builder()
                    .id(a.getId())
                    .userId(a.getBookingUserId())
                    .bookFairId(a.getBookFair().getId())
                    .hallStallID(a.getHallStall().getId())
                    .stallId(a.getStall().getId())
                    .reservationToken(a.getReservationToken())
                    .price(a.getStallPrice())
                    .stallAllocationStatus(a.getStallAllocationStatus())
                    .build())
            .toList();

    return new ContentResponse<>("StallAllocations", "SUCCESS", "200", "Stall allocations fetched successfully", responseList);
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

    return new ContentResponse<>("Reservation", "SUCCESS", "200", "Reservation cancelled successfully", null);
  }

  @Override
  public ContentResponse<ReservationResponse> getReservationByToken(String token) {
    List<StallAllocationEntity> reservations = stallAllocationRepository.findAllByReservationToken(token);

    if (reservations.isEmpty()) {
      throw new IllegalArgumentException("Reservation not found");
    }

    StallAllocationEntity firstReservation = reservations.get(0);

    List<StallReservationResponse> stallReservations = reservations.stream()
            .map(r -> StallReservationResponse.builder()
                    .stallAllocationId(r.getId())
                    .stallName(r.getStall().getStallName())
                    .status(r.getStallAllocationStatus())
                    .build())
            .toList();

    ReservationResponse response = ReservationResponse.builder()
            .userId(firstReservation.getBookingUserId())
            .bookfairName(firstReservation.getBookFair().getName())
            .stallReservationResponses(stallReservations)
            .build();

    return new ContentResponse<>("Reservation", "SUCCESS", "200", "Reservation fetched successfully", response);
  }

  @Override
  public ContentResponse<List<StallReservationResponse>> getStallsByReservationToken(String token) {
    return null;
  }

  private void sendReservationEmail(String bookFairName,
                                    List<StallAllocationEntity> allocations,
                                    String token,
                                    String username,
                                    UserProfession profession) {
    try {
      List<ReservationEmailMessage.StallInfo> stallInfos = allocations.stream()
              .map(a -> ReservationEmailMessage.StallInfo.builder()
                      .hallName(a.getHallStall().getHallEntity().getHallName())
                      .stallName(a.getStall().getStallName())
                      .stallSize(a.getStall().getSize())
                      .build())
              .toList();

      ReservationEmailMessage message = ReservationEmailMessage.builder()
              .email(username)
              .userProfession(profession)
              .subject("Stall Reservation Confirmation - " + bookFairName)
              .bookFairName(bookFairName)
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
}
