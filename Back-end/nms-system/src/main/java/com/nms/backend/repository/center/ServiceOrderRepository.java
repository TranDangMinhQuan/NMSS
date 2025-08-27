package com.nms.backend.repository.center;

import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {

    // Lấy tất cả order của 1 account
    @Query("SELECT o FROM ServiceOrder o WHERE o.member.id = :accountId")
    List<ServiceOrder> findByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT o FROM ServiceOrder o WHERE o.status = :status")
    List<ServiceOrder> findByStatus(@Param("status") OrderStatus status);

    // Lấy order của 1 account + theo trạng thái
    @Query("SELECT o FROM ServiceOrder o WHERE o.member.id = :accountId AND o.status = :status")
    List<ServiceOrder> findByAccountIdAndStatus(@Param("accountId") Long accountId,
                                                @Param("status") OrderStatus status);

    // Lấy order theo bookingId (nếu vẫn giữ quan hệ Booking)
    @Query("SELECT o FROM ServiceOrder o WHERE o.servicePackage.id = :bookingId")
    List<ServiceOrder> findByBookingId(@Param("bookingId") Long bookingId);

    // Kiểm tra tồn tại order theo account và trạng thái
    @Query("SELECT COUNT(o) > 0 FROM ServiceOrder o WHERE o.member.id = :accountId AND o.status = :status")
    boolean existsByAccountIdAndStatus(@Param("accountId") Long accountId,
                                       @Param("status") OrderStatus status);
    @Query("SELECT COUNT(o) FROM ServiceOrder o WHERE o.member.id = :accountId AND o.servicePackage.id = :packageId AND o.status = :status")
    long countByAccountIdAndPackageIdAndStatus(@Param("accountId") Long accountId,
                                               @Param("packageId") Long packageId,
                                               @Param("status") OrderStatus status);


}
