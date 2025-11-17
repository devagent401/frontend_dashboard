import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { QUERY_KEYS } from '../config';
import type { CreateOrderData, OrderQueryParams, OrderStatus } from '../types';
import { toast } from 'sonner';

export function useOrders(params?: OrderQueryParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, params],
    queryFn: () => ordersApi.getOrders(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_STATS,
    queryFn: () => ordersApi.getOrderStats(),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderData) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER_STATS });
      toast.success('Order created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: OrderStatus; notes?: string } }) =>
      ordersApi.updateOrderStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER_STATS });
      toast.success('Order status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ordersApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER_STATS });
      toast.success('Order deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete order');
    },
  });
}

