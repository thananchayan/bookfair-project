package com.bookfair.stall_service.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {

    private Long userId;
    private String bookfairName;
    private List<StallReservationResponse> stallReservationResponses;
}