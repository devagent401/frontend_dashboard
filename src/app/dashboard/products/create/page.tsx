'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCreateProduct } from '@/hooks/useProducts';
import { useFileUploadWithProgress } from '@/hooks/useUpload';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { CreateProductInput, ProductImage } from '@/types/api';

export default function CreateProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { uploadFile, uploadProgress, isUploading } =
    useFileUploadWithProgress();

  // Fetch categories for dropdown
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    flat: true,
    status: 'active',
  });

  // Fetch brands for dropdown
  const { data: brandsData, isLoading: brandsLoading } = useBrands({
    status: 'active',
    limit: 100,
  });

  const [formData, setFormData] = useState<Partial<CreateProductInput>>({
    name: '',
    sku: '',
    unit: 'piece',
    unit_price: 0,
    description: '',
    quantity: 0,
    low_stock_quantity: 10,
    publish: false,
    is_featured: false,
    free_shipping: false,
    cash_on_delivery: true,
    is_todays_deal: false,
    tags: [],
  });

  const [thumbnailImage, setThumbnailImage] = useState<ProductImage | null>(
    null
  );
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.sku || !formData.unit_price) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare product data
    const productData: CreateProductInput = {
      name: formData.name,
      sku: formData.sku,
      unit: formData.unit || 'piece',
      unit_price: Number(formData.unit_price),
      description: formData.description,
      quantity: Number(formData.quantity) || 0,
      low_stock_quantity: Number(formData.low_stock_quantity) || 0,
      publish: formData.publish || false,
      is_featured: formData.is_featured || false,
      free_shipping: formData.free_shipping || false,
      cash_on_delivery: formData.cash_on_delivery || true,
      is_todays_deal: formData.is_todays_deal || false,
      tags: formData.tags,
      thumbnail_image: thumbnailImage || undefined,
      gallery_images: galleryImages.length > 0 ? galleryImages : undefined,
      category: formData.category,
      brand: formData.brand,
      shipping_cost: formData.shipping_cost
        ? Number(formData.shipping_cost)
        : undefined,
    };

    // Create product
    createProduct.mutate(productData, {
      onSuccess: () => {
        router.push('/dashboard/products');
      },
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);

    // Upload file
    const uploadedFile = await uploadFile(file);
    if (uploadedFile) {
      setThumbnailImage({
        url: uploadedFile.url,
        alt: formData.name || 'Product image',
      });
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...previews]);

    // Upload files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        setGalleryImages((prev) => [
          ...prev,
          {
            url: uploadedFile.url,
            alt: `${formData.name} - Image ${prev.length + 1}`,
            order: prev.length,
          },
        ]);
      }
    }
  };

  const removeThumbnail = () => {
    setThumbnailImage(null);
    setThumbnailPreview('');
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--color-text)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Create New Product
          </h1>
          <p className="text-[var(--color-textSecondary)] mt-1">
            Add a new product to your inventory
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="e.g., PRD-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
              >
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="liter">Liter</option>
                <option value="meter">Meter</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
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

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Brand
              </label>
              <select
                name="brand"
                value={formData.brand || ''}
                onChange={handleInputChange}
                disabled={brandsLoading}
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)] disabled:opacity-50"
              >
                <option value="">Select a brand (optional)</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {brandsLoading && (
                <p className="text-xs text-[var(--color-textSecondary)] mt-1">
                  Loading brands...
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="Enter product description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="e.g., electronics, gadgets, popular"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Pricing & Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Unit Price *
              </label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Shipping Cost
              </label>
              <input
                type="number"
                name="shipping_cost"
                value={formData.shipping_cost || ''}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Low Stock Alert Level
              </label>
              <input
                type="number"
                name="low_stock_quantity"
                value={formData.low_stock_quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Product Images
          </h2>

          {/* Thumbnail Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Thumbnail Image
            </label>
            {!thumbnailPreview ? (
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-2" />
                  <p className="text-sm text-[var(--color-text)] mb-1">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-[var(--color-textSecondary)]">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            ) : (
              <div className="relative inline-block w-48 h-48">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover rounded-lg border border-[var(--color-border)]"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 p-1 bg-[var(--color-error)] text-white rounded-full hover:bg-red-700 transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Gallery Upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Gallery Images
            </label>
            <label className="block w-full cursor-pointer mb-4">
              <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                <Upload className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-2" />
                <p className="text-sm text-[var(--color-text)] mb-1">
                  Click to upload gallery images
                </p>
                <p className="text-xs text-[var(--color-textSecondary)]">
                  PNG, JPG up to 10MB (max 20 images)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            {/* Gallery Preview */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative group w-full h-32">
                    <Image
                      src={preview}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover rounded-lg border border-[var(--color-border)]"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      disabled={isUploading}
                      className="absolute top-2 right-2 p-1 bg-[var(--color-error)] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
                <span className="text-sm text-[var(--color-text)]">
                  Uploading... {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Product Settings
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="publish"
                checked={formData.publish}
                onChange={handleInputChange}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text)]">
                Publish product (make it visible to customers)
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text)]">
                Featured product
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="free_shipping"
                checked={formData.free_shipping}
                onChange={handleInputChange}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text)]">
                Free shipping
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="cash_on_delivery"
                checked={formData.cash_on_delivery}
                onChange={handleInputChange}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text)]">
                Cash on delivery available
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_todays_deal"
                checked={formData.is_todays_deal}
                onChange={handleInputChange}
                className="w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text)]">
                Today's deal
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createProduct.isPending || isUploading}
            className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {createProduct.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {createProduct.isPending ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/dashboard/products"
            className="flex-1 px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface)] transition-colors font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
