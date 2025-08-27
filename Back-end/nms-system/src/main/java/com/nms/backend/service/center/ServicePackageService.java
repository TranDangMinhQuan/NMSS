package com.nms.backend.service.center;

import com.nms.backend.dto.center.ServicePackageDTO;

import java.util.List;

public interface ServicePackageService {

    ServicePackageDTO create(ServicePackageDTO dto);

    ServicePackageDTO update(Long id, ServicePackageDTO dto);

    void delete(Long id);

    ServicePackageDTO getById(Long id);

    // Lấy tất cả packages
    List<ServicePackageDTO> getAll();

    // Lấy danh sách package theo center
    List<ServicePackageDTO> getByCenter(Long centerId);

    // Lấy danh sách package theo serviceType
    List<ServicePackageDTO> getByServiceType(Long serviceTypeId);

    // Lọc theo khoảng giá
    List<ServicePackageDTO> getByPriceRange(Double min, Double max);
}
