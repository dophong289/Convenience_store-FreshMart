package com.freshmart.backend.service;

import com.freshmart.backend.dto.ProductDetailDto;
import com.freshmart.backend.dto.ProductDetailDto.CategorySummaryDto;
import com.freshmart.backend.dto.ProductUpdateRequest;
import com.freshmart.backend.exception.BadRequestException;
import com.freshmart.backend.exception.ResourceNotFoundException;
import com.freshmart.backend.model.Category;
import com.freshmart.backend.model.Product;
import com.freshmart.backend.model.ProductStatus;
import com.freshmart.backend.repository.CategoryRepository;
import com.freshmart.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Page<ProductDetailDto> getProductsWithFilters(
            String category,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String origin,
            String brand,
            Boolean inStock,
            String sortBy,
            String sortOrder,
            int page,
            int size
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> productPage = productRepository.findWithFilters(
                category, search, minPrice, maxPrice, origin, brand, inStock, pageable
        );

        return productPage.map(this::mapToProductDetailDto);
    }
    
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductDetail(Long id) {
        Product product = getProductById(id);
        return mapToProductDetailDto(product);
    }
    
    @Transactional(readOnly = true)
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
    }
    
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(String categorySlug) {
        return productRepository.findByCategorySlugOrderBySoldDesc(categorySlug);
    }
    
    @Transactional(readOnly = true)
    public List<Product> getFlashSaleProducts() {
        return productRepository.findByIsFlashSaleTrueAndFlashSaleEndAfterOrderBySoldDesc(LocalDateTime.now());
    }
    
    @Transactional(readOnly = true)
    public List<Product> getBestSellingProducts() {
        return productRepository.findTop8ByOrderBySoldDesc();
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllOrigins() {
        return productRepository.findAllOrigins();
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllBrands() {
        return productRepository.findAllBrands();
    }
    
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    @Transactional
    public ProductDetailDto updateProduct(Long id, ProductUpdateRequest request, String updatedBy) {
        Product product = getProductById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        validateBusinessRules(request);

        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setImage(request.getImage());
        product.setImages(CollectionUtils.isEmpty(request.getImages()) ? new ArrayList<>() : new ArrayList<>(request.getImages()));
        product.setCategory(category);
        product.setCategorySlug(request.getCategorySlug());
        product.setBrand(request.getBrand());
        product.setOrigin(request.getOrigin());
        product.setStock(request.getStock());
        product.setStatus(request.getStatus());
        product.setTags(CollectionUtils.isEmpty(request.getTags()) ? new ArrayList<>() : new ArrayList<>(request.getTags()));
        product.setPromotions(CollectionUtils.isEmpty(request.getPromotions()) ? new ArrayList<>() : new ArrayList<>(request.getPromotions()));
        product.setIngredients(request.getIngredients());
        product.setExpiry(request.getExpiry());
        product.setIsFlashSale(request.getIsFlashSale());
        product.setFlashSaleDiscount(Boolean.TRUE.equals(request.getIsFlashSale()) ? request.getFlashSaleDiscount() : null);
        product.setUpdatedBy(updatedBy);

        if (request.getSold() != null) {
            product.setSold(request.getSold());
        }

        if (request.getRating() != null) {
            product.setRating(request.getRating());
        }

        if (request.getReviewCount() != null) {
            product.setReviewCount(request.getReviewCount());
        }

        Product saved = productRepository.save(product);
        return mapToProductDetailDto(saved);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    @Transactional
    public void updateProductStock(Long productId, Integer quantity) {
        Product product = getProductById(productId);
        product.setStock(product.getStock() - quantity);
        product.setSold(product.getSold() + quantity);
        productRepository.save(product);
    }

    private void validateBusinessRules(ProductUpdateRequest request) {
        if (Boolean.TRUE.equals(request.getIsFlashSale()) && request.getFlashSaleDiscount() == null) {
            throw new BadRequestException("Flash sale discount is required when flash sale is enabled");
        }

        if (Boolean.FALSE.equals(request.getIsFlashSale())) {
            request.setFlashSaleDiscount(null);
        }

        if (request.getStock() == 0 && request.getStatus() == ProductStatus.IN_STOCK) {
            throw new BadRequestException("Cannot set status IN_STOCK while stock is zero");
        }

        if (request.getStock() > 0 && request.getStatus() == ProductStatus.OUT_OF_STOCK) {
            throw new BadRequestException("Cannot mark product as OUT_OF_STOCK while stock is greater than zero");
        }
    }

    private ProductDetailDto mapToProductDetailDto(Product product) {
        return ProductDetailDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .image(product.getImage())
                .images(product.getImages() == null ? List.of() : product.getImages())
                .category(CategorySummaryDto.builder()
                        .id(product.getCategory().getId())
                        .name(product.getCategory().getName())
                        .slug(product.getCategory().getSlug())
                        .icon(product.getCategory().getIcon())
                        .image(product.getCategory().getImage())
                        .productCount(product.getCategory().getProductCount() == null ? 0 : product.getCategory().getProductCount())
                        .build())
                .categorySlug(product.getCategorySlug())
                .brand(product.getBrand())
                .origin(product.getOrigin())
                .stock(product.getStock())
                .sold(product.getSold())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .status(product.getStatus())
                .isFlashSale(product.getIsFlashSale())
                .flashSaleDiscount(product.getFlashSaleDiscount())
                .tags(product.getTags() == null ? List.of() : product.getTags())
                .promotions(product.getPromotions() == null ? List.of() : product.getPromotions())
                .ingredients(product.getIngredients())
                .expiry(product.getExpiry())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .updatedBy(product.getUpdatedBy())
                .build();
    }
}

