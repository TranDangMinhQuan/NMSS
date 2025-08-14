package com.nms.backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "checkins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckIn {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private MemberProfile member;

    private String serviceType; // GYM, BOWLING
    private LocalDateTime checkInAt;
    private LocalDateTime checkOutAt;
}