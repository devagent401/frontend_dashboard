'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Archive,
  Calendar,
  TrendingUp,
  AlertCircle,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAdjustStock,
} from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { UpdateProductInput, StockAdjustment } from '@/types/api';

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { data: product, isLoading, error } = useProduct(resolvedParams.id);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const adjustStock = useAdjustStock();
  
  // Fetch categories for dropdown when editing
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    flat: true,
    status: 'active',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateProductInput>({});
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState<StockAdjustment>({
    change: 0,
    type: 'in',
    reason: '',
  });

  useEffect(() => {
    if (product && !isEditing) {
      setEditData({
        name: product.name,
        description: product.description,
        unit_price: product.unit_price,
        quantity: product.quantity,
        low_stock_quantity: product.low_stock_quantity,
        publish: product.publish,
        is_featured: product.is_featured,
        category: product.category,
      });
    }
  }, [product, isEditing]);

  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading product. Please try again.
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct.mutate(resolvedParams.id, {
        onSuccess: () => {
          router.push('/dashboard/products');
        },
      });
    }
  };

  const handleUpdate = async () => {
    updateProduct.mutate(
      { id: resolvedParams.id, data: editData },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleStockAdjustment = async () => {
    adjustStock.mutate(
      { id: resolvedParams.id, adjustment: stockAdjustment },
      {
        onSuccess: () => {
          setShowStockModal(false);
          setStockAdjustment({ change: 0, type: 'in', reason: '' });
        },
      }
    );
  };

  const stockStatus = product.stock_status;
  const stockColor =
    stockStatus === 'out_of_stock'
      ? 'error'
      : stockStatus === 'low_stock'
      ? 'warning'
      : 'success';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">
              {product.name}
            </h1>
            <p className="text-[var(--color-textSecondary)] mt-1">
              SKU: {product.sku}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface)] transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteProduct.isPending}
                className="px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {deleteProduct.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                disabled={updateProduct.isPending}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {updateProduct.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface)] transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <div className="relative aspect-video bg-[var(--color-background)] rounded-lg overflow-hidden mb-4">
              <Image
                src={
                  product.thumbnail_image?.url ||
                  product.gallery_images?.[0]?.url ||
                  '/placeholder.png'
                }
                alt={product.thumbnail_image?.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                unoptimized
              />
            </div>
            {/* Thumbnail Gallery */}
            {product.gallery_images && product.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.gallery_images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-[var(--color-border)]"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Product Information
            </h2>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-textSecondary)] mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-textSecondary)] mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-textSecondary)] mb-2">
                    Description
                  </h3>
                  <p className="text-[var(--color-text)]">
                    {product.description || 'No description available'}
                  </p>
                </div>
              )}

              {isEditing && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-[var(--color-textSecondary)] mb-2 block">
                    Category
                  </label>
                  <select
                    value={editData.category || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                    disabled={categoriesLoading}
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)] disabled:opacity-50"
                  >
                    <option value="">Select a category (optional)</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.icon && `${category.icon} `}
                        {category.name}
                        {category.level > 0 && ` (Level ${category.level})`}
                      </option>
                    ))}
                  </select>
                  {categoriesLoading && (
                    <p className="text-xs text-[var(--color-textSecondary)] mt-1">
                      Loading categories...
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                {product.category_snapshot && !isEditing && (
                  <div>
                    <p className="text-sm text-[var(--color-textSecondary)]">
                      Category
                    </p>
                    <p className="text-[var(--color-text)] font-medium">
                      {product.category_snapshot.name}
                    </p>
                  </div>
                )}
                {product.brand_snapshot && (
                  <div>
                    <p className="text-sm text-[var(--color-textSecondary)]">
                      Brand
                    </p>
                    <p className="text-[var(--color-text)] font-medium">
                      {product.brand_snapshot.name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[var(--color-textSecondary)]">
                    Unit
                  </p>
                  <p className="text-[var(--color-text)] font-medium">
                    {product.unit}
                  </p>
                </div>
                {product.barcode && (
                  <div>
                    <p className="text-sm text-[var(--color-textSecondary)]">
                      Barcode
                    </p>
                    <p className="text-[var(--color-text)] font-medium">
                      {product.barcode}
                    </p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <p className="text-sm text-[var(--color-textSecondary)] mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Details */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Status
            </h2>
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editData.publish}
                      onChange={(e) =>
                        setEditData({ ...editData, publish: e.target.checked })
                      }
                      className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">
                      Published
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editData.is_featured}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          is_featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text)]">
                      Featured
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--color-textSecondary)]">
                      Product Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.publish
                          ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                          : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                      }`}
                    >
                      {product.publish ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--color-textSecondary)]">
                      Stock Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-${stockColor})]/10 text-[var(--color-${stockColor})]`}
                    >
                      {stockStatus
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                  {product.is_featured && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--color-textSecondary)]">
                        Featured
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Yes
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing
            </h2>
            <div className="space-y-4">
              {isEditing ? (
                <div>
                  <label className="text-sm font-medium text-[var(--color-textSecondary)] mb-2 block">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editData.unit_price || 0}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        unit_price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[var(--color-textSecondary)]">
                    Unit Price
                  </p>
                  <p className="text-3xl font-bold text-[var(--color-text)]">
                    ${product.unit_price.toFixed(2)}
                  </p>
                </div>
              )}

              {product.discount && (
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-textSecondary)]">
                    Discount
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    -{product.discount.value}
                    {product.discount.type === 'percent' ? '%' : ' off'}
                  </p>
                </div>
              )}

              {product.shipping_cost !== undefined && (
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-textSecondary)]">
                    Shipping Cost
                  </p>
                  <p className="text-lg font-semibold text-[var(--color-text)]">
                    {product.free_shipping
                      ? 'Free'
                      : `$${product.shipping_cost.toFixed(2)}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Inventory
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setShowStockModal(true)}
                  className="text-sm px-3 py-1 bg-[var(--color-primary)] text-white rounded hover:opacity-90 transition-opacity"
                >
                  Adjust
                </button>
              )}
            </div>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-textSecondary)] mb-2 block">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={editData.quantity || 0}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-textSecondary)] mb-2 block">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      value={editData.low_stock_quantity || 0}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          low_stock_quantity: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--color-textSecondary)]">
                      Current Stock
                    </span>
                    <span className="text-2xl font-bold text-[var(--color-text)]">
                      {product.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-textSecondary)]">
                      Low Stock Alert
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {product.low_stock_quantity || 0}
                    </span>
                  </div>
                  {product.quantity <= (product.low_stock_quantity || 0) &&
                    product.quantity > 0 && (
                      <div className="flex items-start gap-2 p-3 bg-[var(--color-warning)]/10 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-[var(--color-warning)] mt-0.5" />
                        <p className="text-xs text-[var(--color-warning)]">
                          Stock is running low. Consider restocking soon.
                        </p>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Dates
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--color-textSecondary)]">
                  Created
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-textSecondary)]">
                  Last Updated
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-surface)] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Adjust Stock
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Adjustment Type
                </label>
                <select
                  value={stockAdjustment.type}
                  onChange={(e) =>
                    setStockAdjustment({
                      ...stockAdjustment,
                      type: e.target.value as 'in' | 'out' | 'adjustment',
                    })
                  }
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                >
                  <option value="in">Stock In (Add)</option>
                  <option value="out">Stock Out (Remove)</option>
                  <option value="adjustment">Adjustment (Set)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={stockAdjustment.change}
                  onChange={(e) =>
                    setStockAdjustment({
                      ...stockAdjustment,
                      change: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Reason (optional)
                </label>
                <textarea
                  value={stockAdjustment.reason}
                  onChange={(e) =>
                    setStockAdjustment({
                      ...stockAdjustment,
                      reason: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                  placeholder="Enter reason for adjustment"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleStockAdjustment}
                disabled={adjustStock.isPending || stockAdjustment.change === 0}
                className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adjustStock.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setStockAdjustment({ change: 0, type: 'in', reason: '' });
                }}
                className="flex-1 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
