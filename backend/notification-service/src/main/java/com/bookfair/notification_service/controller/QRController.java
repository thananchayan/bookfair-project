package com.bookfair.notification_service.controller;

import com.bookfair.notification_service.dto.response.QRCodeReadResponse;
import com.bookfair.notification_service.dto.response.QrReadResponse;
import com.bookfair.notification_service.service.QRCodeService;
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
                false,
                "File is empty",
                null
            )
        );
      }

      QrReadResponse decodedData = qrCodeService.readQRCodeFromImage(file);
      return ResponseEntity.ok(
          new QRCodeReadResponse(
              true,
              "QR Code read successfully",
              decodedData
          )
      );
    } catch (NotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(new QRCodeReadResponse(
              false,
              "No QR code found in the image",
              null
          ));
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new QRCodeReadResponse(
              false,
              "Error reading the image file",
              null
          ));
    }
  }

}
