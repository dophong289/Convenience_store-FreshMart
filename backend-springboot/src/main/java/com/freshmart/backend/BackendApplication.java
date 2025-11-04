package com.freshmart.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("\n🚀 FreshMart Backend API is running!");
        System.out.println("📡 API available at: http://localhost:8080/api");
        System.out.println("📚 Swagger UI: http://localhost:8080/swagger-ui.html\n");
    }

}

