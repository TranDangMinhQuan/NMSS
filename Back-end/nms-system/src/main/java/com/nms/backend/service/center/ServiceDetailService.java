package com.nms.backend.service.center;

import com.nms.backend.dto.center.ServiceDetailDTO;
import java.util.List;

public interface ServiceDetailService {
    ServiceDetailDTO createServiceDetail(ServiceDetailDTO dto);
    ServiceDetailDTO updateServiceDetail(Long id, ServiceDetailDTO dto);
    void softDeleteServiceDetail(Long id);
    ServiceDetailDTO getServiceDetailById(Long id);


    List<ServiceDetailDTO> getServiceDetailsByServiceType(Long serviceTypeId);
    List<ServiceDetailDTO> getServiceDetailsByName(String name);
    List<ServiceDetailDTO> getServiceDetailsByDuration(Integer durationMinutes);
}
