package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServiceOrderRequestDTO;
import com.nms.backend.dto.center.ServiceOrderResponseDTO;
import com.nms.backend.entity.auth.Account;
import com.nms.backend.entity.center.ServicePackage;
import com.nms.backend.entity.center.ServiceType;
import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.entity.membership.Card;
import com.nms.backend.enums.CardStatus;
import com.nms.backend.enums.OrderStatus;
import com.nms.backend.repository.auth.AccountRepository;
import com.nms.backend.repository.center.ServicePackageRepository;
import com.nms.backend.repository.center.ServiceTypeRepository;
import com.nms.backend.repository.center.ServiceOrderRepository;
import com.nms.backend.repository.membership.CardRepository;
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
    private CardRepository cardRepo;

    @Autowired
    private ServiceTypeRepository serviceTypeRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ServiceOrderResponseDTO createServiceOrder(ServiceOrderRequestDTO dto) {
        Account account = accountRepo.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        ServicePackage servicePackage = packageRepo.findById(dto.getPackageId())
                .orElseThrow(() -> new IllegalArgumentException("Service package not found"));

        ServiceType serviceType = serviceTypeRepo.findById(dto.getServiceTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Service type not found"));

        Card card = cardRepo.findById(dto.getCardId())
                .orElseThrow(() -> new IllegalArgumentException("Membership card not found"));

        if (!card.getAccount().getId().equals(account.getId())) {
            throw new IllegalArgumentException("Card does not belong to this account");
        }
        if (card.getStatus() != CardStatus.ACTIVE) {
            throw new IllegalArgumentException("Card is not active");
        }

        // ... validate ngày, thời lượng, quota như bạn làm ...

        ServiceOrder order = new ServiceOrder();
        order.setMember(account);
        order.setCard(card);  //  gắn thẻ membership vào booking
        order.setServicePackage(servicePackage);
        order.setServiceType(serviceType);
        order.setStartTime(dto.getStartTime());
        order.setEndTime(dto.getEndTime());
        order.setStatus(OrderStatus.PENDING);

        return modelMapper.map(orderRepo.save(order), ServiceOrderResponseDTO.class);
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
