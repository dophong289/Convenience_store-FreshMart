# 📡 API Examples - FreshMart Backend

Tất cả ví dụ thực tế để test API.

## 🎯 Base URL
```
http://localhost:8080/api
```

---

## 📦 PRODUCTS

### 1. Get All Products (với filter)
```bash
curl "http://localhost:8080/api/products?page=0&size=20&sortBy=sold&sortOrder=desc"
```

### 2. Search Products
```bash
curl "http://localhost:8080/api/products?search=táo"
```

### 3. Filter by Category
```bash
curl "http://localhost:8080/api/products?category=trai-cay"
```

### 4. Filter by Price Range
```bash
curl "http://localhost:8080/api/products?minPrice=50000&maxPrice=150000"
```

### 5. Filter Multiple
```bash
curl "http://localhost:8080/api/products?category=trai-cay&origin=Việt Nam&inStock=true&sortBy=price&sortOrder=asc"
```

### 6. Get Product by Slug
```bash
curl "http://localhost:8080/api/products/tao-fuji-nhat-ban"
```

### 7. Get Flash Sale Products
```bash
curl "http://localhost:8080/api/products/flash-sale"
```

### 8. Get Best Selling
```bash
curl "http://localhost:8080/api/products/best-selling"
```

### 9. Get Origins (for filters)
```bash
curl "http://localhost:8080/api/products/filters/origins"
```

### 10. Get Brands (for filters)
```bash
curl "http://localhost:8080/api/products/filters/brands"
```

### 11. Create Product
```bash
curl -X POST "http://localhost:8080/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Táo Envy New Zealand",
    "slug": "tao-envy-new-zealand",
    "description": "Táo Envy nhập khẩu New Zealand",
    "price": 129000,
    "originalPrice": 149000,
    "image": "https://example.com/image.jpg",
    "category": { "id": 1 },
    "categorySlug": "trai-cay",
    "brand": "FreshMart",
    "origin": "New Zealand",
    "stock": 100,
    "rating": 4.8,
    "reviewCount": 0
  }'
```

---

## 📁 CATEGORIES

### 1. Get All Categories
```bash
curl "http://localhost:8080/api/categories"
```

### 2. Get Category by Slug
```bash
curl "http://localhost:8080/api/categories/trai-cay"
```

### 3. Create Category
```bash
curl -X POST "http://localhost:8080/api/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Đồ khô",
    "slug": "do-kho",
    "icon": "🥜",
    "image": "https://example.com/category.jpg"
  }'
```

---

## 👤 USERS

### 1. Create User (Register)
```bash
curl -X POST "http://localhost:8080/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@gmail.com",
    "phone": "0901234567",
    "password": "123456"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@gmail.com",
    "phone": "0901234567",
    "points": 0,
    "membershipTier": "BRONZE",
    "role": "CUSTOMER",
    "wishlist": []
  }
}
```

### 2. Get User by ID
```bash
curl "http://localhost:8080/api/users/1"
```

### 3. Update User
```bash
curl -X PUT "http://localhost:8080/api/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A Updated",
    "phone": "0901234567"
  }'
```

### 4. Add to Wishlist
```bash
curl -X POST "http://localhost:8080/api/users/1/wishlist/1"
```

### 5. Remove from Wishlist
```bash
curl -X DELETE "http://localhost:8080/api/users/1/wishlist/1"
```

---

## 🛒 ORDERS

### 1. Create Order
```bash
curl -X POST "http://localhost:8080/api/orders?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": { "id": 1 },
        "quantity": 2,
        "selectedWeight": "500g",
        "price": 89000
      },
      {
        "product": { "id": 2 },
        "quantity": 1,
        "price": 45000
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
      "city": "TP. Hồ Chí Minh"
    },
    "paymentMethod": "COD",
    "deliveryOption": "EXPRESS_2H",
    "note": "Giao trước 5h chiều"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "total": 223000,
    "shippingFee": 30000,
    "discount": 0,
    "finalTotal": 253000,
    "status": "PENDING",
    "paymentMethod": "COD",
    "deliveryOption": "EXPRESS_2H",
    "estimatedDelivery": "2024-11-05T14:00:00"
  }
}
```

### 2. Get User Orders
```bash
curl "http://localhost:8080/api/orders/user/1?page=0&size=10"
```

### 3. Get Order by ID
```bash
curl "http://localhost:8080/api/orders/1"
```

### 4. Update Order Status
```bash
curl -X PATCH "http://localhost:8080/api/orders/1/status?status=CONFIRMED"
```

Status options: `PENDING`, `CONFIRMED`, `SHIPPING`, `DELIVERED`, `CANCELLED`

### 5. Cancel Order
```bash
curl -X POST "http://localhost:8080/api/orders/1/cancel"
```

### 6. Get Order Statistics (Admin)
```bash
curl "http://localhost:8080/api/orders/stats/count"
```

Response:
```json
{
  "success": true,
  "data": {
    "pending": 5,
    "confirmed": 10,
    "shipping": 8,
    "delivered": 25,
    "cancelled": 2
  }
}
```

---

## 🎯 POSTMAN Collection

### Import vào Postman:

1. Open Postman
2. Import → Raw text
3. Paste:

```json
{
  "info": {
    "name": "FreshMart API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/products?page=0&size=20",
              "host": ["{{baseUrl}}"],
              "path": ["products"],
              "query": [
                {"key": "page", "value": "0"},
                {"key": "size", "value": "20"}
              ]
            }
          }
        },
        {
          "name": "Get Product by Slug",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/products/tao-fuji-nhat-ban",
              "host": ["{{baseUrl}}"],
              "path": ["products", "tao-fuji-nhat-ban"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api"
    }
  ]
}
```

---

## 🧪 Test Scenarios

### Scenario 1: User mua hàng hoàn chỉnh

```bash
# 1. Tạo user
curl -X POST "http://localhost:8080/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","phone":"0901111111","password":"123456"}'

# 2. Browse products
curl "http://localhost:8080/api/products?category=trai-cay"

# 3. Xem chi tiết sản phẩm
curl "http://localhost:8080/api/products/tao-fuji-nhat-ban"

# 4. Tạo đơn hàng
curl -X POST "http://localhost:8080/api/orders?userId=1" \
  -H "Content-Type: application/json" \
  -d '{...order data...}'

# 5. Xem đơn hàng của mình
curl "http://localhost:8080/api/orders/user/1"
```

### Scenario 2: Admin quản lý đơn hàng

```bash
# 1. Xem tất cả đơn pending
curl "http://localhost:8080/api/orders/status/PENDING"

# 2. Confirm đơn hàng
curl -X PATCH "http://localhost:8080/api/orders/1/status?status=CONFIRMED"

# 3. Update to shipping
curl -X PATCH "http://localhost:8080/api/orders/1/status?status=SHIPPING"

# 4. Đã giao
curl -X PATCH "http://localhost:8080/api/orders/1/status?status=DELIVERED"

# 5. Xem thống kê
curl "http://localhost:8080/api/orders/stats/count"
```

---

## 📊 Response Format

All APIs return:

### Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

### Error:
```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2024-11-05T12:00:00"
}
```

---

## 🔐 Authentication (Future)

Currently all endpoints are open. To add JWT:

```bash
# Login (to be implemented)
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Use token
curl "http://localhost:8080/api/orders/user/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

**🎉 Happy Testing!**

