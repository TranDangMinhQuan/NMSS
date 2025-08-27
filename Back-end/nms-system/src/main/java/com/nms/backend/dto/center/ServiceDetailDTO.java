package com.nms.backend.dto.center;

import lombok.Data;

@Data
public class ServiceDetailDTO {
    private Long id;
    private String name;
    private String description;
    private Double basePrice;
    private Integer durationMinutes;
    private Long serviceTypeId;
    private Long packageId;
    private Boolean status;
}
