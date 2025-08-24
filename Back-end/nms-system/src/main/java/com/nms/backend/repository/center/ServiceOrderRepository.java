package com.nms.backend.repository.center;


import com.nms.backend.entity.center.ServiceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {
    List<ServiceOrder> findAllByMember_Id(Long memberId);
    List<ServiceOrder> findAllByServicePackage_IdAndStartTimeBetween(Long packageId, LocalDateTime start, LocalDateTime end);
    List<ServiceOrder> findAllByMember_IdAndServicePackage_Id(Long memberId, Long packageId);
    List<ServiceOrder> findAllByMember_IdAndServicePackage_IdAndStartTimeBetween(Long memberId, Long packageId, LocalDateTime start, LocalDateTime end);
    long countByMember_IdAndServicePackage_Id(Long memberId, Long packageId);
}
