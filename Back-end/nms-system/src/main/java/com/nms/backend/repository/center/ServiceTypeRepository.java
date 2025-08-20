package com.nms.backend.repository.center;

import com.nms.backend.entity.center.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {
    List<ServiceType> findAllByCenterIdAndStatusTrue(Long centerId);
}
