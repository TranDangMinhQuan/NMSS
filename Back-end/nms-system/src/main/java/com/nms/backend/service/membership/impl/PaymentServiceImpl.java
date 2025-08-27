package com.nms.backend.service.membership.impl;

import com.nms.backend.dto.membership.PaymentDTO;
import com.nms.backend.entity.membership.Payment;
import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.enums.OrderStatus;
import com.nms.backend.enums.PaymentStatus;
import com.nms.backend.repository.membership.PaymentRepository;
import com.nms.backend.repository.center.ServiceOrderRepository;
import com.nms.backend.service.membership.PaymentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ServiceOrderRepository serviceOrderRepository;

    /**
     * Auto-create Payment khi Order được APPROVED
     */
    @Override
    public PaymentDTO createPaymentForOrder(Long serviceOrderId) {
        ServiceOrder order = serviceOrderRepository.findById(serviceOrderId)
                .orElseThrow(() -> new RuntimeException("ServiceOrder not found"));

        if (order.getStatus() != OrderStatus.APPROVED) {
            throw new RuntimeException("Payment can only be created when order is APPROVED");
        }

        // Check nếu payment đã tồn tại
        paymentRepository.findByServiceOrderId(serviceOrderId)
                .ifPresent(p -> {
                    throw new RuntimeException("Payment already exists for this order");
                });

        Payment payment = Payment.builder()
                .serviceOrder(order)
                .amount(order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO)
                .status(PaymentStatus.PENDING) // mặc định là PENDING
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToDTO(paymentRepository.save(payment));
    }

    /**
     * Cập nhật trạng thái Payment (PENDING -> PAID / FAILED / CANCELLED)
     */
    @Override
    public PaymentDTO updatePaymentStatus(Long paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        PaymentStatus newStatus;
        try {
            newStatus = PaymentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid payment status: " + status);
        }

        payment.setStatus(newStatus);
        payment.setUpdatedAt(LocalDateTime.now());

        // Nếu thanh toán thành công thì có thể cập nhật trạng thái order sang PAID
        if (newStatus == PaymentStatus.SUCCESS) {
            ServiceOrder order = payment.getServiceOrder();
            order.setStatus(OrderStatus.COMPLETED);
            serviceOrderRepository.save(order);
        }

        return mapToDTO(paymentRepository.save(payment));
    }

    @Override
    public PaymentDTO getPaymentByOrder(Long serviceOrderId) {
        return paymentRepository.findByServiceOrderId(serviceOrderId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Payment not found for this order"));
    }

    @Override
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PaymentDTO mapToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .serviceOrderId(payment.getServiceOrder().getId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
