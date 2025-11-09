package com.freshmart.backend.controller;

import com.freshmart.backend.dto.CreateSupplierRequest;
import com.freshmart.backend.dto.SupplierDto;
import com.freshmart.backend.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSuppliers() {
        List<SupplierDto> suppliers = supplierService.getAllSuppliers();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", suppliers);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createSupplier(@Valid @RequestBody CreateSupplierRequest request) {
        SupplierDto supplier = supplierService.createSupplier(request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Supplier created successfully");
        response.put("data", supplier);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
