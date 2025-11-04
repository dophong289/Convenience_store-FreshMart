# 🚀 CHẠY NGAY - 2 PHÚT!

## Bước 1: Đảm bảo MySQL đang chạy

```bash
# Test MySQL
mysql -u root -p123456
```

Nếu chưa có database:
```sql
CREATE DATABASE freshmart;
exit;
```

## Bước 2: Chạy Backend

```bash
cd backend-springboot
mvn spring-boot:run
```

## Bước 3: Chờ thấy message này:

```
✅ Sample data loaded successfully!
🚀 FreshMart Backend API is running!
📡 API available at: http://localhost:8080/api
```

## Bước 4: Test API

Mở browser:
```
http://localhost:8080/api/products
http://localhost:8080/api/categories
```

Hoặc CURL:
```bash
curl http://localhost:8080/api/products
```

---

## ✅ Done!

Bạn sẽ thấy:
- **8 categories** (Trái cây, Rau củ quả, Thịt...)
- **10 products** (Táo Fuji, Cam Sành, Dâu Tây...)
- **4 flash sale** products

---

## 🔥 Next Steps:

1. Test thử các API endpoints
2. Connect frontend với backend
3. Xem API examples: `API_EXAMPLES.md`

**Enjoy! 🎉**

