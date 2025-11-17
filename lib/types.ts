// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: any;
  };
}

// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  roleId?: Role;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
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

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  costPrice?: number;
  categoryId?: Category | string;
  supplierId?: Supplier | string;
  sku?: string;
  barcode: string;
  stockQuantity: number;
  soldQuantity: number;
  damagedQuantity?: number;
  minStockLevel: number;
  maxStockLevel?: number;
  unit: string;
  images: string[];
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  tags: string[];
  attributes?: Record<string, any>;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  categoryId?: string;
  sku?: string;
  barcode?: string;
  stockQuantity?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  unit?: string;
  images?: string[];
  status?: 'active' | 'inactive' | 'draft';
  tags?: string[];
  attributes?: Record<string, any>;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  supplierId?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  ancestors?: string[];
  image?: string;
  icon?: string;
  status: 'active' | 'inactive';
  level: number;
  order: number;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  status?: 'active' | 'inactive';
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId?: User | string;
  customerInfo?: {
    name?: string;
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
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress?: Address;
  processedBy?: User | string;
  processedAt?: string;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: Product | string;
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

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'online' | 'bank_transfer';

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface CreateOrderData {
  customerId?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress?: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  taxId?: string;
  website?: string;
  status: 'active' | 'inactive';
  totalPurchases?: number;
  totalAmount?: number;
  notes?: string;
  purchaseHistory?: PurchaseHistory[];
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
  invoiceNumber: string;
}

export interface CreateSupplierData {
  name: string;
  email?: string;
  phone: string;
  company?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  taxId?: string;
  website?: string;
  status?: 'active' | 'inactive';
  notes?: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  reference: string;
  type: 'income' | 'expense';
  category: 'sale' | 'purchase' | 'return' | 'damage' | 'other';
  amount: number;
  description?: string;
  date: string;
  paymentMethod?: PaymentMethod;
  status: 'pending' | 'completed' | 'cancelled';
  relatedEntity?: {
    entityType: 'order' | 'product' | 'supplier' | 'customer';
    entityId: string;
  };
  createdBy?: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  type: 'income' | 'expense';
  category: 'sale' | 'purchase' | 'return' | 'damage' | 'other';
  amount: number;
  description?: string;
  paymentMethod?: PaymentMethod;
  date?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  reference?: string;
  relatedEntity?: {
    entityType: 'order' | 'product' | 'supplier' | 'customer';
    entityId: string;
  };
}

// Notification Types
export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'system' | 'info' | 'warning' | 'error' | 'success' | 'reject';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  relatedEntity?: {
    entityType: string;
    entityId: string;
  };
  actionUrl?: string;
  createdAt: string;
}

// Settings Types
export interface Settings {
  id: string;
  companyName: string;
  logo?: string;
  favicon?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  currency: string;
  taxRate: number;
  footer?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  maintenance?: {
    enabled: boolean;
    message?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Role Types
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: string[];
}

// Report Types
export interface DailyReport {
  date: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  orderCount: number;
  productsSold: number;
  topProducts: {
    productId: string;
    name: string;
    quantitySold: number;
    revenue: number;
  }[];
  paymentMethods: Record<string, number>;
}

export interface MonthlyReport {
  year: number;
  month: number;
  monthName: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  orderCount: number;
  productsSold: number;
  averageOrderValue: number;
  dailyBreakdown: {
    date: string;
    revenue: number;
    expenses: number;
    netProfit: number;
    orders: number;
  }[];
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    revenue: number;
    unitsSold: number;
  }[];
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductQueryParams extends PaginationParams {
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface OrderQueryParams extends PaginationParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserQueryParams extends PaginationParams {
  role?: string;
  status?: boolean;
  search?: string;
}

