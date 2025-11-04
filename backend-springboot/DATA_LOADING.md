# 📦 Data Loading - FreshMart Backend

## ✅ Cách hoạt động:

Backend sử dụng **DataLoader** class để tự động load sample data khi khởi động.

### 🔄 Auto-loading Process:

1. **Khi backend khởi động lần đầu**:
   - Hibernate tạo tất cả tables (categories, products, users, orders...)
   - `DataLoader.java` kiểm tra database có rỗng không
   - Nếu rỗng → Tự động insert sample data
   - Console sẽ hiện: `✅ Sample data loaded successfully!`

2. **Khi backend chạy lần sau**:
   - Database đã có data
   - DataLoader bỏ qua việc insert
   - Console sẽ hiện: `📦 Database already has data, skipping sample data loading.`

---

## 📊 Sample Data bao gồm:

### Categories (8 danh mục):
- Trái cây
- Rau củ quả
- Thịt tươi sống
- Hải sản
- Sữa & Trứng
- Bánh mì & Bánh ngọt
- Đồ uống
- Snack & Kẹo

### Products (10 sản phẩm):
- 3 Trái cây (Táo Fuji, Cam Sành, Dâu Tây)
- 2 Rau củ (Rau cải, Cà chua bi)
- 2 Thịt (Ba chỉ heo, Ức gà)
- 1 Hải sản (Tôm sú)
- 2 Sữa & Trứng (Sữa Vinamilk, Trứng gà)

**Có 4 sản phẩm Flash Sale** đã được thiết lập!

---

## 🔧 Custom Data Loading:

### Nếu muốn thêm data mới:

Mở: `src/main/java/com/freshmart/backend/config/DataLoader.java`

```java
// Thêm category mới
createCategory("Tên mới", "ten-moi", "🎁", "https://image-url.jpg")

// Thêm product mới
createProduct(
    "Tên sản phẩm", "slug",
    "Mô tả",
    price, originalPrice, "image-url",
    category, "Brand", "Origin",
    stock, sold, rating, reviewCount,
    isFlashSale, discount, flashSaleEnd,
    "ingredients", "expiry"
)
```

### Nếu muốn reset database:

```sql
-- Xóa tất cả data
DROP DATABASE freshmart;
CREATE DATABASE freshmart;

-- Chạy lại backend → Data sẽ tự động load
```

Hoặc đổi trong `application.properties`:
```properties
# Thay đổi từ 'update' sang 'create-drop'
spring.jpa.hibernate.ddl-auto=create-drop
```
⚠️ **Warning**: `create-drop` sẽ XÓA data mỗi lần restart!

---

## 🎯 Advantages của DataLoader:

✅ **Type-safe**: Không lo lỗi SQL syntax  
✅ **Auto relationships**: Category-Product tự động link  
✅ **Conditional**: Chỉ load khi database rỗng  
✅ **Programmatic**: Dễ customize với Java code  
✅ **Error handling**: Lỗi sẽ hiện rõ ràng trong console  

---

## 📝 Old Method (data.sql):

File `data.sql` đã được rename thành `data.sql.backup`

**Tại sao không dùng data.sql?**
- ❌ Lỗi syntax với emojis
- ❌ Khó quản lý relationships
- ❌ Không có conditional loading
- ❌ Hard-coded IDs có thể conflict

**DataLoader class tốt hơn vì:**
- ✅ Type-safe với Java
- ✅ Auto-generated IDs
- ✅ Easy to maintain
- ✅ Better error handling

---

## 🐛 Troubleshooting:

### Data không load:
1. Check console log: `✅ Sample data loaded successfully!`
2. Nếu thấy "already has data" → Database đã có data rồi
3. Xóa database và tạo lại nếu muốn reset

### Lỗi khi load:
1. Check console error messages
2. Verify `application.properties` đúng
3. Ensure MySQL đang chạy
4. Check connection string

### Muốn disable auto-loading:
Comment out `@Component` annotation:
```java
// @Component  // Disable this
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    ...
}
```

---

## 🔍 Verify Data:

### Qua MySQL:
```sql
USE freshmart;

-- Check categories
SELECT * FROM categories;

-- Check products
SELECT * FROM products;

-- Check flash sale
SELECT name, is_flash_sale, flash_sale_discount 
FROM products 
WHERE is_flash_sale = true;
```

### Qua API:
```bash
# Get all categories
curl http://localhost:8080/api/categories

# Get all products
curl http://localhost:8080/api/products

# Get flash sale
curl http://localhost:8080/api/products/flash-sale
```

---

**✅ Data loading tự động hoạt động khi backend khởi động!**

