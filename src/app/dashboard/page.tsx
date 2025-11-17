'use client';

import { useQuery } from '@tanstack/react-query';
import { accountingService } from '@/services/accounting.service';
import { ordersService } from '@/services/orders.service';
import { productsService } from '@/services/products.service';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertCircle,
  Users,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  // Fetch dashboard data
  const { data: dailyReport } = useQuery({
    queryKey: ['daily-report'],
    queryFn: () => accountingService.getDailyReport(),
  });

  const { data: orderStats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => ordersService.getOrderStats(),
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => productsService.getLowStockProducts(),
  });

  const stats = [
    {
      name: 'Total Revenue',
      value: formatCurrency(dailyReport?.orders.revenue || 0),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Total Orders',
      value: dailyReport?.orders.total || 0,
      change: `${dailyReport?.orders.pending || 0} pending`,
      changeType: 'neutral',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      name: 'Profit Today',
      value: formatCurrency(dailyReport?.transactions.profit || 0),
      change: '+8.2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      name: 'Low Stock Items',
      value: lowStockProducts?.length || 0,
      change: 'Action needed',
      changeType: lowStockProducts && lowStockProducts.length > 0 ? 'negative' : 'neutral',
      icon: Package,
      color: 'bg-orange-500',
    },
  ];

  const recentOrders = [
    // This would come from API
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-sm font-semibold ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : stat.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">
                {dailyReport?.orders.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">
                {dailyReport?.orders.completed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cancelled</span>
              <span className="font-semibold text-red-600">
                {dailyReport?.orders.cancelled || 0}
              </span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {dailyReport?.orders.total || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Financial Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Income</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(dailyReport?.transactions.income || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expenses</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(dailyReport?.transactions.expense || 0)}
              </span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Net Profit</span>
                <span
                  className={`text-xl font-bold ${
                    (dailyReport?.transactions.profit || 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatCurrency(dailyReport?.transactions.profit || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-orange-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Low Stock Alert
              </h3>
              <p className="text-orange-800 mb-3">
                {lowStockProducts.length} product(s) are running low on stock
              </p>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between bg-white p-3 rounded"
                  >
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                    <span className="text-sm text-red-600 font-semibold">
                      {product.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
              {lowStockProducts.length > 5 && (
                <a
                  href="/dashboard/products?status=low-stock"
                  className="text-orange-600 hover:text-orange-800 font-semibold text-sm mt-3 inline-block"
                >
                  View all low stock items →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="/dashboard/products/create"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Package className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-semibold text-gray-700">
              Add Product
            </span>
          </a>
          <a
            href="/dashboard/orders"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ShoppingCart className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-semibold text-gray-700">
              View Orders
            </span>
          </a>
          <a
            href="/dashboard/categories/create"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Package className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-semibold text-gray-700">
              Add Category
            </span>
          </a>
          <a
            href="/dashboard/analytics"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-semibold text-gray-700">
              View Analytics
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
