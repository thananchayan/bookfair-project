package com.bookfair.vendor_service.configuration;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vendor")
public class controller {

  @GetMapping
  public String test() {
    return "Vendor Service is up and running!";
  }
}
