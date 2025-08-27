package com.nms.backend.entity.membership;

import com.nms.backend.entity.center.ServicePackage;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "card_packages")
public class CardPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private ServicePackage servicePackage;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
