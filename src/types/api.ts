// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  role: 'superadmin' | 'admin' | 'manager' | 'staff' | 'customer';
  roleId?: Role;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  costPrice?: number;
  categoryId?: Category;
  sku?: string;
  barcode: string;
  stockQuantity: number;
  soldQuantity: number;
  damagedQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  unit: string;
  images: string[];
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  tags: string[];
  attributes: Record<string, any>;
  supplierId?: Supplier;
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  categoryId?: string;
  sku?: string;
  barcode?: string;
  stockQuantity?: number;
  minStockLevel?: number;
  unit?: string;
  images?: string[];
  status?: 'active' | 'inactive' | 'draft';
  tags?: string[];
  attributes?: Record<string, any>;
}

// ============================================================================
// Category Types
// ============================================================================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: Category | string;
  ancestors: string[];
  level: number;
  image?: string;
  icon?: string;
  status: 'active' | 'inactive';
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  productCount: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  status?: 'active' | 'inactive';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

// ============================================================================
// Order Types
// ============================================================================

export interface Order {
  _id: string;
  orderNumber: string;
  customerId?: User;
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'partial';
  shippingAddress?: Address & { phone: string };
  notes?: string;
  trackingNumber?: string;
  cancelReason?: string;
  returnReason?: string;
  processedBy?: User;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string | Product;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'rejected'
  | 'returned';

export type PaymentMethod = 'cash' | 'card' | 'online' | 'bank_transfer';

export interface CreateOrderInput {
  customerId?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress?: Address & { phone: string };
  paymentMethod: PaymentMethod;
  notes?: string;
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
}

// ============================================================================
// Supplier Types
// ============================================================================

export interface Supplier {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  address?: Address;
  company?: string;
  taxId?: string;
  website?: string;
  contactPerson?: string;
  notes?: string;
  status: 'active' | 'inactive';
  purchaseHistory: PurchaseHistory[];
  totalPurchaseAmount: number;
  lastPurchaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseHistory {
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  invoiceNumber?: string;
}

// ============================================================================
// Transaction Types
// ============================================================================

export interface Transaction {
  _id: string;
  reference: string;
  type: 'income' | 'expense';
  category: 'sale' | 'purchase' | 'return' | 'damage' | 'salary' | 'rent' | 'utility' | 'other';
  amount: number;
  description?: string;
  date: string;
  relatedEntity?: {
    entityType: 'order' | 'product' | 'supplier' | 'customer';
    entityId: string;
  };
  createdBy?: User;
  paymentMethod?: PaymentMethod;
  status: 'completed' | 'pending' | 'cancelled';
  balance?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  _id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'order' | 'reject' | 'comment' | 'system' | 'stock' | 'other';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  readAt?: string;
  data?: Record<string, any>;
  relatedEntity?: {
    entityType: 'order' | 'product' | 'user' | 'other';
    entityId: string;
  };
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface Settings {
  _id: string;
  companyName: string;
  logo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  footer?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Role Types
// ============================================================================

export interface Role {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Accounting Types
// ============================================================================

export interface DailyReport {
  date: string;
  transactions: {
    income: number;
    expense: number;
    profit: number;
    count: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
}

export interface MonthlyReport {
  period: {
    year: number;
    month: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    income: number;
    expense: number;
    profit: number;
    profitMargin: number;
  };
  byCategory: Array<{
    type: string;
    category: string;
    total: number;
    count: number;
  }>;
  orders: {
    total: number;
    revenue: number;
  };
  dailyStats: any[];
}

export interface StockReport {
  total: {
    products: number;
    quantity: number;
    value: number;
  };
  lowStock: {
    count: number;
    products: Array<{
      id: string;
      name: string;
      stock: number;
      minLevel: number;
    }>;
  };
  outOfStock: {
    count: number;
    products: Array<{
      id: string;
      name: string;
    }>;
  };
  damaged: {
    count: number;
    totalQuantity: number;
    products: Array<{
      id: string;
      name: string;
      damaged: number;
    }>;
  };
  byCategory: Record<string, any>;
}

