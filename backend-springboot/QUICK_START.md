# ⚡ Quick Start - Backend Spring Boot

## 🎯 Chạy nhanh trong 3 bước:

### 1. Tạo Database
```sql
CREATE DATABASE freshmart;
```

### 2. Chỉnh application.properties
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Run
```bash
mvn spring-boot:run
```

✅ **Done!** Backend chạy tại: http://localhost:8080

---

## 🧪 Test ngay:

```bash
# Get products
curl http://localhost:8080/api/products

# Get categories
curl http://localhost:8080/api/categories

# Get flash sale
curl http://localhost:8080/api/products/flash-sale
```

---

## 📚 Chi tiết đầy đủ:
- Xem [START_GUIDE.md](START_GUIDE.md) - Hướng dẫn chi tiết
- Xem [README.md](README.md) - Thông tin project

## 🔥 Các API chính:

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/products` | GET | Danh sách sản phẩm |
| `/api/products/{slug}` | GET | Chi tiết sản phẩm |
| `/api/categories` | GET | Danh sách danh mục |
| `/api/orders` | POST | Tạo đơn hàng |
| `/api/users` | POST | Tạo user |

## 🛠️ Tools cần thiết:
- ☕ Java 17+
- 🔨 Maven
- 🐬 MySQL
- 💻 IntelliJ IDEA (recommended)

---

**Có vấn đề?** → Xem [START_GUIDE.md - Troubleshooting](START_GUIDE.md#-troubleshooting)

