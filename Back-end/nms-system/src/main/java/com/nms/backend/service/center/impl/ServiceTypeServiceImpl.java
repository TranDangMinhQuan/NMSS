package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServiceTypeDTO;
import com.nms.backend.entity.center.Center;
import com.nms.backend.entity.center.ServiceType;
import com.nms.backend.repository.center.CenterRepository;
import com.nms.backend.repository.center.ServiceTypeRepository;
import com.nms.backend.service.center.ServiceTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceTypeServiceImpl implements ServiceTypeService {

    private final ServiceTypeRepository serviceTypeRepository;
    private final CenterRepository centerRepository;

    private ServiceTypeDTO mapToDTO(ServiceType entity) {
        return ServiceTypeDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .centerId(entity.getCenter().getId())
                .build();
    }

    private ServiceType mapToEntity(ServiceTypeDTO dto) {
        Center center = centerRepository.findById(dto.getCenterId())
                .orElseThrow(() -> new RuntimeException("Center not found"));
        return ServiceType.builder()
                .id(dto.getId())
                .name(dto.getName())
                .center(center)
                .build();
    }

    @Override
    public ServiceTypeDTO create(ServiceTypeDTO dto) {
        ServiceType entity = mapToEntity(dto);
        return mapToDTO(serviceTypeRepository.save(entity));
    }

    @Override
    public ServiceTypeDTO update(Long id, ServiceTypeDTO dto) {
        ServiceType entity = serviceTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceType not found"));
        entity.setName(dto.getName());

        if (dto.getCenterId() != null && !dto.getCenterId().equals(entity.getCenter().getId())) {
            Center center = centerRepository.findById(dto.getCenterId())
                    .orElseThrow(() -> new RuntimeException("Center not found"));
            entity.setCenter(center);
        }

        return mapToDTO(serviceTypeRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!serviceTypeRepository.existsById(id)) {
            throw new RuntimeException("ServiceType not found");
        }
        serviceTypeRepository.deleteById(id);
    }

    @Override
    public ServiceTypeDTO getById(Long id) {
        return serviceTypeRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("ServiceType not found"));
    }

    @Override
    public List<ServiceTypeDTO> getByCenter(Long centerId) {
        return serviceTypeRepository.findByCenter_Id(centerId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
