package com.nms.backend.repository.center;

import com.nms.backend.entity.center.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {
    List<ServiceType> findByCenter_Id(Long centerId);
}
