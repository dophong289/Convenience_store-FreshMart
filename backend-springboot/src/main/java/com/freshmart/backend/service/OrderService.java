package com.freshmart.backend.service;

import com.freshmart.backend.exception.ResourceNotFoundException;
import com.freshmart.backend.model.Order;
import com.freshmart.backend.model.Order.OrderStatus;
import com.freshmart.backend.model.OrderItem;
import com.freshmart.backend.model.Product;
import com.freshmart.backend.model.User;
import com.freshmart.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final UserService userService;
    
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    @Transactional(readOnly = true)
    public Page<Order> getUserOrdersPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    @Transactional
    public Order createOrder(Order order, Long userId) {
        User user = userService.getUserById(userId);
        order.setUser(user);
        
        // Calculate totals
        BigDecimal itemsTotal = BigDecimal.ZERO;
        
        for (OrderItem item : order.getItems()) {
            Product product = productService.getProductById(item.getProduct().getId());
            item.setProduct(product);
            item.setOrder(order);
            
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            itemsTotal = itemsTotal.add(itemTotal);
            
            // Update product stock
            productService.updateProductStock(product.getId(), item.getQuantity());
        }
        
        order.setTotal(itemsTotal);
        order.setFinalTotal(itemsTotal.add(order.getShippingFee()).subtract(order.getDiscount()));
        
        // Set estimated delivery based on delivery option
        LocalDateTime estimatedDelivery = switch (order.getDeliveryOption()) {
            case EXPRESS_2H -> LocalDateTime.now().plusHours(2);
            case SAME_DAY -> LocalDateTime.now().withHour(23).withMinute(59);
            case SCHEDULED -> LocalDateTime.now().plusDays(1);
        };
        order.setEstimatedDelivery(estimatedDelivery);
        
        return orderRepository.save(order);
    }
    
    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    @Transactional
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.CONFIRMED) {
            order.setStatus(OrderStatus.CANCELLED);
            
            // Restore product stock
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                product.setSold(product.getSold() - item.getQuantity());
            }
            
            orderRepository.save(order);
        } else {
            throw new IllegalStateException("Cannot cancel order in status: " + order.getStatus());
        }
    }
    
    @Transactional(readOnly = true)
    public Long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }
}

