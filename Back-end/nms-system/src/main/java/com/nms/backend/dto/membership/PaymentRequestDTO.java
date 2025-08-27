package com.nms.backend.dto.membership;

import lombok.Data;
@Data
public class PaymentRequestDTO {
    private Long serviceOrderId;
    private Double amount;
    private String method; // ví dụ: CASH, BANK_TRANSFER
}

