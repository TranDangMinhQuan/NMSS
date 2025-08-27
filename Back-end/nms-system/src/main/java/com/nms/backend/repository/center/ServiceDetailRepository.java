package com.nms.backend.repository.center;

import com.nms.backend.entity.center.ServiceDetails;
import com.nms.backend.entity.center.ServicePackage;
import com.nms.backend.entity.center.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceDetailRepository extends JpaRepository<ServiceDetails, Long> {
    List<ServiceDetails> findByStatusTrue();
    List<ServiceDetails> findByServiceTypeAndStatusTrue(ServiceType serviceType);
    List<ServiceDetails> findByNameContainingIgnoreCaseAndStatusTrue(String name);
    List<ServiceDetails> findByDurationMinutesAndStatusTrue(Integer durationMinutes);

}
