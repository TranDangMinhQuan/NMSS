package com.nms.backend.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "membership_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name; // GYM_1_MONTH, BOWLING_10
    private String description;
    private Integer durationDays; // nullable for use-limited
    private Integer maxUses; // nullable
    private Integer price; // in smallest currency unit
}
