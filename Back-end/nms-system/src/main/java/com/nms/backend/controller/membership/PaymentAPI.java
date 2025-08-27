//package com.nms.backend.controller.membership;
//
//import com.nms.backend.dto.membership.PaymentDTO;
//import com.nms.backend.dto.membership.PaymentRequestDTO;
//import com.nms.backend.dto.membership.PaymentResponseDTO;
//import com.nms.backend.service.membership.PaymentService;
//import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/payments")
//@SecurityRequirement(name = "api")
//public class PaymentAPI {
//
//    @Autowired
//    private PaymentService paymentService;
//
//
//    // Lấy payment theo ID
//    @GetMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('MEMBER')")
//    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable Long id) {
//        return ResponseEntity.ok(paymentService.getPaymentById(id));
//    }
//
//    // Tạo payment mới (gắn với ServiceOrder)
//    @PostMapping
//    @PreAuthorize("hasRole('MEMBER')")
//    public ResponseEntity<PaymentResponseDTO> createPayment(@RequestBody PaymentRequestDTO dto) {
//        return ResponseEntity.ok(paymentService.createPayment(dto));
//    }
//
//    // Cập nhật payment (VD: đổi status khi thanh toán xong)
//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
//    public ResponseEntity<PaymentDTO> updatePayment(@PathVariable Long id, @RequestBody PaymentRequestDTO dto) {
//        return ResponseEntity.ok(paymentService.updatePaymentStatus(id,dto));
//    }
//
////    // Xóa payment (nếu cần thiết)
////    @DeleteMapping("/{id}")
////    @PreAuthorize("hasRole('ADMIN')")
////    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
////        paymentService.deletePayment(id);
////        return ResponseEntity.noContent().build();
////    }
//}
