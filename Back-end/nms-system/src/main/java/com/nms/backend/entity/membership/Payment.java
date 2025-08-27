package com.nms.backend.entity.membership;

import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mỗi Payment gắn liền với một ServiceOrder
    @OneToOne
    @JoinColumn(name = "service_order_id", nullable = false, unique = true)
    private ServiceOrder serviceOrder;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
