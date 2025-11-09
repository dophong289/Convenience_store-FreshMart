package com.freshmart.backend.dto;

import com.freshmart.backend.model.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String image;
    private List<String> images;
    private CategorySummaryDto category;
    private String categorySlug;
    private String brand;
    private String origin;
    private Integer stock;
    private Integer sold;
    private Double rating;
    private Integer reviewCount;
    private ProductStatus status;
    private Boolean isFlashSale;
    private Integer flashSaleDiscount;
    private List<String> tags;
    private List<String> promotions;
    private String ingredients;
    private String expiry;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySummaryDto {
        private Long id;
        private String name;
        private String slug;
    }
}
