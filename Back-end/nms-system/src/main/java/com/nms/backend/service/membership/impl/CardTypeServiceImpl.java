package com.nms.backend.service.membership.impl;

import com.nms.backend.dto.membership.CardTypeDTO;
import com.nms.backend.entity.membership.CardType;
import com.nms.backend.repository.membership.CardTypeRepository;
import com.nms.backend.service.membership.CardTypeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardTypeServiceImpl implements CardTypeService {

    private final CardTypeRepository cardTypeRepository;
    private final ModelMapper modelMapper;

    @Override
    public CardTypeDTO createCardType(CardTypeDTO dto) {
        if (cardTypeRepository.existsByName(dto.getName())) {
            throw new RuntimeException("CardType already exists with name: " + dto.getName());
        }
        CardType cardType = modelMapper.map(dto, CardType.class);
        return modelMapper.map(cardTypeRepository.save(cardType), CardTypeDTO.class);
    }

    @Override
    public CardTypeDTO updateCardType(Long id, CardTypeDTO dto) {
        CardType cardType = cardTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CardType not found"));

        cardType.setName(dto.getName());
        cardType.setDescription(dto.getDescription());
        cardType.setPrice(dto.getPrice());
        cardType.setDurationInMonths(dto.getDurationInMonths());

        return modelMapper.map(cardTypeRepository.save(cardType), CardTypeDTO.class);
    }

    @Override
    public void deleteCardType(Long id) {
        cardTypeRepository.deleteById(id);
    }

    @Override
    public CardTypeDTO getCardTypeById(Long id) {
        return cardTypeRepository.findById(id)
                .map(c -> modelMapper.map(c, CardTypeDTO.class))
                .orElseThrow(() -> new RuntimeException("CardType not found"));
    }

    @Override
    public List<CardTypeDTO> getAllCardTypes() {
        return cardTypeRepository.findAll()
                .stream()
                .map(c -> modelMapper.map(c, CardTypeDTO.class))
                .collect(Collectors.toList());
    }
}
