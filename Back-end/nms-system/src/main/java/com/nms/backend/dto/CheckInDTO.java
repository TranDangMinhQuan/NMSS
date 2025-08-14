package com.nms.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckInDTO {
    private Long id;
    private Long memberId;     // chỉ gửi id thay vì cả MemberProfile
    private Long serviceId;    // id của dịch vụ
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
}
