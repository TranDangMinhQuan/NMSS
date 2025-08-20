package com.nms.backend.service.center;


import com.nms.backend.dto.center.ServiceOrderRequestDTO;
import com.nms.backend.dto.center.ServiceOrderResponseDTO;
import com.nms.backend.enums.OrderStatus;

import java.util.List;

public interface ServiceOrderService {
    ServiceOrderResponseDTO createServiceOrder(ServiceOrderRequestDTO requestDTO);
    List<ServiceOrderResponseDTO> getOrdersByMember(Long memberId);
    ServiceOrderResponseDTO updateOrderStatus(Long orderId, OrderStatus status);
}

