package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServiceDetailDTO;
import com.nms.backend.entity.center.ServiceDetails;
import com.nms.backend.entity.center.ServicePackage;
import com.nms.backend.entity.center.ServiceType;
import com.nms.backend.repository.center.ServiceDetailRepository;
import com.nms.backend.repository.center.ServicePackageRepository;
import com.nms.backend.repository.center.ServiceTypeRepository;
import com.nms.backend.service.center.ServiceDetailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceDetailServiceImpl implements ServiceDetailService {

    private final ServiceDetailRepository serviceDetailRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final ServicePackageRepository servicePackageRepository;
    private final ModelMapper modelMapper;

    @Override
    public ServiceDetailDTO createServiceDetail(ServiceDetailDTO dto) {
        ServiceType serviceType = serviceTypeRepository.findById(dto.getServiceTypeId())
                .orElseThrow(() -> new RuntimeException("ServiceType not found"));

        // Lấy tất cả các ServicePackage từ Set<Long> IDs trong DTO
        Set<ServicePackage> servicePackages = new HashSet<>(servicePackageRepository.findAllById(dto.getPackageIds()));
        if (servicePackages.size() != dto.getPackageIds().size()) {
            throw new RuntimeException("One or more ServicePackages not found");
        }

        ServiceDetails entity = modelMapper.map(dto, ServiceDetails.class);
        entity.setServiceType(serviceType);
        entity.setServicePackages(servicePackages); // Gán Set<ServicePackage> vào entity
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : true);

        return modelMapper.map(serviceDetailRepository.save(entity), ServiceDetailDTO.class);
    }

    @Override
    public ServiceDetailDTO updateServiceDetail(Long id, ServiceDetailDTO dto) {
        ServiceDetails existing = serviceDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceDetail not found"));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setBasePrice(dto.getBasePrice());
        existing.setDurationMinutes(dto.getDurationMinutes());

        if (dto.getServiceTypeId() != null) {
            ServiceType serviceType = serviceTypeRepository.findById(dto.getServiceTypeId())
                    .orElseThrow(() -> new RuntimeException("ServiceType not found"));
            existing.setServiceType(serviceType);
        }

        if (dto.getPackageIds() != null && !dto.getPackageIds().isEmpty()) {
            Set<ServicePackage> servicePackages = new HashSet<>(servicePackageRepository.findAllById(dto.getPackageIds()));
            if (servicePackages.size() != dto.getPackageIds().size()) {
                throw new RuntimeException("One or more ServicePackages not found");
            }
            existing.setServicePackages(servicePackages); // Gán Set<ServicePackage> vào entity
        }

        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        return modelMapper.map(serviceDetailRepository.save(existing), ServiceDetailDTO.class);
    }

    @Override
    public void softDeleteServiceDetail(Long id) {
        ServiceDetails existing = serviceDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceDetail not found"));
        existing.setStatus(false);
        serviceDetailRepository.save(existing);
    }

    @Override
    public ServiceDetailDTO getServiceDetailById(Long id) {
        return serviceDetailRepository.findById(id)
                .filter(ServiceDetails::getStatus)
                .map(entity -> modelMapper.map(entity, ServiceDetailDTO.class))
                .orElseThrow(() -> new RuntimeException("ServiceDetail not found"));
    }

    @Override
    public List<ServiceDetailDTO> getServiceDetailsByPackage(Long packageId) {
        ServicePackage servicePackage = servicePackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("ServicePackage not found"));

        // Giả định bạn đã tạo phương thức findByServicePackagesAndStatusTrue trong repository
        return serviceDetailRepository.findByServicePackagesAndStatusTrue(servicePackage)
                .stream()
                .map(entity -> modelMapper.map(entity, ServiceDetailDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceDetailDTO> getServiceDetailsByServiceType(Long serviceTypeId) {
        ServiceType serviceType = serviceTypeRepository.findById(serviceTypeId)
                .orElseThrow(() -> new RuntimeException("ServiceType not found"));

        // Đã sửa lỗi đánh máy: đổi 'servicPackage' thành 'serviceType'
        return serviceDetailRepository.findByServiceTypeAndStatusTrue(serviceType)
                .stream()
                .map(entity -> modelMapper.map(entity, ServiceDetailDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceDetailDTO> getServiceDetailsByName(String name) {
        return serviceDetailRepository.findByNameContainingIgnoreCaseAndStatusTrue(name)
                .stream()
                .map(entity -> modelMapper.map(entity, ServiceDetailDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceDetailDTO> getServiceDetailsByDuration(Integer durationMinutes) {
        return serviceDetailRepository.findByDurationMinutesAndStatusTrue(durationMinutes)
                .stream()
                .map(entity -> modelMapper.map(entity, ServiceDetailDTO.class))
                .collect(Collectors.toList());
    }
}