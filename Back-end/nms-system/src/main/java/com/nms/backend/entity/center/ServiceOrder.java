package com.nms.backend.entity.center;


import com.nms.backend.entity.auth.Account;
import com.nms.backend.entity.membership.Card;
import com.nms.backend.entity.membership.CardPackage;
import com.nms.backend.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
// Trong ServiceOrder.java
@Data
@Entity
@Table(name = "ServiceOrder")
public class ServiceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_package_id") // Liên kết trực tiếp với CardPackage
    private CardPackage cardPackage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_details_id") // Thêm liên kết tới dịch vụ cụ thể
    private ServiceDetails serviceDetails;

    // Thời gian bắt đầu và kết thúc
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Trạng thái: PENDING, APPROVED, CANCELLED
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
