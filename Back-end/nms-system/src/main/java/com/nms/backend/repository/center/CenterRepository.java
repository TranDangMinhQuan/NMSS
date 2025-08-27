package com.nms.backend.repository.center;

import com.nms.backend.entity.center.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CenterRepository extends JpaRepository<Center, Long> {
    Optional<Center> findByIdAndDeletedFalse(Long id);
    List<Center> findByNameAndDeletedFalse(String name);
    List<Center> findByPhoneAndDeletedFalse(String phone);
    List<Center> findByAddressAndDeletedFalse(String address);
}

