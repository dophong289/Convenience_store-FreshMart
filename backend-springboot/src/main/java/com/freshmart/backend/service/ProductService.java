package com.freshmart.backend.service;

import com.freshmart.backend.exception.ResourceNotFoundException;
import com.freshmart.backend.model.Product;
import com.freshmart.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Page<Product> getProductsWithFilters(
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
        
        return productRepository.findWithFilters(
                category, search, minPrice, maxPrice, origin, brand, inStock, pageable
        );
    }
    
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
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
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setName(productDetails.getName());
        product.setSlug(productDetails.getSlug());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setOriginalPrice(productDetails.getOriginalPrice());
        product.setImage(productDetails.getImage());
        product.setImages(productDetails.getImages());
        product.setCategory(productDetails.getCategory());
        product.setCategorySlug(productDetails.getCategorySlug());
        product.setBrand(productDetails.getBrand());
        product.setOrigin(productDetails.getOrigin());
        product.setStock(productDetails.getStock());
        product.setWeights(productDetails.getWeights());
        product.setTags(productDetails.getTags());
        product.setIngredients(productDetails.getIngredients());
        product.setExpiry(productDetails.getExpiry());
        product.setPromotions(productDetails.getPromotions());
        
        return productRepository.save(product);
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
}

