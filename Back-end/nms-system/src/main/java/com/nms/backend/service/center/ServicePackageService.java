package com.nms.backend.service.center;

import com.nms.backend.dto.center.ServicePackageDTO;

import java.util.List;

public interface ServicePackageService {
    ServicePackageDTO create(ServicePackageDTO dto);
    ServicePackageDTO update(Long id, ServicePackageDTO dto);
    void softDelete(Long id);
    List<ServicePackageDTO> getAllActive();
    ServicePackageDTO getById(Long id);
}
