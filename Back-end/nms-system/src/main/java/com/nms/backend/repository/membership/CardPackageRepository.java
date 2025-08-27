package com.nms.backend.repository.membership;

import com.nms.backend.entity.membership.CardPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CardPackageRepository extends JpaRepository<CardPackage, Long> {
    List<CardPackage> findByCardIdAndRemainingUsageGreaterThanAndEndDateAfter(Long cardId, Integer remainingUsage, LocalDateTime endDate);
}