package com.freshmart.backend.controller;

import com.freshmart.backend.model.User;
import com.freshmart.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", users);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", user);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User created successfully");
        response.put("data", createdUser);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ) {
        User updatedUser = userService.updateUser(id, user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User updated successfully");
        response.put("data", updatedUser);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{userId}/wishlist/{productId}")
    public ResponseEntity<Map<String, Object>> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId
    ) {
        User user = userService.addToWishlist(userId, productId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product added to wishlist");
        response.put("data", user);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{userId}/wishlist/{productId}")
    public ResponseEntity<Map<String, Object>> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId
    ) {
        User user = userService.removeFromWishlist(userId, productId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product removed from wishlist");
        response.put("data", user);
        
        return ResponseEntity.ok(response);
    }
}

