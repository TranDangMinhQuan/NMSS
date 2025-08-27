package com.nms.backend.dto.membership;
import com.nms.backend.enums.PaymentStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Long id;
    private Long serviceOrderId;
    private Double amount;
    private String method;
    private PaymentStatus status;
    private LocalDateTime paidAt;
}
