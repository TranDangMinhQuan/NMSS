package com.nms.backend.service.membership;

import com.nms.backend.dto.membership.CardDTO;

import java.util.List;

public interface CardService {
    CardDTO createCard(CardDTO dto);
    CardDTO updateCard(Long id, CardDTO dto);
    void deleteCard(Long id);
    CardDTO getCardById(Long id);
    List<CardDTO> getCardsByAccount(Long accountId);
    List<CardDTO> getCardsByStatus(String status);
}
