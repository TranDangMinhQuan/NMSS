package com.nms.backend.dto.center;

import lombok.Data;

import java.util.List;

@Data
public class ServicePackageDTO {
    private Long id;
    private String name;
    private Double minPrice;
    private Double maxPrice;
    private Integer totalSessions;
    private List<String> allowedDays; // để giao tiếp với FE (MONDAY, WEDNESDAY, ...)
    private Integer maxDurationMinutes;
    private Integer maxUsesPerDay;
    private List<Long> serviceIds;
    private Boolean status;
}
