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
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String slug;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(nullable = false)
    private String image;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(name = "category_slug")
    private String categorySlug;
    
    private String brand;
    
    private String origin;
    
    @Column(nullable = false)
    private Integer stock = 0;
    
    @Column(nullable = false)
    private Integer sold = 0;
    
    @Column(nullable = false)
    private Double rating = 0.0;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_weights", joinColumns = @JoinColumn(name = "product_id"))
    private List<ProductWeight> weights = new ArrayList<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @Column(name = "is_flash_sale")
    private Boolean isFlashSale = false;
    
    @Column(name = "flash_sale_discount")
    private Integer flashSaleDiscount;
    
    @Column(name = "flash_sale_end")
    private LocalDateTime flashSaleEnd;
    
    @Column(columnDefinition = "TEXT")
    private String ingredients;
    
    private String expiry;
    
    @ElementCollection
    @CollectionTable(name = "product_promotions", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "promotion")
    private List<String> promotions = new ArrayList<>();
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductWeight {
        private String value;
        
        @Column(precision = 10, scale = 2)
        private BigDecimal price;
    }
}

