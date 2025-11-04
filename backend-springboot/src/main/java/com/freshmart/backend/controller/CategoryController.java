package com.freshmart.backend.controller;

import com.freshmart.backend.model.Category;
import com.freshmart.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", categories);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getCategoryBySlug(@PathVariable String slug) {
        Category category = categoryService.getCategoryBySlug(slug);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", category);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCategory(@RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Category created successfully");
        response.put("data", createdCategory);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category
    ) {
        Category updatedCategory = categoryService.updateCategory(id, category);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Category updated successfully");
        response.put("data", updatedCategory);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Category deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}

