package com.nms.backend.repository.membership;

import com.nms.backend.entity.membership.Payment;
import com.nms.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);
    Payment findByServiceOrder_Id(Long serviceOrderId);
}
