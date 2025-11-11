package com.bookfair.stall_service.listener;

import com.bookfair.stall_service.dto.ContentResponse;
import com.bookfair.stall_service.dto.request.GetReservationsRequest;
import com.bookfair.stall_service.dto.response.StallAllocationResponse;
import com.bookfair.stall_service.service.StallAllocationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationQueryListener {

    private final StallAllocationService stallAllocationService;
    private final RabbitTemplate rabbitTemplate;

    // NOTE: This queue name must match the VENDOR_RESERVATIONS_GET_QUEUE constant
    @RabbitListener(queues = {"vendor.reservations.get.queue"})
    public void handleReservationQuery(GetReservationsRequest request) {
        log.info("Received reservation query for vendorId: {}", request.getVendorId());

        ContentResponse<Object> response;
        try {
            // 1. Fetch data using the existing service logic
            ContentResponse<List<StallAllocationResponse>> serviceResponse =
                    stallAllocationService.getAllReservationsByVendor(request.getVendorId());

            response = new ContentResponse<>(
                    "VendorReservations",
                    "SUCCESS",
                    "200",
                    "Reservations found",
                    serviceResponse.getData()
            );

        } catch (Exception e) {
            log.error("Error fetching reservations for vendorId: {}", request.getVendorId(), e);
            response = new ContentResponse<>(
                    "VendorReservations",
                    "FAILURE",
                    "500",
                    e.getMessage(),
                    null
            );
        }

        // 2. Send the reply back to the designated reply queue
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.VENDOR_RESERVATIONS_REPLY_ROUTING_KEY,
                response
        );
        log.info("Sent reservation reply for vendorId: {} to queue: {}", request.getVendorId(), RabbitMQConfig.VENDOR_RESERVATIONS_REPLY_ROUTING_KEY);
    }
}