package com.nms.backend.entity.membership;
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
    private String serviceType; // GYM, BOWLING
    private LocalDateTime checkInAt;
    private LocalDateTime checkOutAt;
}