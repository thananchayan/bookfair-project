package com.bookfair.stall_service.service;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.CreateHallRequest;
import com.bookfair.stall_service.dto.response.HallResponse;
import com.bookfair.stall_service.dto.response.HallSizeResponse;
import com.bookfair.stall_service.dto.response.HallStallResponse;
import java.util.List;


public interface HallStallService {

  List<HallStallResponse> getHallStallsByBookFairId(Long bookFairId);

}
