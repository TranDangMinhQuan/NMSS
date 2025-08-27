package com.nms.backend.service.membership;

import com.nms.backend.dto.membership.PaymentDTO;

import java.util.List;

public interface PaymentService {
    PaymentDTO createPayment(PaymentDTO dto);
    PaymentDTO updatePayment(Long id, PaymentDTO dto);
    PaymentDTO getPaymentById(Long id);
    PaymentDTO getPaymentByServiceOrder(Long serviceOrderId);
    List<PaymentDTO> getPaymentsByStatus(String status);
}
