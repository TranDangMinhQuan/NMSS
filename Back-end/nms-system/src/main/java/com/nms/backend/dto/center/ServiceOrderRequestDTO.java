package com.nms.backend.dto.center;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceOrderRequestDTO {
    private Long cardId; // ID của thẻ đang dùng để quẹt
    private Long serviceDetailsId; // ID của dịch vụ cụ thể đang sử dụng
}
