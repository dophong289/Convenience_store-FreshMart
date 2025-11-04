package com.freshmart.backend.config;

import com.freshmart.backend.model.Category;
import com.freshmart.backend.model.Product;
import com.freshmart.backend.repository.CategoryRepository;
import com.freshmart.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only load data if database is empty
        if (categoryRepository.count() == 0) {
            loadCategories();
            loadProducts();
            System.out.println("✅ Sample data loaded successfully!");
        } else {
            System.out.println("📦 Database already has data, skipping sample data loading.");
        }
    }
    
    private void loadCategories() {
        Category[] categories = {
            createCategory("Trái cây", "trai-cay", "🍎", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400"),
            createCategory("Rau củ quả", "rau-cu-qua", "🥬", "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"),
            createCategory("Thịt tươi sống", "thit-tuoi-song", "🥩", "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400"),
            createCategory("Hải sản", "hai-san", "🦐", "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400"),
            createCategory("Sữa & Trứng", "sua-trung", "🥛", "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"),
            createCategory("Bánh mì & Bánh ngọt", "banh-mi-banh-ngot", "🍞", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"),
            createCategory("Đồ uống", "do-uong", "🥤", "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400"),
            createCategory("Snack & Kẹo", "snack-keo", "🍪", "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400")
        };
        
        categoryRepository.saveAll(Arrays.asList(categories));
    }
    
    private void loadProducts() {
        Category traiCay = categoryRepository.findBySlug("trai-cay").orElseThrow();
        Category rauCu = categoryRepository.findBySlug("rau-cu-qua").orElseThrow();
        Category thit = categoryRepository.findBySlug("thit-tuoi-song").orElseThrow();
        Category haiSan = categoryRepository.findBySlug("hai-san").orElseThrow();
        Category suaTrung = categoryRepository.findBySlug("sua-trung").orElseThrow();
        
        Product[] products = {
            // Trái cây
            createProduct("Táo Fuji Nhật Bản", "tao-fuji-nhat-ban", 
                "Táo Fuji Nhật Bản nhập khẩu, giòn ngọt", 
                89000, 110000, "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400",
                traiCay, "FreshMart", "Nhật Bản", 100, 234, 4.8, 89,
                true, 19, LocalDateTime.now().plusHours(6), "Táo Fuji", "7 ngày"),
                
            createProduct("Cam Sành Cao Phong", "cam-sanh-cao-phong",
                "Cam sành Cao Phong ngọt, nhiều nước",
                45000, 55000, "https://images.unsplash.com/photo-1547514701-42782101795e?w=400",
                traiCay, "Organic Farm", "Việt Nam", 150, 567, 4.9, 234,
                false, null, null, "Cam sành", "5 ngày"),
                
            createProduct("Dâu Tây Đà Lạt", "dau-tay-da-lat",
                "Dâu tây Đà Lạt tươi ngon, ngọt tự nhiên",
                125000, 145000, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400",
                traiCay, "Đà Lạt Farm", "Việt Nam", 80, 345, 4.7, 156,
                true, 14, LocalDateTime.now().plusHours(4), "Dâu tây", "3 ngày"),
            
            // Rau củ
            createProduct("Rau Cải Xanh Hữu Cơ", "rau-cai-xanh-huu-co",
                "Rau cải xanh hữu cơ, không hóa chất",
                15000, 20000, "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400",
                rauCu, "Organic Farm", "Việt Nam", 200, 678, 4.6, 234,
                false, null, null, "Rau cải xanh", "2 ngày"),
                
            createProduct("Cà Chua Bi", "ca-chua-bi",
                "Cà chua bi ngọt, giàu vitamin",
                28000, 35000, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
                rauCu, "Đà Lạt Farm", "Việt Nam", 120, 456, 4.5, 189,
                false, null, null, "Cà chua bi", "4 ngày"),
            
            // Thịt
            createProduct("Thịt Ba Chỉ Heo", "thit-ba-chi-heo",
                "Thịt ba chỉ heo tươi ngon, thái sẵn",
                89000, 99000, "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400",
                thit, "C.P.", "Việt Nam", 50, 234, 4.7, 123,
                false, null, null, "Thịt heo", "1 ngày"),
                
            createProduct("Ức Gà Phi Lê", "uc-ga-phi-le",
                "Ức gà phi lê, ít béo, giàu protein",
                65000, 75000, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
                thit, "C.P.", "Việt Nam", 75, 345, 4.8, 167,
                true, 13, LocalDateTime.now().plusHours(3), "Thịt gà", "1 ngày"),
            
            // Hải sản
            createProduct("Tôm Sú Tươi", "tom-su-tuoi",
                "Tôm sú tươi sống, to béo",
                189000, 220000, "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400",
                haiSan, "Biển Việt", "Việt Nam", 40, 189, 4.9, 98,
                false, null, null, "Tôm sú", "Ngày mua"),
            
            // Sữa & Trứng
            createProduct("Sữa Tươi Vinamilk", "sua-tuoi-vinamilk",
                "Sữa tươi tiệt trùng Vinamilk 100%",
                35000, 38000, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
                suaTrung, "Vinamilk", "Việt Nam", 200, 890, 4.8, 456,
                false, null, null, "Sữa bò tươi 100%", "7 ngày"),
                
            createProduct("Trứng Gà Omega 3", "trung-ga-omega-3",
                "Trứng gà omega 3, giàu dinh dưỡng",
                45000, 50000, "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400",
                suaTrung, "Ba Huân", "Việt Nam", 150, 567, 4.7, 234,
                true, 10, LocalDateTime.now().plusHours(5), "Trứng gà", "10 ngày")
        };
        
        productRepository.saveAll(Arrays.asList(products));
        
        // Update category product counts
        updateCategoryProductCounts();
    }
    
    private Category createCategory(String name, String slug, String icon, String image) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setIcon(icon);
        category.setImage(image);
        category.setProductCount(0);
        return category;
    }
    
    private Product createProduct(String name, String slug, String description,
                                 double price, double originalPrice, String image,
                                 Category category, String brand, String origin,
                                 int stock, int sold, double rating, int reviewCount,
                                 boolean isFlashSale, Integer flashSaleDiscount, 
                                 LocalDateTime flashSaleEnd, String ingredients, String expiry) {
        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setOriginalPrice(BigDecimal.valueOf(originalPrice));
        product.setImage(image);
        product.setCategory(category);
        product.setCategorySlug(category.getSlug());
        product.setBrand(brand);
        product.setOrigin(origin);
        product.setStock(stock);
        product.setSold(sold);
        product.setRating(rating);
        product.setReviewCount(reviewCount);
        product.setIsFlashSale(isFlashSale);
        product.setFlashSaleDiscount(flashSaleDiscount);
        product.setFlashSaleEnd(flashSaleEnd);
        product.setIngredients(ingredients);
        product.setExpiry(expiry);
        return product;
    }
    
    private void updateCategoryProductCounts() {
        categoryRepository.findAll().forEach(category -> {
            long count = productRepository.findByCategorySlugOrderBySoldDesc(category.getSlug()).size();
            category.setProductCount((int) count);
            categoryRepository.save(category);
        });
    }
}

