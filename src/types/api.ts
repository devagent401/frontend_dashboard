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
// Product Types (Matching API Documentation)
// ============================================================================

export interface ProductImage {
  url: string;
  alt?: string;
  order?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  sku?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductDiscount {
  type: 'percent' | 'fixed';
  value: number;
  start_at?: string;
  end_at?: string;
}

export interface ProductVatTax {
  type: 'percent' | 'fixed';
  value: number;
}

export interface CategorySnapshot {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandSnapshot {
  id: string;
  name: string;
}

export interface CreateBrandInput {
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  website?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> { }

export interface SellerDetails {
  _id: string;
  name: string;
  logo?: string;
  rating?: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sku: string;
  unit: string;
  unit_price: number;
  quantity: number;
  stock_status: StockStatus;
  category?: string;
  category_snapshot?: CategorySnapshot;
  brand?: string;
  brand_snapshot?: BrandSnapshot;
  seller?: string;
  is_in_house?: boolean;
  seller_details?: SellerDetails;
  thumbnail_image?: ProductImage;
  gallery_images?: ProductImage[];
  publish: boolean;
  is_featured?: boolean;
  tags?: string[];
  discount?: ProductDiscount;
  vat_tax?: ProductVatTax;
  free_shipping?: boolean;
  shipping_cost?: number;
  colors?: ProductColor[];
  attributes?: ProductAttribute[];
  meta_title?: string;
  meta_description?: string;
  barcode?: string;
  low_stock_quantity?: number;
  cash_on_delivery?: boolean;
  is_todays_deal?: boolean;
  views?: number;
  rating?: number;
  review_count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  unit: string;
  unit_price: number;
  description?: string;
  category?: string;
  brand?: string;
  seller?: string | null;
  is_in_house?: boolean;
  quantity?: number;
  low_stock_quantity?: number;
  publish?: boolean;
  is_featured?: boolean;
  tags?: string[];
  thumbnail_image?: ProductImage;
  gallery_images?: ProductImage[];
  discount?: ProductDiscount;
  vat_tax?: ProductVatTax;
  shipping_cost?: number;
  free_shipping?: boolean;
  colors?: ProductColor[];
  attributes?: ProductAttribute[];
  barcode?: string;
  meta_title?: string;
  meta_description?: string;
  cash_on_delivery?: boolean;
  is_todays_deal?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> { }

export interface ProductQueryParams extends PaginationParams {
  q?: string;
  category?: string;
  brand?: string;
  seller?: string;
  min_price?: number;
  max_price?: number;
  tags?: string | string[];
  publish?: boolean;
  featured?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface StockAdjustment {
  change: number;
  type: 'in' | 'out' | 'adjustment';
  reason?: string;
  reference?: string;
}

export interface StockAdjustmentResponse {
  product: {
    _id: string;
    quantity: number;
    stock_status: StockStatus;
  };
  movement: {
    type: string;
    previous_quantity: number;
    new_quantity: number;
    change: number;
  };
}

// ============================================================================
// Upload Types (Matching API Documentation)
// ============================================================================

export type FileCategory = 'image' | 'video' | 'document' | 'audio' | 'other';

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  previewUrl: string;
  category: FileCategory;
  metadata?: Record<string, any>;
  uploadedBy?: User | string;
  uploadedAt: string;
  updatedAt: string;
}

export interface UploadQueryParams extends PaginationParams {
  category?: FileCategory;
  search?: string;
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

