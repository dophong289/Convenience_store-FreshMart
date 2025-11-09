package com.freshmart.backend.service;

import com.freshmart.backend.dto.SupplierOrderCreateRequest;
import com.freshmart.backend.dto.SupplierOrderItemRequest;
import com.freshmart.backend.dto.SupplierOrderResponse;
import com.freshmart.backend.dto.SupplierDto;
import com.freshmart.backend.exception.BadRequestException;
import com.freshmart.backend.model.Product;
import com.freshmart.backend.model.Supplier;
import com.freshmart.backend.model.SupplierOrder;
import com.freshmart.backend.model.SupplierOrderItem;
import com.freshmart.backend.repository.ProductRepository;
import com.freshmart.backend.repository.SupplierOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierOrderService {

    private final SupplierOrderRepository supplierOrderRepository;
    private final SupplierService supplierService;
    private final ProductRepository productRepository;

    @Transactional
    public SupplierOrderResponse createSupplierOrder(SupplierOrderCreateRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must include at least one product");
        }

        Supplier supplier = supplierService.getSupplierById(request.getSupplierId());

        SupplierOrder supplierOrder = new SupplierOrder();
        supplierOrder.setOrderDate(request.getOrderDate());
        supplierOrder.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        supplierOrder.setSupplier(supplier);
        supplierOrder.setNotes(request.getNotes());
        supplierOrder.setOrderNumber(generateOrderNumber(request));

        BigDecimal total = BigDecimal.ZERO;

        for (SupplierOrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new BadRequestException("Product not found with id: " + itemRequest.getProductId()));

            BigDecimal unitPrice = itemRequest.getUnitPrice();
            if (unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Unit price must be greater than 0");
            }

            SupplierOrderItem item = new SupplierOrderItem();
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(unitPrice);
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            item.setTotalPrice(itemTotal);

            supplierOrder.addItem(item);
            total = total.add(itemTotal);
        }

        supplierOrder.setTotalAmount(total);

        SupplierOrder saved = supplierOrderRepository.save(supplierOrder);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SupplierOrderResponse> getAllOrders() {
        return supplierOrderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SupplierOrderResponse mapToResponse(SupplierOrder order) {
        order.getItems().size(); // ensure items are initialized

        return SupplierOrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getOrderDate())
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .notes(order.getNotes())
                .supplier(mapSupplier(order.getSupplier()))
                .items(order.getItems().stream()
                        .map(item -> SupplierOrderResponse.Item.builder()
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .totalPrice(item.getTotalPrice())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private SupplierDto mapSupplier(Supplier supplier) {
        return SupplierDto.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactName(supplier.getContactName())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .build();
    }

    private String generateOrderNumber(SupplierOrderCreateRequest request) {
        String datePart = request.getOrderDate() != null
                ? request.getOrderDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                : DateTimeFormatter.ofPattern("yyyyMMdd").format(java.time.LocalDate.now());
        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "PO-" + datePart + "-" + randomPart;
    }
}
