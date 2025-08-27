package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServiceOrderRequestDTO;
import com.nms.backend.dto.center.ServiceOrderResponseDTO;
import com.nms.backend.dto.membership.PaymentDTO;
import com.nms.backend.entity.auth.Account;
import com.nms.backend.entity.center.ServiceDetails;
import com.nms.backend.entity.center.ServicePackage;
import com.nms.backend.entity.center.ServiceType;
import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.entity.membership.Card;
import com.nms.backend.entity.membership.CardPackage;
import com.nms.backend.enums.CardStatus;
import com.nms.backend.enums.OrderStatus;
import com.nms.backend.enums.PaymentStatus;
import com.nms.backend.repository.auth.AccountRepository;
import com.nms.backend.repository.center.ServiceDetailRepository;
import com.nms.backend.repository.center.ServicePackageRepository;
import com.nms.backend.repository.center.ServiceTypeRepository;
import com.nms.backend.repository.center.ServiceOrderRepository;
import com.nms.backend.repository.membership.CardPackageRepository;
import com.nms.backend.repository.membership.CardRepository;
import com.nms.backend.repository.membership.PaymentRepository;
import com.nms.backend.service.center.ServiceOrderService;
import com.nms.backend.service.membership.PaymentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceOrderServiceImpl implements ServiceOrderService {

    @Autowired
    private ServiceOrderRepository orderRepo;

    @Autowired
    private ServicePackageRepository packageRepo;

    @Autowired
    private CardRepository cardRepo;

    @Autowired
    private CardPackageRepository cardPackageRepo;

    @Autowired
    private ServiceDetailRepository serviceDetailsRepo;

    @Autowired
    private ServiceTypeRepository serviceTypeRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private PaymentService paymentService;

    @Override
    public ServiceOrderResponseDTO createServiceOrder(ServiceOrderRequestDTO dto,Long currentUserId ) {
        // Bước 1: Tìm Card và ServiceDetails
        Card card = cardRepo.findById(dto.getCardId())
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
        ServiceDetails serviceDetails = serviceDetailsRepo.findById(dto.getServiceDetailsId())
                .orElseThrow(() -> new IllegalArgumentException("Service details not found"));

        // Bước 2: Tìm CardPackage hợp lệ
        // Xác minh thẻ có thuộc về người dùng hiện tại không
        if (!card.getAccount().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Card does not belong to the current user.");
        }
        // Tìm tất cả các gói dịch vụ trên thẻ này
        List<CardPackage> validCardPackages = cardPackageRepo
                .findByCardIdAndRemainingUsageGreaterThanAndEndDateAfter(dto.getCardId(), 0, LocalDateTime.now());

        // Kiểm tra xem có gói nào có quyền truy cập ServiceDetails đã chọn không
        CardPackage validPackage = validCardPackages.stream()
                .filter(cp -> cp.getServicePackage().getServiceDetails().contains(serviceDetails))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No valid service package found for this service."));

        // Bước 3: Tạo ServiceOrder và trừ lượt sử dụng
        ServiceOrder order = new ServiceOrder();
        order.setCardPackage(validPackage);
        order.setServiceDetails(serviceDetails);
        order.setStartTime(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING); // Trạng thái PENDING

        // Lưu ServiceOrder
        ServiceOrder savedOrder = orderRepo.save(order);

        //tạo payement
        PaymentDTO paymentDTO = PaymentDTO.builder()
                .serviceOrderId(savedOrder.getId())
                .amount(BigDecimal.valueOf(savedOrder.getServiceDetails().getBasePrice()))
                .status(PaymentStatus.PENDING)
                .build();

        paymentService.createPayment(paymentDTO);
        // Trừ lượt sử dụng (chỉ khi order được duyệt)
        // Logic trừ lượt sẽ nằm trong phương thức updateOrderStatus

        return modelMapper.map(savedOrder, ServiceOrderResponseDTO.class);
    }


    @Override
    public List<ServiceOrderResponseDTO> getOrdersByMember(Long memberId) {
        return orderRepo.findByAccountId(memberId)
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
