package com.nms.backend.entity;
import com.nms.backend.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true, nullable=false)
    private String username;
    @Column(nullable=false)
    private String password; // hashed later
    @Column(nullable=false)
    private Role role; // MEMBER, STAFF, ADMIN
    private boolean enabled = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
