import { api } from '../api-client';
import type { Transaction, CreateTransactionData, PaginationParams } from '../types';

export const transactionsApi = {
  // Get all transactions
  getTransactions: async (
    params?: PaginationParams & {
      type?: string;
      category?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
    }
  ) => {
    return api.get<Transaction[]>('/transactions', params);
  },

  // Get transaction by ID
  getTransaction: async (id: string) => {
    return api.get<Transaction>(`/transactions/${id}`);
  },

  // Get transaction summary
  getTransactionSummary: async (params?: { startDate?: string; endDate?: string }) => {
    return api.get('/transactions/summary', params);
  },

  // Create transaction
  createTransaction: async (data: CreateTransactionData) => {
    return api.post<Transaction>('/transactions', data);
  },

  // Update transaction
  updateTransaction: async (id: string, data: Partial<CreateTransactionData>) => {
    return api.put<Transaction>(`/transactions/${id}`, data);
  },

  // Delete transaction
  deleteTransaction: async (id: string) => {
    return api.delete(`/transactions/${id}`);
  },
};

