package com.freshmart.backend.repository;

import com.freshmart.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySlug(String slug);
    
    List<Product> findByCategorySlugOrderBySoldDesc(String categorySlug);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.categorySlug = :category) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:origin IS NULL OR p.origin = :origin) AND " +
           "(:brand IS NULL OR p.brand = :brand) AND " +
           "(:inStock IS NULL OR :inStock = false OR p.stock > 0)")
    Page<Product> findWithFilters(
            @Param("category") String category,
            @Param("search") String search,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("origin") String origin,
            @Param("brand") String brand,
            @Param("inStock") Boolean inStock,
            Pageable pageable
    );
    
    List<Product> findByIsFlashSaleTrueAndFlashSaleEndAfterOrderBySoldDesc(LocalDateTime now);
    
    List<Product> findTop8ByOrderBySoldDesc();
    
    @Query("SELECT DISTINCT p.origin FROM Product p WHERE p.origin IS NOT NULL")
    List<String> findAllOrigins();
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL")
    List<String> findAllBrands();
}

