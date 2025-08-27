package com.nms.backend.entity.center;


import com.nms.backend.entity.auth.Account;
import com.nms.backend.entity.membership.Card;
import com.nms.backend.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ServiceOrder")
public class ServiceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Người dùng (Member)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Account member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id")
    private Card card;

    // Gói dịch vụ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private ServicePackage servicePackage;

    // Loại dịch vụ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_type_id")
    private ServiceType serviceType;

    // Thời gian bắt đầu và kết thúc
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Trạng thái: PENDING, COMPLETED, CANCELLED
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
