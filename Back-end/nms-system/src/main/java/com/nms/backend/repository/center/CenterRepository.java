package com.nms.backend.repository.center;

import com.nms.backend.entity.center.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CenterRepository extends JpaRepository<Center, Long> {
    List<Center> findAllByDeletedFalse();
}

