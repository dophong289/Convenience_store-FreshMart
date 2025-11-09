package com.freshmart.backend.repository;

import com.freshmart.backend.model.SupplierOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierOrderRepository extends JpaRepository<SupplierOrder, Long> {
    boolean existsByOrderNumber(String orderNumber);
}
