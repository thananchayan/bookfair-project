package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.response.HallStallResponse;
import com.bookfair.stall_service.service.HallStallService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hall-stalls")
public class HallStallController {

  private final HallStallService hallStallService;

  @GetMapping("/hallStalls/{bookFairId}")
  public List<HallStallResponse> getHallStallsByBookFairId(@PathVariable Long bookFairId) {
    return hallStallService.getHallStallsByBookFairId(bookFairId);
  }
}
