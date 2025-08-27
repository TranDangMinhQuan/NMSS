package com.nms.backend.controller.center;

import com.nms.backend.dto.center.ServiceOrderRequestDTO;
import com.nms.backend.dto.center.ServiceOrderResponseDTO;
import com.nms.backend.enums.Role;
import com.nms.backend.enums.OrderStatus;
import com.nms.backend.service.center.ServiceOrderService;
import com.nms.backend.service.auth.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/service-orders")
@SecurityRequirement(name = "api")
public class ServiceOrderAPI {

    @Autowired
    private ServiceOrderService serviceOrderService;

    @Autowired
    private AuthenticationService authenticationService;

    // Tạo order (chỉ member)
    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ServiceOrderResponseDTO> createOrder(@RequestBody ServiceOrderRequestDTO dto, Principal principal) {
        // Lấy accountId từ principal và truyền vào service để xác minh quyền sở hữu thẻ
        Long currentUserId = authenticationService.getCurrentUser(principal).getId();
        return ResponseEntity.ok(serviceOrderService.createServiceOrder(dto, currentUserId));
    }

    // Lấy danh sách order của member
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('MEMBER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<ServiceOrderResponseDTO>> getOrdersByMember(@PathVariable Long memberId, Principal principal) {
        Role role = authenticationService.getCurrentUser(principal).getRole();
        Long currentUserId = authenticationService.getCurrentUser(principal).getId();

        // Nếu là member, chỉ được xem order của chính mình
        if (role == Role.MEMBER && !currentUserId.equals(memberId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(serviceOrderService.getOrdersByMember(memberId));
    }

    // Cập nhật trạng thái order (chỉ staff/admin)
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ServiceOrderResponseDTO> updateStatus(@PathVariable Long orderId,
                                                                @RequestParam OrderStatus status) {
        return ResponseEntity.ok(serviceOrderService.updateOrderStatus(orderId, status));
    }
}