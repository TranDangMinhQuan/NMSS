package com.nms.backend.controller.membership;

import com.nms.backend.dto.membership.CardDTO;
import com.nms.backend.service.membership.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardAPI {

    private final CardService cardService;

    @PostMapping
    public CardDTO create(@RequestBody CardDTO dto) {
        return cardService.createCard(dto);
    }

    @PutMapping("/{id}")
    public CardDTO update(@PathVariable Long id, @RequestBody CardDTO dto) {
        return cardService.updateCard(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        cardService.deleteCard(id);
    }

    @GetMapping("/{id}")
    public CardDTO getById(@PathVariable Long id) {
        return cardService.getCardById(id);
    }

    @GetMapping("/account/{accountId}")
    public List<CardDTO> getByAccount(@PathVariable Long accountId) {
        return cardService.getCardsByAccount(accountId);
    }

}
