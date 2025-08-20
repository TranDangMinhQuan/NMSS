package com.nms.backend.repository.center;



import com.nms.backend.entity.center.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {
    List<ServicePackage> findAllByStatusTrue();
}
