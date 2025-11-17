import apiClient from '@/lib/api-client';
import { ApiResponse, Transaction, PaginationParams } from '@/types/api';

export const transactionsService = {
  // Get all transactions
  getTransactions: async (params?: PaginationParams & {
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<Transaction[]>> => {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/transactions', { params });
    return response.data;
  },

  // Get transaction by ID
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data!;
  },

  // Create transaction
  createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data.data!;
  },

  // Update transaction
  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data.data!;
  },

  // Delete transaction
  deleteTransaction: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  // Get transaction summary
  getTransactionSummary: async (startDate?: string, endDate?: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse>('/transactions/summary', {
      params: { startDate, endDate },
    });
    return response.data.data!;
  },
};

