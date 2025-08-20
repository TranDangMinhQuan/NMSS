package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServiceTypeDTO;
import com.nms.backend.entity.center.Center;
import com.nms.backend.entity.center.ServiceType;
import com.nms.backend.repository.center.CenterRepository;
import com.nms.backend.repository.center.ServiceTypeRepository;
import com.nms.backend.service.center.ServiceTypeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceTypeServiceImpl implements ServiceTypeService {

    @Autowired
    private ServiceTypeRepository serviceTypeRepository;

    @Autowired
    private CenterRepository centerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ServiceTypeDTO create(ServiceTypeDTO dto) {
        ServiceType serviceType = new ServiceType();
        serviceType.setName(dto.getName());
        serviceType.setDescription(dto.getDescription());
        serviceType.setStatus(true);

        // Lấy center
        Center center = centerRepository.findById(dto.getCenterId())
                .orElseThrow(() -> new IllegalArgumentException("Center not found"));
        serviceType.setCenter(center);

        ServiceType saved = serviceTypeRepository.save(serviceType);
        return modelMapper.map(saved, ServiceTypeDTO.class);
    }

    @Override
    public ServiceTypeDTO update(Long id, ServiceTypeDTO dto) {
        ServiceType serviceType = serviceTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ServiceType not found"));

        serviceType.setName(dto.getName());
        serviceType.setDescription(dto.getDescription());

        if (dto.getCenterId() != null) {
            Center center = centerRepository.findById(dto.getCenterId())
                    .orElseThrow(() -> new IllegalArgumentException("Center not found"));
            serviceType.setCenter(center);
        }

        ServiceType updated = serviceTypeRepository.save(serviceType);
        return modelMapper.map(updated, ServiceTypeDTO.class);
    }

    @Override
    public void delete(Long id) {
        ServiceType serviceType = serviceTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ServiceType not found"));
        serviceType.setStatus(false); // soft delete
        serviceTypeRepository.save(serviceType);
    }

    @Override
    public ServiceTypeDTO getById(Long id) {
        ServiceType serviceType = serviceTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ServiceType not found"));
        return modelMapper.map(serviceType, ServiceTypeDTO.class);
    }

    @Override
    public List<ServiceTypeDTO> getAllByCenter(Long centerId) {
        List<ServiceType> list = serviceTypeRepository.findAllByCenterIdAndStatusTrue(centerId);
        return list.stream()
                .map(st -> modelMapper.map(st, ServiceTypeDTO.class))
                .collect(Collectors.toList());
    }
}
