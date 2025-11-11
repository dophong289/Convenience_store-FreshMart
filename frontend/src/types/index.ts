export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED';

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
  status: ProductStatus;
  isFlashSale: boolean;
  flashSaleDiscount?: number;
  flashSaleEnd?: string;
  weights?: any[];
  tags?: string[];
  ingredients?: string;
  expiry?: string;
  promotions?: string[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SupplierOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SupplierOrder {
  id: number;
  orderNumber: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: string;
  totalAmount: number;
  notes?: string;
  supplier: Supplier;
  items: SupplierOrderItem[];
  createdAt?: string;
  updatedAt?: string;
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

