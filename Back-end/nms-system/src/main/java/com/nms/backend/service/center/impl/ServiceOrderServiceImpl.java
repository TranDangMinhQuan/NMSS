package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServiceOrderRequestDTO;
import com.nms.backend.dto.center.ServiceOrderResponseDTO;
import com.nms.backend.entity.auth.Account;
import com.nms.backend.entity.center.ServicePackage;
import com.nms.backend.entity.center.ServiceType;
import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.enums.OrderStatus;
import com.nms.backend.repository.auth.AccountRepository;
import com.nms.backend.repository.center.ServicePackageRepository;
import com.nms.backend.repository.center.ServiceTypeRepository;
import com.nms.backend.repository.center.ServiceOrderRepository;
import com.nms.backend.service.center.ServiceOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceOrderServiceImpl implements ServiceOrderService {

    @Autowired
    private ServiceOrderRepository orderRepo;

    @Autowired
    private ServicePackageRepository packageRepo;

    @Autowired
    private ServiceTypeRepository serviceTypeRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ServiceOrderResponseDTO createServiceOrder(ServiceOrderRequestDTO dto) {
        Account member = accountRepo.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        ServicePackage servicePackage = packageRepo.findById(dto.getPackageId())
                .orElseThrow(() -> new IllegalArgumentException("Service package not found"));

        ServiceType serviceType = serviceTypeRepo.findById(dto.getServiceTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Service type not found"));

        // Kiểm tra loại dịch vụ
        if (!servicePackage.getServices().contains(serviceType)) {
            throw new IllegalArgumentException("Service type not included in selected package");
        }

        // Kiểm tra day constraint
        DayOfWeek day = dto.getStartTime().getDayOfWeek();
        List<DayOfWeek> allowedDays = DayConstraintUtils.fromDayConstraints(servicePackage.getDayConstraints());
        if (!allowedDays.contains(day)) {
            throw new IllegalArgumentException("Service not allowed on this day");
        }

        // Kiểm tra thời lượng
        long minutes = java.time.Duration.between(dto.getStartTime(), dto.getEndTime()).toMinutes();
        if (minutes > servicePackage.getMaxDurationMinutes()) {
            throw new IllegalArgumentException("Duration exceeds maximum allowed minutes");
        }

        // Kiểm tra tổng số lần sử dụng gói
        long usedTimes = orderRepo.findAllByMember_IdAndServicePackage_Id(member.getId(), servicePackage.getId()).size();
        if (usedTimes >= servicePackage.getTotalSessions()) {
            throw new IllegalArgumentException("Exceeded total allowed usage for this package");
        }

        // Tạo ServiceOrder
        ServiceOrder order = new ServiceOrder();
        order.setMember(member);
        order.setServicePackage(servicePackage);
        order.setServiceType(serviceType);
        order.setStartTime(dto.getStartTime());
        order.setEndTime(dto.getEndTime());
        order.setStatus(OrderStatus.PENDING);

        ServiceOrder saved = orderRepo.save(order);
        return modelMapper.map(saved, ServiceOrderResponseDTO.class);
    }

    @Override
    public List<ServiceOrderResponseDTO> getOrdersByMember(Long memberId) {
        return orderRepo.findAllByMember_Id(memberId)
                .stream()
                .map(order -> modelMapper.map(order, ServiceOrderResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ServiceOrderResponseDTO updateOrderStatus(Long orderId, OrderStatus status) {
        ServiceOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        return modelMapper.map(orderRepo.save(order), ServiceOrderResponseDTO.class);
    }
}
