package com.freshmart.backend.controller;

import com.freshmart.backend.model.Order;
import com.freshmart.backend.model.Order.OrderStatus;
import com.freshmart.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", orders);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", order);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Order> orderPage = orderService.getUserOrdersPaginated(userId, page, size);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", orderPage.getContent());
        response.put("currentPage", orderPage.getNumber());
        response.put("totalPages", orderPage.getTotalPages());
        response.put("totalItems", orderPage.getTotalElements());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", orders);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody Order order,
            @RequestParam Long userId
    ) {
        Order createdOrder = orderService.createOrder(order, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order created successfully");
        response.put("data", createdOrder);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order status updated successfully");
        response.put("data", updatedOrder);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order cancelled successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats/count")
    public ResponseEntity<Map<String, Object>> getOrderStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pending", orderService.countOrdersByStatus(OrderStatus.PENDING));
        stats.put("confirmed", orderService.countOrdersByStatus(OrderStatus.CONFIRMED));
        stats.put("shipping", orderService.countOrdersByStatus(OrderStatus.SHIPPING));
        stats.put("delivered", orderService.countOrdersByStatus(OrderStatus.DELIVERED));
        stats.put("cancelled", orderService.countOrdersByStatus(OrderStatus.CANCELLED));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", stats);
        
        return ResponseEntity.ok(response);
    }
}

