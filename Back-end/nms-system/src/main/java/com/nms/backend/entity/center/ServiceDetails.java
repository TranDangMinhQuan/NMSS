package com.nms.backend.entity.center;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set; // Nên dùng Set thay vì List cho các quan hệ ManyToMany

@Entity
@Table(name = "service_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ví dụ: "Bóng rổ", "Múa", "Guitar"

    @Column(length = 500)
    private String description; // Mô tả chi tiết dịch vụ

    @Column(nullable = false)
    private Double basePrice; // Giá cơ bản mỗi lần sử dụng

    @Column(nullable = false)
    private Integer durationMinutes; // thời lượng 1 lần chơi (ví dụ: 60 phút)

    @ManyToOne
    @JoinColumn(name = "service_type_id", nullable = false)
    private ServiceType serviceType;


    @Column(nullable = false)
    private Boolean status = true;
}