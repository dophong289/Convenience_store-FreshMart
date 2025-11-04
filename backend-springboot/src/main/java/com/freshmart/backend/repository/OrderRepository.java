package com.freshmart.backend.repository;

import com.freshmart.backend.model.Order;
import com.freshmart.backend.model.Order.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<Order> findOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}

