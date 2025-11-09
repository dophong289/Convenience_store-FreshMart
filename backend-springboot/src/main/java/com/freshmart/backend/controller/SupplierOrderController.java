package com.freshmart.backend.controller;

import com.freshmart.backend.dto.SupplierOrderCreateRequest;
import com.freshmart.backend.dto.SupplierOrderResponse;
import com.freshmart.backend.service.SupplierOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/supplier-orders")
@RequiredArgsConstructor
public class SupplierOrderController {

    private final SupplierOrderService supplierOrderService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createSupplierOrder(
            @Valid @RequestBody SupplierOrderCreateRequest request
    ) {
        SupplierOrderResponse order = supplierOrderService.createSupplierOrder(request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Supplier order created successfully");
        response.put("data", order);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSupplierOrders() {
        List<SupplierOrderResponse> orders = supplierOrderService.getAllOrders();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", orders);
        return ResponseEntity.ok(response);
    }
}
