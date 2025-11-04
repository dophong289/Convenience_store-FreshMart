package com.freshmart.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @Column(name = "shipping_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingFee;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;
    
    @Column(name = "final_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalTotal;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Embedded
    private ShippingAddress shippingAddress;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @Column(columnDefinition = "TEXT")
    private String note;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_option", nullable = false)
    private DeliveryOption deliveryOption;
    
    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
    }
    
    public enum PaymentMethod {
        COD, QR, EWALLET
    }
    
    public enum DeliveryOption {
        EXPRESS_2H, SAME_DAY, SCHEDULED
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingAddress {
        private String name;
        private String phone;
        private String address;
        private String ward;
        private String district;
        private String city;
    }
}

