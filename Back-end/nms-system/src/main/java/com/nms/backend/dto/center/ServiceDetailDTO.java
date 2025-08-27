package com.nms.backend.dto.center;

import lombok.Data;

import java.util.Set;

@Data
public class ServiceDetailDTO {
    private Long id;
    private String name;
    private String description;
    private Double basePrice;
    private Integer durationMinutes;
    private Long serviceTypeId;
    private Boolean status;
}