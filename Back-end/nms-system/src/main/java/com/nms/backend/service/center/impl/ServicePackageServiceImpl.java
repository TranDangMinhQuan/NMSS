package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServicePackageDTO;
import com.nms.backend.entity.center.ServicePackage;
import com.nms.backend.entity.center.ServiceDetails;
import com.nms.backend.repository.center.ServiceDetailRepository;
import com.nms.backend.repository.center.ServicePackageRepository;

import com.nms.backend.service.center.ServicePackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicePackageServiceImpl implements ServicePackageService {

    private final ServicePackageRepository packageRepository;
    private final ServiceDetailRepository serviceDetailRepository;

    @Override
    public ServicePackageDTO create(ServicePackageDTO dto) {
        ServicePackage entity = new ServicePackage();
        mapDtoToEntity(dto, entity);
        return mapEntityToDto(packageRepository.save(entity));
    }

    @Override
    public ServicePackageDTO update(Long id, ServicePackageDTO dto) {
        ServicePackage entity = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServicePackage not found"));
        mapDtoToEntity(dto, entity);
        return mapEntityToDto(packageRepository.save(entity));
    }

    @Override
    public void softDelete(Long id) {
        ServicePackage entity = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServicePackage not found"));
        entity.setStatus(false);
        packageRepository.save(entity);
    }

    @Override
    public List<ServicePackageDTO> getAllActive() {
        return packageRepository.findByStatusTrue()
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServicePackageDTO getById(Long id) {
        ServicePackage entity = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServicePackage not found"));
        return mapEntityToDto(entity);
    }

    // ---------------------- Mapping Helpers ----------------------

    private void mapDtoToEntity(ServicePackageDTO dto, ServicePackage entity) {
        entity.setName(dto.getName());
        entity.setMinPrice(dto.getMinPrice());
        entity.setMaxPrice(dto.getMaxPrice());
        entity.setTotalSessions(dto.getTotalSessions());
        entity.setMaxDurationMinutes(dto.getMaxDurationMinutes());
        entity.setMaxUsesPerDay(dto.getMaxUsesPerDay());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : true);

        // Convert allowedDays (List<String>) -> dayConstraints (String)
        if (dto.getAllowedDays() != null) {
            List<DayOfWeek> days = dto.getAllowedDays().stream()
                    .map(DayOfWeek::valueOf)
                    .collect(Collectors.toList());
            entity.setDayConstraints(DayConstraintUtils.toDayConstraints(days));
        }

        // Lấy danh sách ServiceDetails từ các ID và gán vào entity
        if (dto.getServiceIds() != null) {
            List<ServiceDetails> serviceDetailsList = serviceDetailRepository.findAllById(dto.getServiceIds());
            if (serviceDetailsList.size() != dto.getServiceIds().size()) {
                throw new RuntimeException("One or more ServiceDetails not found");
            }
            entity.setServiceDetails(serviceDetailsList);
        }
    }

    private ServicePackageDTO mapEntityToDto(ServicePackage entity) {
        ServicePackageDTO dto = new ServicePackageDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setMinPrice(entity.getMinPrice());
        dto.setMaxPrice(entity.getMaxPrice());
        dto.setTotalSessions(entity.getTotalSessions());
        dto.setMaxDurationMinutes(entity.getMaxDurationMinutes());
        dto.setMaxUsesPerDay(entity.getMaxUsesPerDay());
        dto.setStatus(entity.getStatus());

        // Convert dayConstraints -> allowedDays
        if (entity.getDayConstraints() != null) {
            dto.setAllowedDays(DayConstraintUtils.fromDayConstraints(entity.getDayConstraints())
                    .stream().map(Enum::name).collect(Collectors.toList()));
        }

        // Lấy danh sách ID của ServiceDetails để gán vào DTO
        if (entity.getServiceDetails() != null) {
            dto.setServiceIds(entity.getServiceDetails().stream()
                    .map(ServiceDetails::getId)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}