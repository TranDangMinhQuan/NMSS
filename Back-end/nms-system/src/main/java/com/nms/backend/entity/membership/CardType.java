package com.nms.backend.entity.membership;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "card_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Ví dụ: "VIP", "STANDARD", "STUDENT"

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer durationInMonths; // ví dụ: 12 tháng
}
