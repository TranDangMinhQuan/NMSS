package com.nms.backend.dto.membership;

import com.nms.backend.enums.CardStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardDTO {
    private Long id;
    private String cardNumber;
    private Long cardTypeId;
    private CardStatus status;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private Long accountId;
}
