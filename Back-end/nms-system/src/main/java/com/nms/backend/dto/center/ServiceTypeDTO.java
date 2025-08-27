package com.nms.backend.dto.center;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceTypeDTO {
    private Long id;
    private String name;
    private Long centerId; // để tham chiếu đến Center
}
