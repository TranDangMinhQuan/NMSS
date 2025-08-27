package com.nms.backend.dto.center;

import com.nms.backend.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceOrderResponseDTO {
    private Long id;
    private String memberName; // Lấy từ card.account.name
    private String cardNumber; // Lấy từ card.cardNumber
    private String servicePackageName; // Lấy từ cardPackage.servicePackage.name
    private String serviceDetailsName; // Lấy từ serviceDetails.name
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private OrderStatus status;
}
