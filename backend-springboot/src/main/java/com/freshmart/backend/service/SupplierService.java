package com.freshmart.backend.service;

import com.freshmart.backend.dto.CreateSupplierRequest;
import com.freshmart.backend.dto.SupplierDto;
import com.freshmart.backend.exception.BadRequestException;
import com.freshmart.backend.exception.ResourceNotFoundException;
import com.freshmart.backend.model.Supplier;
import com.freshmart.backend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<SupplierDto> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupplierDto createSupplier(CreateSupplierRequest request) {
        supplierRepository.findByNameIgnoreCase(request.getName())
                .ifPresent(existing -> {
                    throw new BadRequestException("Supplier with name already exists");
                });

        Supplier supplier = new Supplier();
        supplier.setName(request.getName());
        supplier.setContactName(request.getContactName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());

        Supplier saved = supplierRepository.save(supplier);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }

    private SupplierDto mapToDto(Supplier supplier) {
        return SupplierDto.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactName(supplier.getContactName())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .build();
    }
}
