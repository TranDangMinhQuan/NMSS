package com.nms.backend.controller.membership;

import com.nms.backend.dto.membership.PaymentDTO;
import com.nms.backend.service.membership.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentAPI {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentDTO> create(@RequestBody PaymentDTO dto) {
        return ResponseEntity.ok(paymentService.createPayment(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDTO> update(@PathVariable Long id, @RequestBody PaymentDTO dto) {
        return ResponseEntity.ok(paymentService.updatePayment(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/service-order/{serviceOrderId}")
    public ResponseEntity<PaymentDTO> getByServiceOrder(@PathVariable Long serviceOrderId) {
        return ResponseEntity.ok(paymentService.getPaymentByServiceOrder(serviceOrderId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDTO>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }
}
