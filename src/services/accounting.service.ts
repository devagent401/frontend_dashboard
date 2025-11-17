import apiClient from '@/lib/api-client';
import { ApiResponse, DailyReport, MonthlyReport, StockReport } from '@/types/api';

export const accountingService = {
  // Get daily report
  getDailyReport: async (date?: string): Promise<DailyReport> => {
    const response = await apiClient.get<ApiResponse<DailyReport>>('/accounting/reports/daily', {
      params: { date },
    });
    return response.data.data!;
  },

  // Get monthly report
  getMonthlyReport: async (year?: number, month?: number): Promise<MonthlyReport> => {
    const response = await apiClient.get<ApiResponse<MonthlyReport>>('/accounting/reports/monthly', {
      params: { year, month },
    });
    return response.data.data!;
  },

  // Get yearly report
  getYearlyReport: async (year?: number): Promise<any> => {
    const response = await apiClient.get<ApiResponse>('/accounting/reports/yearly', {
      params: { year },
    });
    return response.data.data!;
  },

  // Get profit/loss statement
  getProfitLossStatement: async (startDate?: string, endDate?: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse>('/accounting/profit-loss', {
      params: { startDate, endDate },
    });
    return response.data.data!;
  },

  // Get stock report
  getStockReport: async (): Promise<StockReport> => {
    const response = await apiClient.get<ApiResponse<StockReport>>('/accounting/stock-report');
    return response.data.data!;
  },
};

