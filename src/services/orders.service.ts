import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  Order,
  CreateOrderInput,
  OrderStatus,
  PaginationParams,
} from '@/types/api';

export const ordersService = {
  // Get all orders
  getOrders: async (params?: PaginationParams & {
    status?: OrderStatus;
    paymentStatus?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },

  // Create order
  createOrder: async (data: CreateOrderInput): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data.data!;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: OrderStatus, notes?: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, {
      status,
      notes,
    });
    return response.data.data!;
  },

  // Delete order
  deleteOrder: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },

  // Get order statistics
  getOrderStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse>('/orders/stats');
    return response.data.data!;
  },
};

