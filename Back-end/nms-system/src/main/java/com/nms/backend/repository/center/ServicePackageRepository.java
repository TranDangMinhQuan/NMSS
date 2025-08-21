package com.nms.backend.repository.center;

import com.nms.backend.entity.center.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {
    Optional<ServicePackage> findByIdAndStatusTrue(Long id);

    List<ServicePackage> findAllByServices_Center_IdAndStatusTrue(Long centerId);

    List<ServicePackage> findAllByServices_IdAndStatusTrue(Long serviceTypeId);

    List<ServicePackage> findAllByMinPriceGreaterThanEqualAndMaxPriceLessThanEqualAndStatusTrue(Double min, Double max);
}
