package com.nms.backend.controller.membership;

import com.nms.backend.dto.membership.CardDTO;
import com.nms.backend.service.membership.CardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class CardAPI {

    private final CardService cardService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public CardDTO create(@RequestBody CardDTO dto) {
        return cardService.createCard(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public CardDTO update(@PathVariable Long id, @RequestBody CardDTO dto) {
        return cardService.updateCard(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        cardService.deleteCard(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    public CardDTO getById(@PathVariable Long id) {
        // Cần thêm logic kiểm tra quyền sở hữu trong service
        return cardService.getCardById(id);
    }

    @GetMapping("/account/{accountId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    public List<CardDTO> getByAccount(@PathVariable Long accountId) {
        // Cần thêm logic kiểm tra quyền sở hữu trong service
        return cardService.getCardsByAccount(accountId);
    }
}