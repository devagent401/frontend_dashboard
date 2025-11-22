'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash, Package, Search, Filter } from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types/api';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [publishFilter, setPublishFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Fetch products with filters
  const { data, isLoading, error } = useProducts({
    page,
    limit: 12,
    q: search || undefined,
    publish: publishFilter ? publishFilter === 'true' : undefined,
    category: categoryFilter || undefined,
  });

  // Delete product mutation
  const deleteProductMutation = useDeleteProduct();

  const getStockBadge = (stockStatus: string) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-800',
      low_stock: 'bg-yellow-100 text-yellow-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return styles[stockStatus as keyof typeof styles] || styles.out_of_stock;
  };

  const getStockLabel = (stockStatus: string) => {
    const labels = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    };
    return labels[stockStatus as keyof typeof labels] || 'Unknown';
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProductMutation.mutate(id);
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
        <Link
          href="/dashboard/products/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
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
            value={publishFilter}
            onChange={(e) => setPublishFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
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
              <Link
                href="/dashboard/products/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((product: Product) => {
                const imageUrl =
                  product.thumbnail_image?.url ||
                  product.gallery_images?.[0]?.url ||
                  'https://via.placeholder.com/400x300?text=No+Image';

                const imageAlt =
                  product.thumbnail_image?.alt ||
                  product.gallery_images?.[0]?.alt ||
                  product.name;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-48 bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover rounded-t-lg"
                        unoptimized

                      />
                      <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${getStockBadge(
                          product.stock_status
                        )}`}
                      >
                        {getStockLabel(product.stock_status)}
                      </span>
                      {product.is_featured && (
                        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate flex-1">
                          {product.name}
                        </h3>
                        {!product.publish && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                            Draft
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mb-2">
                        SKU: {product.sku}
                      </p>

                      {product.description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-bold text-gray-900">
                          {formatCurrency(product.unit_price)}
                        </span>
                        {product.discount && (
                          <span className="text-sm text-green-600 font-semibold">
                            -{product.discount.value}
                            {product.discount.type === 'percent' ? '%' : ' off'}
                          </span>
                        )}
                      </div>

                      {/* Stock Info */}
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span
                          className={`${product.quantity <=
                            (product.low_stock_quantity || 0)
                            ? 'text-red-600 font-semibold'
                            : 'text-gray-600'
                            }`}
                        >
                          Stock: {product.quantity} {product.unit}
                        </span>
                        {product.quantity <=
                          (product.low_stock_quantity || 0) &&
                          product.quantity > 0 && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              Low Stock
                            </span>
                          )}
                      </div>

                      {/* Category & Brand */}
                      {(product.category_snapshot || product.brand_snapshot) && (
                        <div className="flex flex-wrap gap-2 mb-4 text-xs">
                          {product.category_snapshot && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">
                              {product.category_snapshot.name}
                            </span>
                          )}
                          {product.brand_snapshot && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded">
                              {product.brand_snapshot.name}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/products/${product._id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deleteProductMutation.isPending}
                          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors disabled:opacity-50"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {data.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.meta.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.meta!.totalPages, p + 1))
                }
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
