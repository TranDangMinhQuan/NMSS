package com.nms.backend.enums;


public enum OrderStatus {
    PENDING,    // chờ xác nhận / chờ check-in
    PAID,
    FAILED_PAYMENT,
    APPROVED,
    COMPLETED,  // đã sử dụng xong
    CANCELLED   // đã hủy
}
