package com.bookfair.vendor_service.controller;

import com.bookfair.vendor_service.dto.ContentResponse;
import com.bookfair.vendor_service.dto.request.CreateVendorRequest;
import com.bookfair.vendor_service.dto.request.UpdateVendorRequest;
import com.bookfair.vendor_service.dto.response.VendorResponse;
import com.bookfair.vendor_service.service.VendorService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vendors")
public class VendorController {
//
//    private final VendorService vendorService;
//
//    @PostMapping("/register")
//    public ResponseEntity<ContentResponse<VendorResponse>> createVendor(
//        @Valid @RequestBody CreateVendorRequest createVendorRequest){
//        return ResponseEntity.ok(vendorService.createVendor(createVendorRequest));
//    }
//
//    @GetMapping("/getAll")
//    public ResponseEntity<ContentResponse<List<VendorResponse>>> getAllVendors(){
//        return ResponseEntity.ok(vendorService.getVendors);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ContentResponse<VendorResponse>> getVendorsById(@PathVariable Long id){
//        return ResponseEntity.ok(vendorService.getVendorById(id));
//    }
}
