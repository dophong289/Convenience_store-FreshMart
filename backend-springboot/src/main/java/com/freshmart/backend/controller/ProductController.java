package com.freshmart.backend.controller;

import com.freshmart.backend.model.Product;
import com.freshmart.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "sold") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<Product> productPage = productService.getProductsWithFilters(
                category, search, minPrice, maxPrice, origin, brand, inStock,
                sortBy, sortOrder, page, size
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalPages", productPage.getTotalPages());
        response.put("totalItems", productPage.getTotalElements());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getProductBySlug(@PathVariable String slug) {
        Product product = productService.getProductBySlug(slug);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", product);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/category/{categorySlug}")
    public ResponseEntity<Map<String, Object>> getProductsByCategory(@PathVariable String categorySlug) {
        List<Product> products = productService.getProductsByCategory(categorySlug);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/flash-sale")
    public ResponseEntity<Map<String, Object>> getFlashSaleProducts() {
        List<Product> products = productService.getFlashSaleProducts();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/best-selling")
    public ResponseEntity<Map<String, Object>> getBestSellingProducts() {
        List<Product> products = productService.getBestSellingProducts();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", products);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/filters/origins")
    public ResponseEntity<Map<String, Object>> getAllOrigins() {
        List<String> origins = productService.getAllOrigins();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", origins);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/filters/brands")
    public ResponseEntity<Map<String, Object>> getAllBrands() {
        List<String> brands = productService.getAllBrands();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", brands);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product created successfully");
        response.put("data", createdProduct);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {
        Product updatedProduct = productService.updateProduct(id, product);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product updated successfully");
        response.put("data", updatedProduct);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}

