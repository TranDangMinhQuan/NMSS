package com.nms.backend.entity.membership;

import com.nms.backend.entity.center.ServicePackage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    private Integer remainingUsage; // Số lượt sử dụng còn lại
    private Integer totalUsage; // Tổng số lượt ban đầu
}
