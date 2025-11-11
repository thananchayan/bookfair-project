package com.bookfair.stall_service.controller;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.StallReservationRequest;
import com.bookfair.stall_service.dto.response.UserReservationResponse;
import com.bookfair.stall_service.service.BookFairStallUserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // For JWT extraction
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reserve-management") // Base path for the Feign Client
@RequiredArgsConstructor
public class ReserveManagementController {

    private final BookFairStallUserService reservationService;

    // Helper method to extract the UserId from the authenticated JWT token
    private Long extractUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new SecurityException("Authentication is required.");
        }
        try {
            // CRITICAL: Assuming the Vendor ID is the JWT Subject (authentication.getName())
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException e) {
            throw new SecurityException("User ID (sub) not found or parsed from JWT.");
        }
    }


    /**
     * POST /api/reserve-management/reserve/{userId}
     * Consumed by user-service to initiate a reservation.
     * NOTE: The userId in the path should match the authenticated user ID for security.
     */
    @PostMapping("/reserve/{userId}")
    public ResponseEntity<ContentResponse<UserReservationResponse>> reserveStall(
            @PathVariable Long userId,
            @Valid @RequestBody StallReservationRequest request,
            Authentication authentication) {

        // Optional security check: Ensure the path variable matches the authenticated user
        Long authenticatedUserId = extractUserId(authentication);
        if (!authenticatedUserId.equals(userId)) {
            throw new SecurityException("Unauthorized: Token ID does not match requested user ID.");
        }

        ContentResponse<UserReservationResponse> response =
                reservationService.reserveStall(userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/reserve-management/user/{userId}
     * Consumed by user-service to retrieve a user's reservation history.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ContentResponse<List<UserReservationResponse>>> getReservationsByUserId(
            @PathVariable Long userId,
            Authentication authentication) {

        // Optional security check: Ensure the path variable matches the authenticated user
        Long authenticatedUserId = extractUserId(authentication);
        if (!authenticatedUserId.equals(userId)) {
            throw new SecurityException("Unauthorized: Token ID does not match requested user ID.");
        }

        ContentResponse<List<UserReservationResponse>> response =
                reservationService.getReservationsByUserId(userId);

        return ResponseEntity.ok(response);
    }
}