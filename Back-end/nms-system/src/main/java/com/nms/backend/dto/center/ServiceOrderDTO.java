package com.nms.backend.dto.center;
import com.nms.backend.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceOrderDTO {
    private Long id;
    private Long memberId;
    private Long packageId;
    private Long serviceTypeId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private OrderStatus status;
}
