package com.nms.backend.service.membership.impl;

import com.nms.backend.dto.membership.PaymentDTO;
import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.entity.membership.Payment;
import com.nms.backend.enums.PaymentStatus;
import com.nms.backend.repository.center.ServiceOrderRepository;
import com.nms.backend.repository.membership.PaymentRepository;
import com.nms.backend.service.membership.PaymentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ServiceOrderRepository serviceOrderRepository;
    private final ModelMapper modelMapper;

    @Override
    public PaymentDTO createPayment(PaymentDTO dto) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(dto.getServiceOrderId())
                .orElseThrow(() -> new RuntimeException("ServiceOrder not found"));

        Payment payment = Payment.builder()
                .serviceOrder(serviceOrder)
                .amount(dto.getAmount())
                .status(PaymentStatus.PENDING) // mặc định pending khi tạo
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return modelMapper.map(paymentRepository.save(payment), PaymentDTO.class);
    }

    @Override
    public PaymentDTO updatePayment(Long id, PaymentDTO dto) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (dto.getAmount() != null) {
            payment.setAmount(dto.getAmount());
        }
        if (dto.getStatus() != null) {
            payment.setStatus(dto.getStatus());
        }
        payment.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(paymentRepository.save(payment), PaymentDTO.class);
    }

    @Override
    public PaymentDTO getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .map(p -> modelMapper.map(p, PaymentDTO.class))
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Override
    public PaymentDTO getPaymentByServiceOrder(Long serviceOrderId) {
        Payment payment = paymentRepository.findByServiceOrder_Id(serviceOrderId);
        if (payment == null) {
            throw new RuntimeException("Payment not found for ServiceOrder: " + serviceOrderId);
        }
        return modelMapper.map(payment, PaymentDTO.class);
    }

    @Override
    public List<PaymentDTO> getPaymentsByStatus(String status) {
        PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
        return paymentRepository.findByStatus(paymentStatus)
                .stream()
                .map(p -> modelMapper.map(p, PaymentDTO.class))
                .collect(Collectors.toList());
    }
}
