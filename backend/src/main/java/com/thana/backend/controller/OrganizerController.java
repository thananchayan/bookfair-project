package com.thana.backend.controller;

import com.thana.backend.dto.StallRequest;
import com.thana.backend.entity.Stall;
import com.thana.backend.service.StallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/organizers")
public class OrganizerController {


  private final StallService stallService;

  @Autowired
  public OrganizerController(StallService stallService) {
    this.stallService = stallService;
  }

  @PostMapping
  public ResponseEntity<Stall> createStall(@RequestBody StallRequest request) {
    Stall createdStall = stallService.create(request);
    return ResponseEntity.ok(createdStall);
  }


}
