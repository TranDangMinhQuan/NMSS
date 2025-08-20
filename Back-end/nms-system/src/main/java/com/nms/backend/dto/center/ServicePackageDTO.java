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
    private String dayConstraints;
    private Integer maxDurationMinutes;
    private List<Long> serviceIds; // danh sách serviceId gắn với package
}
