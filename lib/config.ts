// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 30000,
} as const;

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'E-Commerce Dashboard',
  ITEMS_PER_PAGE: 20,
  DEBOUNCE_DELAY: 300,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

// Query Keys
export const QUERY_KEYS = {
  // Auth
  AUTH_USER: ['auth', 'user'],
  
  // Products
  PRODUCTS: ['products'],
  PRODUCT: (id: string) => ['products', id],
  LOW_STOCK_PRODUCTS: ['products', 'low-stock'],
  
  // Categories
  CATEGORIES: ['categories'],
  CATEGORY: (id: string) => ['categories', id],
  CATEGORY_PRODUCTS: (id: string) => ['categories', id, 'products'],
  
  // Orders
  ORDERS: ['orders'],
  ORDER: (id: string) => ['orders', id],
  ORDER_STATS: ['orders', 'stats'],
  
  // Suppliers
  SUPPLIERS: ['suppliers'],
  SUPPLIER: (id: string) => ['suppliers', id],
  SUPPLIER_PURCHASES: (id: string) => ['suppliers', id, 'purchases'],
  
  // Transactions
  TRANSACTIONS: ['transactions'],
  TRANSACTION: (id: string) => ['transactions', id],
  TRANSACTION_SUMMARY: ['transactions', 'summary'],
  
  // Accounting
  DAILY_REPORT: ['accounting', 'daily'],
  MONTHLY_REPORT: ['accounting', 'monthly'],
  YEARLY_REPORT: ['accounting', 'yearly'],
  PROFIT_LOSS: ['accounting', 'profit-loss'],
  STOCK_REPORT: ['accounting', 'stock-report'],
  
  // Notifications
  NOTIFICATIONS: ['notifications'],
  NOTIFICATION: (id: string) => ['notifications', id],
  UNREAD_COUNT: ['notifications', 'unread-count'],
  
  // Settings
  SETTINGS: ['settings'],
  
  // Roles
  ROLES: ['roles'],
  ROLE: (id: string) => ['roles', id],
  ROLE_USERS: (id: string) => ['roles', id, 'users'],
  
  // Users
  USERS: ['users'],
  USER: (id: string) => ['users', id],
  USER_STATS: ['users', 'stats'],
} as const;

