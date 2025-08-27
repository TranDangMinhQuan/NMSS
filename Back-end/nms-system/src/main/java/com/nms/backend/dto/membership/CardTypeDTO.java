package com.nms.backend.dto.membership;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardTypeDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationInMonths;
}
