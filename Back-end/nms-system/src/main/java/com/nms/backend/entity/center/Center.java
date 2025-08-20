package com.nms.backend.entity.center;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

@Data
@Entity
@Table(name = "Centers")
public class Center {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Center_Id")
    private Long id;

    @Column(name = "Name")
    @Nationalized
    private String name;

    @Column(name = "Address")
    @Nationalized
    private String address;

    @Column(name = "Phone", unique = true)
    private String phone;

    @Column(name = "Deleted", nullable = false)
    private Boolean deleted = false; // soft delete
}
