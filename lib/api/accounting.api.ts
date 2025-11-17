import { api } from '../api-client';
import type { DailyReport, MonthlyReport } from '../types';

export const accountingApi = {
  // Get daily report
  getDailyReport: async (date: string) => {
    return api.get<DailyReport>('/accounting/reports/daily', { date });
  },

  // Get monthly report
  getMonthlyReport: async (year: number, month: number) => {
    return api.get<MonthlyReport>('/accounting/reports/monthly', { year, month });
  },

  // Get yearly report
  getYearlyReport: async (year: number) => {
    return api.get('/accounting/reports/yearly', { year });
  },

  // Get profit/loss statement
  getProfitLoss: async (startDate: string, endDate: string) => {
    return api.get('/accounting/profit-loss', { startDate, endDate });
  },

  // Get stock report
  getStockReport: async () => {
    return api.get('/accounting/stock-report');
  },
};

