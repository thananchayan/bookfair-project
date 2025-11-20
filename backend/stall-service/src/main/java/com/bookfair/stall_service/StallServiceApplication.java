package com.bookfair.stall_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class StallServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(StallServiceApplication.class, args);
    System.out.println("Stall Service is running...");
  }

}
