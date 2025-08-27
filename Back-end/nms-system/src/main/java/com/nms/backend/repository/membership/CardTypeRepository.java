package com.nms.backend.repository.membership;

import com.nms.backend.entity.membership.CardType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardTypeRepository extends JpaRepository<CardType, Long> {
    boolean existsByName(String name);
}
