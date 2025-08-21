package com.nms.backend.entity.center;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

@Data
@Entity
@Table(name = "ServiceType")
public class ServiceType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Description")
    @Nationalized
    private String description;

    // Mỗi loại dịch vụ thuộc 1 trung tâm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private Center center;

    
    @Column(name = "Status")
    private Boolean status = true; // active or soft delete
}
