package com.bookfair.vendor_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VendorServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(VendorServiceApplication.class, args);
		System.out.println("Vendor Service is running...");
	}

}
