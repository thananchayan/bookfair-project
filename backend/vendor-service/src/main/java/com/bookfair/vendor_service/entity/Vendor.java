package com.bookfair.vendor_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vendors")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Note: Will store raw password until security is added

    @Column(nullable = false, name = "business_name")
    private String businessName;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "stalls_reserved_count", columnDefinition = "INT default 0")
    private Integer stallsReservedCount;
}