package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateHallRequest;
import com.bookfair.stall_service.dto.response.HallResponse;
import com.bookfair.stall_service.dto.response.HallSizeResponse;
import com.bookfair.stall_service.entity.BookFairEntity;
import com.bookfair.stall_service.entity.HallEntity;
import com.bookfair.stall_service.entity.HallStallEntity;
import com.bookfair.stall_service.enums.BookFairStatus;
import com.bookfair.stall_service.enums.Hall;
import com.bookfair.stall_service.repository.BookFairRepository;
import com.bookfair.stall_service.repository.HallRepository;
import com.bookfair.stall_service.repository.HallStallRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HallServiceImpl implements HallService {

  private final HallRepository hallRepository;
  private final BookFairRepository bookFairRepository;
  private final HallStallRepository hallStallRepository;

  @Override
  public ContentResponse<HallResponse> createHall(CreateHallRequest request) {
    if (request.getOuterRing() < request.getInnerRing()) {
      throw new IllegalArgumentException("Inner ring stalls cannot be more than outer ring stalls");
    }
    if (!bookFairRepository.existsById(request.getBookFairId())) {
      throw new IllegalArgumentException("Book fair ID does not exist");
    }
    if (hallRepository.existsByBookFairIdAndHallName(request.getBookFairId(),
        request.getHallName())) {
      throw new IllegalArgumentException("Hall with this name already exists in the book fair");
    }
    int hallSize = 0;
    if (request.getRow() > 0 && request.getColumn() > 0 && request.getInnerRing() == 0
        && request.getOuterRing() == 0) {
      hallSize = request.getRow() * request.getColumn();
    } else if (request.getInnerRing() > 0 && request.getOuterRing() > 0 && request.getRow() == 0
        && request.getColumn() == 0) {
      hallSize = request.getInnerRing() + request.getOuterRing();
    } else {
      throw new IllegalArgumentException("Invalid hall size configuration");
    }

    BookFairEntity bookFairEntity = bookFairRepository.findById(request.getBookFairId()).get();
    if (!bookFairEntity.getStatus().equals(BookFairStatus.UPCOMING)) {
      throw new IllegalArgumentException("Cannot add hall to a book fair that is not upcoming");
    }
    HallEntity hallEntity = HallEntity.builder()
        .bookFair(bookFairEntity)
        .hallName(request.getHallName())
        .rows(request.getRow())
        .columns(request.getColumn())
        .innerRing(request.getInnerRing())
        .outerRing(request.getOuterRing())
        .hallSize(hallSize)
        .build();
    hallRepository.save(hallEntity);

    List<HallStallEntity> hallStall = generateHallStalls(hallEntity, request);
    hallStallRepository.saveAll(hallStall);

    HallResponse hallResponse = mapToResponse(hallEntity);
    return new ContentResponse<>(
        "Hall",
        "SUCCESS",
        "200",
        "Hall created successfully",
        hallResponse
    );
  }

  @Override
  public ContentResponse<List<HallResponse>> getAllHalls() {
    List<HallEntity> hallEntities = hallRepository.findAll();
    List<HallResponse> hallResponses = hallEntities.stream()
        .map(this::mapToResponse)
        .toList();
    return new ContentResponse<>(
        "Hall",
        "SUCCESS",
        "200",
        "Halls retrieved successfully",
        hallResponses
    );
  }

  @Override
  public ContentResponse<HallResponse> getHallById(Long id) {
    if (!hallRepository.existsById(id)) {
      throw new IllegalArgumentException("Hall not found");
    }
    HallEntity hallEntity = hallRepository.findById(id).get();
    HallResponse hallResponse = mapToResponse(hallEntity);
    return new ContentResponse<>(
        "Hall",
        "SUCCESS",
        "200",
        "Hall retrieved successfully",
        hallResponse
    );
  }

  @Override
  public ContentResponse<Void> deleteHallById(Long id) {
    if (!hallRepository.existsById(id)) {
      throw new IllegalArgumentException("Hall not found");
    }
    hallRepository.deleteById(id);
    return new ContentResponse<>(
        "Hall",
        "SUCCESS",
        "200",
        "Hall deleted successfully",
        null
    );
  }

  @Override
  public ContentResponse<HallResponse> updateHall(Long id, CreateHallRequest request) {
    if (!hallRepository.existsById(id)) {
      throw new IllegalArgumentException("Hall not found");
    }
    if (!bookFairRepository.existsById(request.getBookFairId())) {
      throw new IllegalArgumentException("Book fair ID does not exist");
    }
    if (request.getOuterRing() > request.getInnerRing()) {
      throw new IllegalArgumentException("Outer ring stalls cannot be more than inner ring stalls");
    }
    HallEntity hallEntity = hallRepository.findById(id).get();
    BookFairEntity bookFairEntity = bookFairRepository.findById(request.getBookFairId()).get();
    hallEntity.setBookFair(bookFairEntity);
    hallEntity.setHallName(request.getHallName());
    hallEntity.setRows(request.getRow());
    hallEntity.setColumns(request.getColumn());
    hallEntity.setInnerRing(request.getInnerRing());
    hallEntity.setOuterRing(request.getOuterRing());
    int hallSize = 0;
    if (request.getRow() > 0 && request.getColumn() > 0) {
      hallSize = request.getRow() * request.getColumn();
    } else if (request.getInnerRing() > 0 && request.getOuterRing() > 0) {
      hallSize = request.getInnerRing() + request.getOuterRing();
    } else {
      throw new IllegalArgumentException("Invalid hall size configuration");
    }
    hallEntity.setHallSize(hallSize);
    hallRepository.save(hallEntity);
    HallResponse hallResponse = mapToResponse(hallEntity);
    return new ContentResponse<>(
        "Hall",
        "SUCCESS",
        "200",
        "Hall updated successfully",
        hallResponse
    );
  }

  @Override
  public HallSizeResponse getHallsize(Long bookFairId) {
    List<HallEntity> hallEntities = hallRepository.findByBookFairId(bookFairId);

    int topRows = 0;
    int topCols = 0;
    int leftRows = 0;
    int leftCols = 0;
    int rightRows = 0;
    int rightCols = 0;
    int innerRing = 0;
    int outerRing = 0;

    for (HallEntity h : hallEntities) {
      // grid-style hall (rows x columns)
      if (h.getRows() > 0 && h.getColumns() > 0 && h.getHallName() == Hall.TOP) {
        topRows += h.getRows();
        topCols += h.getColumns();
      } else if (h.getRows() > 0 && h.getColumns() > 0 && h.getHallName() == Hall.LEFT) {
        leftRows += h.getRows();
        leftCols += h.getColumns();
      } else if (h.getRows() > 0 && h.getColumns() > 0 && h.getHallName() == Hall.RIGHT) {
        rightRows += h.getRows();
        rightCols += h.getColumns();
      } else {
        innerRing += h.getInnerRing();
        outerRing += h.getOuterRing();
      }
    }

    return HallSizeResponse.builder()
        .topRows(topRows)
        .topCols(topCols)
        .leftRows(leftRows)
        .leftCols(leftCols)
        .rightRows(rightRows)
        .rightCols(rightCols)
        .innerRing(innerRing)
        .outerRing(outerRing)
        .build();
  }

  //mapToResponse implementation
  private HallResponse mapToResponse(HallEntity hallEntity) {
    return HallResponse.builder()
        .id(hallEntity.getId())
        .bookFairId(hallEntity.getBookFair().getId())
        .hallName(hallEntity.getHallName())
        .row(hallEntity.getRows())
        .column(hallEntity.getColumns())
        .innerRing(hallEntity.getInnerRing())
        .outerRing(hallEntity.getOuterRing())
        .hallSize(hallEntity.getHallSize())
        .build();
  }

  private List<HallStallEntity> generateHallStalls(HallEntity hallEntity,
      CreateHallRequest request) {
    List<HallStallEntity> hallStalls = new ArrayList<>();
    Hall hallName = hallEntity.getHallName();

    if (request.getRow() > 0 && request.getColumn() > 0) {
      for (int r = 1; r <= request.getRow(); r++) {
        for (int c = 1; c <= request.getColumn(); c++) {
          String stallLocation = hallName + "-R" + r + "C" + c;
          hallStalls.add(HallStallEntity.builder()
              .hallEntity(hallEntity)
              .stallName(stallLocation)
              .bookFair(hallEntity.getBookFair())
              .build());
        }
      }
    } else if (request.getInnerRing() > 0 && request.getOuterRing() > 0) {
      for (int i = 1; i <= request.getInnerRing(); i++) {
        String stallLocation = hallName + "-IR" + i;
        hallStalls.add(HallStallEntity.builder()
            .hallEntity(hallEntity)
            .stallName(stallLocation)
            .bookFair(hallEntity.getBookFair())
            .build());
      }
      for (int o = 1; o <= request.getOuterRing(); o++) {
        String stallLocation = hallName + "-OR" + o;
        hallStalls.add(HallStallEntity.builder()
            .hallEntity(hallEntity)
            .stallName(stallLocation)
            .bookFair(hallEntity.getBookFair())
            .build());
      }
    }
    return hallStalls;
  }
}
