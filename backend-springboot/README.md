# 🚀 FreshMart Backend - Spring Boot

Backend API hoàn chỉnh cho website cửa hàng tiện lợi FreshMart.

## ✅ Đã tạo xong:

### 📦 Models (Entities)
- ✅ Product - Sản phẩm
- ✅ Category - Danh mục
- ✅ User - Người dùng  
- ✅ Order - Đơn hàng
- ✅ OrderItem - Chi tiết đơn

### 🗄️ Repositories
- ✅ ProductRepository - với filters, search
- ✅ CategoryRepository
- ✅ UserRepository
- ✅ OrderRepository

### ⚙️ Configuration
- ✅ SecurityConfig - Spring Security
- ✅ CorsConfig - CORS cho React
- ✅ GlobalExceptionHandler
- ✅ application.properties

### ⚙️ Services
- ✅ ProductService - Business logic đầy đủ
- ✅ CategoryService
- ✅ UserService - Password encryption, wishlist
- ✅ OrderService - Create order, update status

### 🎮 Controllers (30+ API endpoints)
- ✅ ProductController - 11 endpoints
- ✅ CategoryController - 5 endpoints
- ✅ OrderController - 8 endpoints
- ✅ UserController - 6 endpoints

### 📦 Data Loading
- ✅ DataLoader - Tự động load sample data
- ✅ 8 Categories + 10 Products
- ✅ 4 Flash Sale products

👉 **Xem**: [DATA_LOADING.md](DATA_LOADING.md) - Chi tiết về auto-loading

## 🏃 Cách chạy:

### 1. Setup Database:
```sql
CREATE DATABASE freshmart;
```

### 2. Chỉnh sửa application.properties:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 3. Build & Run:
```bash
cd backend-springboot
mvn clean install
mvn spring-boot:run
```

Hoặc dùng IDE (IntelliJ IDEA):
- Open project → Run `BackendApplication.java`

### 4. Test API:
```bash
# Test health
curl http://localhost:8080/api

# Get products (sau khi tạo controller)
curl http://localhost:8080/api/products
```

## 📡 API Endpoints (Sẽ có sau khi tạo Controllers):

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/{slug}` - Chi tiết
- `GET /api/products/flash-sale` - Flash sale
- `POST /api/products` - Tạo mới (Admin)

### Categories
- `GET /api/categories` - Tất cả danh mục
- `GET /api/categories/{slug}` - Chi tiết

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/user/{userId}` - Đơn của user
- `PATCH /api/orders/{id}/status` - Cập nhật trạng thái

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/login-otp` - Đăng nhập OTP

## 📝 Project Status:

1. ✅ Models & Repositories - **DONE**
2. ✅ Config & Exception - **DONE**
3. ✅ Services - **DONE** (4 services)
4. ✅ Controllers - **DONE** (4 controllers, 30+ endpoints)
5. ✅ Sample Data - **DONE** (Auto-loads via DataLoader)

## 🔧 Công cụ cần thiết:

- Java JDK 17+
- Maven 3.6+
- MySQL 8.0+
- IntelliJ IDEA / VS Code + Java extensions

## 📚 Tài liệu:

- **[QUICK_START.md](QUICK_START.md)** - Chạy nhanh 3 phút
- **[START_GUIDE.md](START_GUIDE.md)** - Hướng dẫn chi tiết
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Ví dụ tất cả API
- **[DATA_LOADING.md](DATA_LOADING.md)** - Auto data loading
- **[FIX_APPLIED.md](FIX_APPLIED.md)** - Fix lỗi SQL

---

**🎉 Backend hoàn chỉnh 100%! Chạy ngay: `mvn spring-boot:run`**

