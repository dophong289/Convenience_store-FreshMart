export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: Category;
  categorySlug: string;
  brand?: string;
  origin?: string;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  isFlashSale: boolean;
  flashSaleDiscount?: number;
  flashSaleEnd?: string;
  weights?: any[];
  tags?: string[];
  ingredients?: string;
  expiry?: string;
  promotions?: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: number;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  orderDate?: string;
  status?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

