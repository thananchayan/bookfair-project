package com.bookfair.vendor_service.enums;

public enum RequestStatus {
    SUCCESS("Success"),
    FAILURE("Failure");
    private final String status; // 2. Define the final field
    RequestStatus(String status) {
        this.status = status;
    }
    public String getStatus() {
        return status;
    }
}