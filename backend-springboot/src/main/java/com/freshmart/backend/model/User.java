package com.freshmart.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false, unique = true)
    private String phone;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private Integer points = 0;
    
    @Column(name = "membership_tier")
    @Enumerated(EnumType.STRING)
    private MembershipTier membershipTier = MembershipTier.BRONZE;
    
    @ElementCollection
    @CollectionTable(name = "user_addresses", joinColumns = @JoinColumn(name = "user_id"))
    private List<Address> addresses = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "user_wishlist", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "product_id")
    private List<Long> wishlist = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.CUSTOMER;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum MembershipTier {
        BRONZE, SILVER, GOLD, PLATINUM
    }
    
    public enum Role {
        CUSTOMER, ADMIN
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        private String name;
        private String phone;
        private String address;
        private String ward;
        private String district;
        private String city;
        
        @Column(name = "is_default")
        private Boolean isDefault = false;
    }
}

