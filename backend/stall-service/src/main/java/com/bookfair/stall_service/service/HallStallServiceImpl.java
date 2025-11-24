package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateHallRequest;
import com.bookfair.stall_service.dto.response.HallResponse;
import com.bookfair.stall_service.dto.response.HallSizeResponse;
import com.bookfair.stall_service.dto.response.HallStallResponse;
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
public class HallStallServiceImpl implements HallStallService {

  private final HallRepository hallRepository;
  private final HallStallRepository hallStallRepository;

  @Override
  public List<HallStallResponse> getHallStallsByBookFairId(Long bookFairId) {
    List<HallStallEntity> entities = hallStallRepository.findByBookFairId(bookFairId);
    List<HallStallResponse> responses = new ArrayList<>();
    for (HallStallEntity e : entities) {
      HallStallResponse.HallStallResponseBuilder b = HallStallResponse.builder()
          .id(e.getId())
          .stallName(e.getStallName());
      if (e.getHallEntity() != null) {
        b.hallId(e.getHallEntity().getId());
        b.hallName(e.getHallEntity().getHallName());
      }
      if (e.getBookFair() != null) {
        b.bookFairId(e.getBookFair().getId());
      }
      responses.add(b.build());
    }
    return responses;
  }
}
