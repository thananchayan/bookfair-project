package com.thana.backend.service;

import com.thana.backend.dto.StallRequest;
import com.thana.backend.entity.Stall;
import com.thana.backend.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StallServiceImpl implements StallService {

  private final StallRepository stallRepository;

  @Override
  public Stall create(StallRequest request) {
    Stall stall = new Stall();
    stall.setName(request.getName());
    stall.setLocation(request.getLocation());
    stall.setStallSize(request.getStallSize());
    stall.setStallStatus(request.getStallStatus());
    return stallRepository.save(stall);
  }
}

