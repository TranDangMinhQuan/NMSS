package com.nms.backend.entity.membership;

import com.nms.backend.entity.auth.Account;
import com.nms.backend.enums.CardStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cardNumber; // Mã định danh thẻ, ví dụ: "CARD-0001"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_type_id", nullable = false)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status; // ACTIVE, EXPIRED, BLOCKED

    @Column(nullable = false)
    private LocalDate issueDate; // ngày phát hành

    private LocalDate expiryDate; // ngày hết hạn

    private boolean deleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account; // chủ sở hữu thẻ
}
