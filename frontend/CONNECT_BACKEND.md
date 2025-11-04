# 🔌 Kết nối Frontend với Backend

## ✅ Đã setup sẵn:

### 1. API Configuration
- ✅ `src/api/config.ts` - API URLs & Endpoints
- ✅ `src/api/apiClient.ts` - Axios client với interceptors
- ✅ `.env` - Environment variables

### 2. API Services
- ✅ `src/api/productService.ts` - Product APIs
- ✅ `src/api/categoryService.ts` - Category APIs  
- ✅ `src/api/orderService.ts` - Order APIs

## 🚀 Cách sử dụng:

### Import service vào component:

```typescript
import { productService } from './api/productService';
import { categoryService } from './api/categoryService';
import { orderService } from './api/orderService';
```

### Ví dụ: Lấy danh sách sản phẩm

```typescript
import React, { useEffect, useState } from 'react';
import { productService, Product } from './api/productService';

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        page: 0,
        size: 20,
        sortBy: 'sold',
        sortOrder: 'desc'
      });
      
      if (response.success) {
        setProducts(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price} ₫</p>
        </div>
      ))}
    </div>
  );
}
```

### Ví dụ: Lấy danh mục

```typescript
const loadCategories = async () => {
  const response = await categoryService.getAllCategories();
  if (response.success) {
    setCategories(response.data);
  }
};
```

### Ví dụ: Lấy Flash Sale

```typescript
const loadFlashSale = async () => {
  const response = await productService.getFlashSaleProducts();
  if (response.success) {
    setFlashSaleProducts(response.data);
  }
};
```

### Ví dụ: Tạo đơn hàng

```typescript
const createOrder = async () => {
  const order = {
    items: [
      {
        product: { id: 1 },
        quantity: 2,
        price: 89000
      }
    ],
    shippingFee: 30000,
    discount: 0,
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC",
      ward: "Phường 1",
      district: "Quận 1",
      city: "TP. HCM"
    },
    paymentMethod: "COD",
    deliveryOption: "EXPRESS_2H",
    note: ""
  };

  const response = await orderService.createOrder(order, 1); // userId = 1
  if (response.success) {
    alert('Đặt hàng thành công!');
  }
};
```

### Ví dụ: Search sản phẩm

```typescript
const searchProducts = async (keyword: string) => {
  const response = await productService.getProducts({
    search: keyword,
    page: 0,
    size: 20
  });
  
  if (response.success) {
    setSearchResults(response.data);
  }
};
```

### Ví dụ: Filter sản phẩm theo category

```typescript
const filterByCategory = async (categorySlug: string) => {
  const response = await productService.getProductsByCategory(categorySlug);
  
  if (response.success) {
    setProducts(response.data);
  }
};
```

## 🎯 Các API có sẵn:

### Product Service:
- `getProducts(params)` - Lấy danh sách với filters
- `getProductBySlug(slug)` - Chi tiết sản phẩm
- `getProductsByCategory(slug)` - Sản phẩm theo danh mục
- `getFlashSaleProducts()` - Flash sale
- `getBestSellingProducts()` - Bán chạy nhất
- `getOrigins()` - Danh sách xuất xứ
- `getBrands()` - Danh sách thương hiệu

### Category Service:
- `getAllCategories()` - Tất cả danh mục
- `getCategoryBySlug(slug)` - Chi tiết danh mục

### Order Service:
- `createOrder(order, userId)` - Tạo đơn hàng
- `getUserOrders(userId, page, size)` - Đơn hàng của user
- `getOrderById(id)` - Chi tiết đơn
- `updateOrderStatus(id, status)` - Cập nhật trạng thái
- `cancelOrder(id)` - Hủy đơn
- `getOrderStats()` - Thống kê (admin)

## 🔧 Advanced Features:

### 1. Filters & Pagination

```typescript
const response = await productService.getProducts({
  category: 'trai-cay',
  search: 'táo',
  minPrice: 50000,
  maxPrice: 150000,
  origin: 'Việt Nam',
  inStock: true,
  sortBy: 'price',
  sortOrder: 'asc',
  page: 0,
  size: 20
});

console.log('Total pages:', response.totalPages);
console.log('Total items:', response.totalItems);
console.log('Current page:', response.currentPage);
```

### 2. Error Handling

```typescript
try {
  const response = await productService.getProducts();
  // Handle success
} catch (error: any) {
  if (error.message) {
    alert(error.message);
  } else {
    alert('Có lỗi xảy ra');
  }
}
```

### 3. Loading State

```typescript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const response = await productService.getProducts();
    // ...
  } finally {
    setLoading(false);
  }
};
```

## ⚙️ Environment Variables:

File `.env`:
```bash
REACT_APP_API_URL=http://localhost:8080/api
```

Nếu backend chạy ở port khác:
```bash
REACT_APP_API_URL=http://localhost:8081/api
```

## 🧪 Test API:

### 1. Đảm bảo backend đang chạy:
```bash
cd backend-springboot
mvn spring-boot:run
```

### 2. Test trong React DevTools Console:
```javascript
// Open browser console
import { productService } from './api/productService';

productService.getProducts().then(console.log);
```

## 🐛 Troubleshooting:

### CORS Error:
- Backend đã config CORS cho `http://localhost:3000`
- Nếu frontend chạy port khác, update `application.properties`:
```properties
cors.allowed-origins=http://localhost:3001
```

### Connection Refused:
- Kiểm tra backend đang chạy: `http://localhost:8080/api/products`
- Kiểm tra `.env` có đúng URL không

### 401/403 Errors:
- Check authentication (nếu cần)
- Token có còn valid không

## 📚 Next Steps:

1. Tạo React components sử dụng các services này
2. Implement state management (Context API hoặc Redux)
3. Add loading skeletons
4. Add error boundaries
5. Implement caching (React Query)

---

**🎉 Frontend đã sẵn sàng kết nối với Backend!**

Test thử ngay:
1. Run backend: `mvn spring-boot:run`
2. Run frontend: `npm start`
3. Open http://localhost:3000

