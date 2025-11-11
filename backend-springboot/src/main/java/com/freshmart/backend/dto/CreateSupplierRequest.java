package com.freshmart.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSupplierRequest {
    @NotBlank(message = "Supplier name is required")
    private String name;

    private String contactName;

    @Email(message = "Email is invalid")
    private String email;

    private String phone;

    private String address;
}
