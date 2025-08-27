package com.nms.backend.controller.membership;

import com.nms.backend.dto.membership.CardTypeDTO;
import com.nms.backend.service.membership.CardTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/card-types")
@RequiredArgsConstructor
public class CardTypeAPI {

    private final CardTypeService cardTypeService;

    @PostMapping
    public CardTypeDTO create(@RequestBody CardTypeDTO dto) {
        return cardTypeService.createCardType(dto);
    }

    @PutMapping("/{id}")
    public CardTypeDTO update(@PathVariable Long id, @RequestBody CardTypeDTO dto) {
        return cardTypeService.updateCardType(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        cardTypeService.deleteCardType(id);
    }

    @GetMapping("/{id}")
    public CardTypeDTO getById(@PathVariable Long id) {
        return cardTypeService.getCardTypeById(id);
    }

    @GetMapping
    public List<CardTypeDTO> getAll() {
        return cardTypeService.getAllCardTypes();
    }
}
