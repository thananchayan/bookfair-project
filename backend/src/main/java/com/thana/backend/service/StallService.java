package com.thana.backend.service;

import com.thana.backend.dto.StallRequest;
import com.thana.backend.entity.Stall;

public interface StallService {

  Stall create(StallRequest request);
}
