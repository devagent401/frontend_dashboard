import { api } from '../api-client';
import type { Order, CreateOrderData, OrderQueryParams, OrderStatus } from '../types';

export const ordersApi = {
  // Get all orders
  getOrders: async (params?: OrderQueryParams) => {
    return api.get<Order[]>('/orders', params);
  },

  // Get order by ID
  getOrder: async (id: string) => {
    return api.get<Order>(`/orders/${id}`);
  },

  // Get order statistics
  getOrderStats: async () => {
    return api.get('/orders/stats');
  },

  // Create order
  createOrder: async (data: CreateOrderData) => {
    return api.post<Order>('/orders', data);
  },

  // Update order status
  updateOrderStatus: async (id: string, data: { status: OrderStatus; notes?: string }) => {
    return api.patch<Order>(`/orders/${id}/status`, data);
  },

  // Delete order
  deleteOrder: async (id: string) => {
    return api.delete(`/orders/${id}`);
  },
};

