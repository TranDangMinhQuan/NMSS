package com.nms.backend.service.center;


import com.nms.backend.dto.center.ServiceTypeDTO;

import java.util.List;

public interface ServiceTypeService {
    ServiceTypeDTO create(ServiceTypeDTO dto);
    ServiceTypeDTO update(Long id, ServiceTypeDTO dto);
    void delete(Long id); // soft delete
    ServiceTypeDTO getById(Long id);
    List<ServiceTypeDTO> getAllByCenter(Long centerId);
}
