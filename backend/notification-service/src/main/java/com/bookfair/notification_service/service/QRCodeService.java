package com.bookfair.notification_service.service;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.LuminanceSource;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import java.awt.image.BufferedImage;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class QRCodeService {


  public String readQRCodeFromImage(MultipartFile file) throws IOException, NotFoundException {
    BufferedImage bufferedImage = ImageIO.read(file.getInputStream());

    if (bufferedImage == null) {
      throw new IOException("Could not read image file");
    }

    LuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
    BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

    try {
      Map<DecodeHintType, Object> hints = new HashMap<>();
      hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");

      Result result = new MultiFormatReader().decode(bitmap, hints);
      String resultText = result.getText();
      return extractReservationId(resultText);

    } catch (NotFoundException e) {
      log.error("QR code not found in image: {}", e.getMessage());
      throw new FileNotFoundException("QR code not found in the provided image.");
    }
  }


  private String extractReservationId(String qrData) {
    // Split by newline and find the line containing "Reservation ID:"
    String[] lines = qrData.split("\\n");

    for (String line : lines) {
      if (line.startsWith("Reservation ID:")) {
        // Extract the value after "Reservation ID: "
        return line.substring("Reservation ID:".length()).trim();
      }
    }
    log.warn("Reservation ID not found in QR code data: {}", qrData);
    throw new IllegalArgumentException("Invalid QR code format: Reservation ID not found");
  }
}
