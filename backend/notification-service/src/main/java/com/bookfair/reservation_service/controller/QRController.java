package com.bookfair.reservation_service.controller;

import com.bookfair.reservation_service.dto.response.QRCodeReadResponse;
import com.bookfair.reservation_service.service.QRCodeService;
import com.google.zxing.NotFoundException;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QRController {

  private final QRCodeService qrCodeService;

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<QRCodeReadResponse> readQRCodeFromImage(
      @RequestParam("file") MultipartFile file) {
    try {
      if (file.isEmpty()) {
        return ResponseEntity.badRequest().body(
            new QRCodeReadResponse(
                null,
                false,
                "File is empty"
            )
        );
      }

      String decodedData = qrCodeService.readQRCodeFromImage(file);
      return ResponseEntity.ok(
          new QRCodeReadResponse(
              decodedData,
              true,
              "QR Code read successfully"
          )
      );
    } catch (NotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new QRCodeReadResponse(
              null,
              false,
              "No QR code found in the image"
          ));
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new QRCodeReadResponse(
              null,
              false,
              "Error reading the image file"
          ));
    }
  }

}
