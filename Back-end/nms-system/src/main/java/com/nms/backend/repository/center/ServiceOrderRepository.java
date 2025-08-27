package com.nms.backend.repository.center;

import com.nms.backend.entity.center.ServiceOrder;
import com.nms.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {

    // Lấy tất cả order của 1 account
    // Đường dẫn đúng: ServiceOrder -> CardPackage -> Card -> Account
    @Query("SELECT o FROM ServiceOrder o WHERE o.cardPackage.card.account.id = :accountId")
    List<ServiceOrder> findByAccountId(@Param("accountId") Long accountId);

    // Lấy order theo trạng thái, truy vấn này đúng
    @Query("SELECT o FROM ServiceOrder o WHERE o.status = :status")
    List<ServiceOrder> findByStatus(@Param("status") OrderStatus status);

    // Lấy order của 1 account + theo trạng thái
    // Đã sửa: o.member.id -> o.cardPackage.card.account.id
    @Query("SELECT o FROM ServiceOrder o WHERE o.cardPackage.card.account.id = :accountId AND o.status = :status")
    List<ServiceOrder> findByAccountIdAndStatus(@Param("accountId") Long accountId,
                                                @Param("status") OrderStatus status);

    // Lấy order theo bookingId (nên được đổi thành packageId)
    // Đã sửa: o.servicePackage.id -> o.cardPackage.servicePackage.id
    @Query("SELECT o FROM ServiceOrder o WHERE o.cardPackage.servicePackage.id = :packageId")
    List<ServiceOrder> findByServicePackageId(@Param("packageId") Long packageId);

    // Kiểm tra tồn tại order theo account và trạng thái
    // Đã sửa: o.member.id -> o.cardPackage.card.account.id
    boolean existsByCardPackage_Card_Account_IdAndStatus(Long accountId, OrderStatus status);

    // Đếm số lần sử dụng của một gói dịch vụ cho một tài khoản cụ thể
    // Đã sửa: o.member.id -> o.cardPackage.card.account.id và o.servicePackage.id -> o.cardPackage.servicePackage.id
    @Query("SELECT COUNT(o) FROM ServiceOrder o WHERE o.cardPackage.card.account.id = :accountId AND o.cardPackage.servicePackage.id = :packageId AND o.status = :status")
    long countByAccountIdAndPackageIdAndStatus(@Param("accountId") Long accountId,
                                               @Param("packageId") Long packageId,
                                               @Param("status") OrderStatus status);
}