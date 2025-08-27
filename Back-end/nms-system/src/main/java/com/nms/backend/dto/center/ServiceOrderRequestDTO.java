package com.nms.backend.dto.center;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceOrderRequestDTO {
    private Long memberId; // Khách hàng
    private Long cardId;
    private Long packageId; // Gói dịch vụ
    private Long serviceTypeId; // Loại dịch vụ
    private LocalDateTime startTime; // Thời gian bắt đầu sử dụng
    private LocalDateTime endTime;
}
