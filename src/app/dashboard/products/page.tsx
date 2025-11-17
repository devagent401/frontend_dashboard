'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/api';
import { Plus, Edit, Trash, Package, Search, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, search, statusFilter],
    queryFn: () =>
      productsService.getProducts({
        page,
        limit: 12,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      out_of_stock: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading products. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <a
          href="/dashboard/products/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && data?.data && (
        <>
          {data.data.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first product
              </p>
              <a
                href="/dashboard/products/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((product: Product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.images[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description || 'No description'}
                    </p>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.costPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.costPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock Info */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span
                        className={`${
                          product.stockQuantity <= product.minStockLevel
                            ? 'text-red-600 font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        Stock: {product.stockQuantity}
                      </span>
                      {product.stockQuantity <= product.minStockLevel && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          Low Stock
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`/dashboard/products/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors disabled:opacity-50"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.meta.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.meta!.totalPages, p + 1))}
                disabled={page === data.meta.totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
