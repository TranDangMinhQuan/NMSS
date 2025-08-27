package com.nms.backend.controller.membership;

import com.nms.backend.dto.membership.CardTypeDTO;
import com.nms.backend.service.membership.CardTypeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/card-types")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class CardTypeAPI {

    private final CardTypeService cardTypeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CardTypeDTO create(@RequestBody CardTypeDTO dto) {
        return cardTypeService.createCardType(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CardTypeDTO update(@PathVariable Long id, @RequestBody CardTypeDTO dto) {
        return cardTypeService.updateCardType(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        cardTypeService.deleteCardType(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER', 'GUEST')")
    public CardTypeDTO getById(@PathVariable Long id) {
        return cardTypeService.getCardTypeById(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER', 'GUEST')")
    public List<CardTypeDTO> getAll() {
        return cardTypeService.getAllCardTypes();
    }
}