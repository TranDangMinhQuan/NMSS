package com.nms.backend.service.membership;

import com.nms.backend.dto.membership.CardTypeDTO;

import java.util.List;

public interface CardTypeService {
    CardTypeDTO createCardType(CardTypeDTO dto);
    CardTypeDTO updateCardType(Long id, CardTypeDTO dto);
    void deleteCardType(Long id);
    CardTypeDTO getCardTypeById(Long id);
    List<CardTypeDTO> getAllCardTypes();
}
