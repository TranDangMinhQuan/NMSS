package com.nms.backend.entity.center;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "service_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ví dụ: "Thể thao", "Nghệ thuật"

    @ManyToOne
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;


    @OneToMany(mappedBy = "serviceType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ServiceDetails> serviceDetails;

    @Column(name = "Status")
    private Boolean status = true; // active or soft delete

}
