package com.nms.backend.service.membership.impl;

import com.nms.backend.dto.membership.CardDTO;
import com.nms.backend.entity.auth.Account;
import com.nms.backend.entity.membership.Card;
import com.nms.backend.entity.membership.CardType;
import com.nms.backend.enums.CardStatus;
import com.nms.backend.repository.auth.AccountRepository;
import com.nms.backend.repository.membership.CardRepository;
import com.nms.backend.repository.membership.CardTypeRepository;
import com.nms.backend.service.membership.CardService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final AccountRepository accountRepository;
    private final CardTypeRepository cardTypeRepository;
    private final ModelMapper modelMapper;

    @Override
    public CardDTO createCard(CardDTO dto) {
        Account account = accountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        CardType cardType = cardTypeRepository.findById(dto.getCardTypeId())
                .orElseThrow(() -> new RuntimeException("CardType not found"));

        LocalDate issueDate = LocalDate.now();
        LocalDate expiryDate = issueDate.plusMonths(cardType.getDurationInMonths());

        Card card = Card.builder()
                .cardNumber(dto.getCardNumber())
                .cardType(cardType)
                .account(account)
                .status(CardStatus.ACTIVE)
                .issueDate(issueDate)
                .expiryDate(expiryDate)
                .build();

        return modelMapper.map(cardRepository.save(card), CardDTO.class);
    }

    @Override
    public CardDTO updateCard(Long id, CardDTO dto) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        // nếu đổi cardType thì update expiryDate theo cardType mới
        if (dto.getCardTypeId() != null && !dto.getCardTypeId().equals(card.getCardType().getId())) {
            CardType newCardType = cardTypeRepository.findById(dto.getCardTypeId())
                    .orElseThrow(() -> new RuntimeException("CardType not found"));

            card.setCardType(newCardType);
            card.setExpiryDate(card.getIssueDate().plusMonths(newCardType.getDurationInMonths()));
        }

        if (dto.getStatus() != null) {
            card.setStatus(dto.getStatus());
        }

        return modelMapper.map(cardRepository.save(card), CardDTO.class);
    }

    @Override
    public void deleteCard(Long id) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setDeleted(true);
        card.setStatus(CardStatus.DELETED);
        cardRepository.save(card);
    }

    @Override
    public CardDTO getCardById(Long id) {
        return cardRepository.findById(id)
                .map(c -> modelMapper.map(c, CardDTO.class))
                .orElseThrow(() -> new RuntimeException("Card not found"));
    }

    @Override
    public List<CardDTO> getCardsByAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return cardRepository.findByAccount(account)
                .stream()
                .map(c -> modelMapper.map(c, CardDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CardDTO> getCardsByStatus(String status) {
        CardStatus cardStatus = CardStatus.valueOf(status.toUpperCase());
        return cardRepository.findByStatus(cardStatus)
                .stream()
                .map(c -> modelMapper.map(c, CardDTO.class))
                .collect(Collectors.toList());
    }
}
