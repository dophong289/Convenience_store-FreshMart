package com.freshmart.backend.dto;

import com.freshmart.backend.model.ProductStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductUpdateRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must be less than 255 characters")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(max = 255, message = "Slug must be less than 255 characters")
    private String slug;

    @Size(max = 5000, message = "Description must be less than 5000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = false, message = "Original price must be greater than 0")
    private BigDecimal originalPrice;

    @NotBlank(message = "Image URL is required")
    private String image;

    private List<@NotBlank String> images;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Category slug is required")
    private String categorySlug;

    @Size(max = 255)
    private String brand;

    @Size(max = 255)
    private String origin;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @Min(value = 0, message = "Sold count cannot be negative")
    private Integer sold;

    @NotNull(message = "Status is required")
    private ProductStatus status;

    @NotNull(message = "Flash sale flag is required")
    private Boolean isFlashSale;

    @Min(value = 0, message = "Flash sale discount must be positive")
    @Max(value = 100, message = "Flash sale discount cannot exceed 100")
    private Integer flashSaleDiscount;

    private List<String> tags;

    private List<String> promotions;

    private String ingredients;

    private String expiry;

    @DecimalMin(value = "0.0", message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", message = "Rating cannot be greater than 5")
    private Double rating;

    @Min(value = 0, message = "Review count cannot be negative")
    private Integer reviewCount;
}
