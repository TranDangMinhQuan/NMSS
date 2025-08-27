package com.nms.backend.entity.center;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.util.List;

@Data
@Entity
@Table(name = "service_packages")
public class ServicePackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "min_price")
    private Double minPrice;

    @Column(name = "max_price")
    private Double maxPrice;

    @Column(name = "total_sessions")
    private Integer totalSessions; // tổng số lần được sử dụng

    @Column(name = "day_constraints")
    // format: "1/0/0/0/1/0/0" -> T2/T3/.../CN
    private String dayConstraints;

    @Column(name = "max_duration_minutes")
    private Integer maxDurationMinutes; // khung giờ tối đa 1 lần sử dụng

    @Column(name = "max_uses_per_day")
    private Integer maxUsesPerDay; // số lần tối đa trong 1 ngày

    @ManyToMany
    @JoinTable(
            name = "service_details_packages",
            joinColumns = @JoinColumn(name = "service_package_id"),
            inverseJoinColumns = @JoinColumn(name = "service_details_id")
    )
    private List<ServiceDetails> serviceDetails;

    @Column(name = "status")
    private Boolean status = true; // soft delete
}
