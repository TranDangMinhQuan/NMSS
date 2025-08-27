package com.nms.backend.repository.membership;

import com.nms.backend.entity.membership.Card;
import com.nms.backend.entity.auth.Account;
import com.nms.backend.enums.CardStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByAccount(Account account);
    List<Card> findByStatus(CardStatus status);
    List<Card> findByDeletedFalse();
}
