# 🚀 Hướng dẫn chạy Backend Spring Boot

## ✅ Checklist trước khi bắt đầu:

- [ ] Đã cài Java JDK 17 hoặc mới hơn
- [ ] Đã cài Maven 3.6+
- [ ] Đã cài MySQL 8.0+
- [ ] MySQL đang chạy

## 📝 Các bước thực hiện:

### 1️⃣ Setup Database

Mở MySQL Workbench hoặc terminal và chạy:

```sql
CREATE DATABASE freshmart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2️⃣ Chỉnh sửa file `application.properties`

Mở file: `src/main/resources/application.properties`

Thay đổi thông tin kết nối MySQL của bạn:

```properties
# Đổi username (mặc định là root)
spring.datasource.username=your_mysql_username

# Đổi password (để trống nếu không có password)
spring.datasource.password=your_mysql_password
```

### 3️⃣ Build Project

Mở terminal/cmd tại folder `backend-springboot` và chạy:

```bash
mvn clean install
```

Lệnh này sẽ:
- Download tất cả dependencies
- Compile code
- Tạo file `.jar`

⏱️ Lần đầu có thể mất 3-5 phút để download dependencies.

### 4️⃣ Chạy Application

**Cách 1: Dùng Maven**
```bash
mvn spring-boot:run
```

**Cách 2: Dùng IntelliJ IDEA**
- Mở project trong IntelliJ
- Tìm file `BackendApplication.java`
- Click chuột phải → Run 'BackendApplication'

**Cách 3: Chạy file JAR**
```bash
java -jar target/backend-1.0.0.jar
```

### 5️⃣ Kiểm tra Backend đã chạy

Nếu thấy log như này là thành công:

```
🚀 FreshMart Backend API is running!
📡 API available at: http://localhost:8080/api
📚 Swagger UI: http://localhost:8080/swagger-ui.html
```

### 6️⃣ Test API

**Test với Browser:**
```
http://localhost:8080/api/products
http://localhost:8080/api/categories
```

**Test với CURL:**
```bash
# Get all products
curl http://localhost:8080/api/products

# Get product by slug
curl http://localhost:8080/api/products/tao-fuji-nhat-ban

# Get all categories
curl http://localhost:8080/api/categories

# Get flash sale products
curl http://localhost:8080/api/products/flash-sale
```

**Test với Postman/Thunder Client:**
1. Tạo request GET
2. URL: `http://localhost:8080/api/products`
3. Send

## 📡 Các API có sẵn:

### Products
```
GET    /api/products                    # Danh sách sản phẩm
GET    /api/products/{slug}             # Chi tiết sản phẩm
GET    /api/products/category/{slug}    # Sản phẩm theo danh mục
GET    /api/products/flash-sale         # Sản phẩm flash sale
GET    /api/products/best-selling       # Sản phẩm bán chạy
GET    /api/products/filters/origins    # Lấy danh sách xuất xứ
GET    /api/products/filters/brands     # Lấy danh sách thương hiệu
POST   /api/products                    # Tạo sản phẩm mới
PUT    /api/products/{id}               # Cập nhật sản phẩm
DELETE /api/products/{id}               # Xóa sản phẩm
```

### Categories
```
GET    /api/categories         # Tất cả danh mục
GET    /api/categories/{slug}  # Chi tiết danh mục
POST   /api/categories         # Tạo danh mục
PUT    /api/categories/{id}    # Cập nhật danh mục
DELETE /api/categories/{id}    # Xóa danh mục
```

### Orders
```
GET    /api/orders                # Tất cả đơn hàng
GET    /api/orders/{id}          # Chi tiết đơn hàng
GET    /api/orders/user/{userId} # Đơn hàng của user
POST   /api/orders?userId=1      # Tạo đơn hàng mới
PATCH  /api/orders/{id}/status?status=CONFIRMED  # Cập nhật trạng thái
POST   /api/orders/{id}/cancel   # Hủy đơn hàng
```

### Users
```
GET    /api/users                                 # Tất cả users
GET    /api/users/{id}                            # Chi tiết user
POST   /api/users                                 # Tạo user mới
PUT    /api/users/{id}                            # Cập nhật user
POST   /api/users/{userId}/wishlist/{productId}  # Thêm vào wishlist
DELETE /api/users/{userId}/wishlist/{productId}  # Xóa khỏi wishlist
```

## 🎯 Ví dụ Request Body:

### Tạo User mới:
```json
POST /api/users
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0901234567",
  "password": "123456"
}
```

### Tạo Order mới:
```json
POST /api/orders?userId=1
{
  "items": [
    {
      "product": { "id": 1 },
      "quantity": 2,
      "selectedWeight": "500g",
      "price": 89000
    }
  ],
  "shippingFee": 30000,
  "discount": 0,
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "123 Đường ABC",
    "ward": "Phường 1",
    "district": "Quận 1",
    "city": "TP. HCM"
  },
  "paymentMethod": "COD",
  "deliveryOption": "EXPRESS_2H",
  "note": "Giao trước 5h chiều"
}
```

## 🐛 Troubleshooting

### Lỗi: Port 8080 already in use
```properties
# Đổi port trong application.properties
server.port=8081
```

### Lỗi: Access denied for user
- Kiểm tra username/password MySQL
- Đảm bảo user có quyền truy cập database

### Lỗi: Communications link failure
- Kiểm tra MySQL đang chạy
- Kiểm tra port MySQL (mặc định 3306)

### Database không tự tạo bảng
- Kiểm tra `spring.jpa.hibernate.ddl-auto=update` trong application.properties
- Xóa database và tạo lại

## 📊 Kiểm tra Database

Sau khi chạy backend, các bảng sẽ tự động được tạo:

```sql
USE freshmart;
SHOW TABLES;

-- Xem dữ liệu mẫu
SELECT * FROM categories;
SELECT * FROM products;
```

## 🔄 Tắt & Chạy lại

**Tắt:**
- Maven: `Ctrl + C`
- IntelliJ: Click nút Stop màu đỏ

**Chạy lại:**
```bash
mvn spring-boot:run
```

## ✨ Tips

1. **Auto-reload khi code thay đổi:**
   - IntelliJ có sẵn DevTools
   - Code thay đổi → Save → Backend tự restart

2. **Xem logs:**
   - Logs hiển thị trong terminal
   - Level: DEBUG để xem SQL queries

3. **Test nhanh:**
   - Dùng Thunder Client (VS Code extension)
   - Hoặc Postman

---

**🎉 Chúc bạn code vui vẻ!**

Nếu có lỗi, check lại:
1. MySQL đang chạy?
2. Username/password đúng?
3. Port 8080 available?
4. Java JDK 17+ installed?

