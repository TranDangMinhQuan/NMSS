package com.nms.backend.dto.center;

import lombok.Data;

@Data
public class ServiceTypeDTO {
    private Long id;
    private String name;
    private String description;
    private Long centerId;
    private Boolean status;
}
