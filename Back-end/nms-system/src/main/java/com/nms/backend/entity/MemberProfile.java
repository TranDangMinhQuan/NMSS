package com.nms.backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    private String fullName;
    private String phone;
    private String email;
    private LocalDate dob;
    private String gender;

    @ManyToOne
    @JoinColumn(name = "membership_type_id")
    private MembershipType membershipType;

    private LocalDate joinDate;
    private LocalDate expireDate;
    private Integer remainingUses; // for use-limited packages
}