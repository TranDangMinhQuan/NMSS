package com.nms.backend.repository.membership;


import com.nms.backend.entity.membership.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByServiceOrderId(Long serviceOrderId);
}
