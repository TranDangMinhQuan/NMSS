package com.nms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private MemberProfile member;

    private String serviceType; // GYM or BOWLING

    private LocalDate date;
    private String timeSlot; // e.g., "18:00-19:00"

    private String status; // PENDING, CONFIRMED, CANCELLED
}