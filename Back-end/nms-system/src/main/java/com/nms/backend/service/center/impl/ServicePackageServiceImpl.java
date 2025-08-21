package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.ServicePackageDTO;
import com.nms.backend.entity.center.ServicePackage;
import com.nms.backend.entity.center.ServiceType;
import com.nms.backend.repository.center.ServicePackageRepository;
import com.nms.backend.repository.center.ServiceTypeRepository;
import com.nms.backend.service.center.ServicePackageService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicePackageServiceImpl implements ServicePackageService {

    @Autowired
    private ServicePackageRepository packageRepository;

    @Autowired
    private ServiceTypeRepository serviceTypeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ServicePackageDTO create(ServicePackageDTO dto) {
        ServicePackage pkg = modelMapper.map(dto, ServicePackage.class);

        if (dto.getServiceIds() != null && !dto.getServiceIds().isEmpty()) {
            List<ServiceType> services = serviceTypeRepository.findAllById(dto.getServiceIds());
            pkg.setServices(services);
        }

        ServicePackage saved = packageRepository.save(pkg);
        return modelMapper.map(saved, ServicePackageDTO.class);
    }

    @Override
    public ServicePackageDTO update(Long id, ServicePackageDTO dto) {
        ServicePackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ServicePackage not found"));

        modelMapper.map(dto, pkg);

        if (dto.getServiceIds() != null && !dto.getServiceIds().isEmpty()) {
            List<ServiceType> services = serviceTypeRepository.findAllById(dto.getServiceIds());
            pkg.setServices(services);
        }

        ServicePackage updated = packageRepository.save(pkg);
        return modelMapper.map(updated, ServicePackageDTO.class);
    }

    @Override
    public void delete(Long id) {
        ServicePackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ServicePackage not found"));
        pkg.setStatus(false);
        packageRepository.save(pkg);
    }

    @Override
    public ServicePackageDTO getById(Long id) {
        ServicePackage pkg = packageRepository.findByIdAndStatusTrue(id)
                .orElseThrow(() -> new IllegalArgumentException("ServicePackage not found"));
        return modelMapper.map(pkg, ServicePackageDTO.class);
    }

    @Override
    public List<ServicePackageDTO> getByCenter(Long centerId) {
        return packageRepository.findAllByServices_Center_IdAndStatusTrue(centerId)
                .stream()
                .map(pkg -> modelMapper.map(pkg, ServicePackageDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServicePackageDTO> getByServiceType(Long serviceTypeId) {
        return packageRepository.findAllByServices_IdAndStatusTrue(serviceTypeId)
                .stream()
                .map(pkg -> modelMapper.map(pkg, ServicePackageDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServicePackageDTO> getByPriceRange(Double min, Double max) {
        return packageRepository.findAllByMinPriceGreaterThanEqualAndMaxPriceLessThanEqualAndStatusTrue(min, max)
                .stream()
                .map(pkg -> modelMapper.map(pkg, ServicePackageDTO.class))
                .collect(Collectors.toList());
    }
}
