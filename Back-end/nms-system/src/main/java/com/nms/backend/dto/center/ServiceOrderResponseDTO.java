package com.nms.backend.dto.center;

import com.nms.backend.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceOrderResponseDTO {
    private Long id;
    private String memberName;
    private String packageName;
    private String serviceTypeName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private OrderStatus status; // true: completed, false: pending
}
