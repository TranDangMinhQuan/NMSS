package com.nms.backend.entity.center;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity
@Table(name = "centers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Center {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String address;

    @Column(unique = true)
    private String phone;

    @Column(nullable = false)
    private Boolean deleted = false; // soft delete flag

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ServiceType> serviceTypes;
}
