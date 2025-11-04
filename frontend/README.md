# FreshMart Frontend - React + TypeScript

Frontend cho website cửa hàng tiện lợi FreshMart được xây dựng bằng React + TypeScript + Tailwind CSS.

## 🚀 Công nghệ

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP Client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📦 Cài đặt

```bash
cd frontend
npm install
```

## 🏃 Chạy Development

```bash
npm start
```

Mở [http://localhost:3000](http://localhost:3000) trong browser.

## 🔨 Build Production

```bash
npm run build
```

## 📁 Cấu trúc thư mục

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   └── index.tsx       # Entry point
└── package.json
```

## 🔗 Kết nối Backend

Backend API mặc định chạy ở: `http://localhost:8080/api`

Cấu hình trong file `.env`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

## 📝 Tính năng

- ✅ Trang chủ với banner, flash sale, sản phẩm bán chạy
- ✅ Danh mục sản phẩm với filter và sort
- ✅ Chi tiết sản phẩm
- ✅ Giỏ hàng và checkout
- ✅ Tài khoản người dùng
- ✅ Wishlist
- ✅ Tìm kiếm thông minh
- ✅ Responsive design
- ✅ Admin panel
- ✅ Mua theo công thức món ăn
- ✅ Menu theo tuần
- ✅ Mua theo ngân sách

## 🎨 Components

Các component được tái sử dụng:
- `Navbar` - Header navigation
- `Footer` - Footer
- `ProductCard` - Card sản phẩm
- `MiniCart` - Giỏ hàng mini
- `FlashSale` - Section flash sale

## 📡 API Integration

Sử dụng Axios để call API:

```typescript
import api from './services/api';

// Get products
const products = await api.get('/products');

// Create order
const order = await api.post('/orders', orderData);
```

## 🔒 Authentication

Sử dụng JWT token để authentication:
- Token được lưu trong localStorage
- Tự động thêm vào header của mọi request

## 📱 Responsive

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Bottom navigation cho mobile

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Made with ❤️ by FreshMart Team
