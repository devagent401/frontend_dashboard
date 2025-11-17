'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function CreateProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        costPrice: '',
        stock: '',
        minStock: '',
        description: '',
        status: 'active',
        brand: '',
        weight: '',
        dimensions: '',
    });

    const [images, setImages] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your API
        console.log('Product data:', formData);
        console.log('Images:', images);
        // Redirect to products list
        router.push('/dashboard/products');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // In a real app, you'd upload these to a server and get URLs back
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

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
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Create New Product</h1>
                    <p className="text-[var(--color-textSecondary)] mt-1">
                        Add a new product to your inventory
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Basic Information</h2>
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
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="">Select a category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home & Garden">Home & Garden</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="Brand name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Status *
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
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
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Pricing & Inventory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
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
                                Cost Price
                            </label>
                            <input
                                type="number"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Minimum Stock Alert
                            </label>
                            <input
                                type="number"
                                name="minStock"
                                value={formData.minStock}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Images */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Product Images</h2>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block w-full cursor-pointer">
                            <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                                <Upload className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-2" />
                                <p className="text-sm text-[var(--color-text)] mb-1">Click to upload images</p>
                                <p className="text-xs text-[var(--color-textSecondary)]">PNG, JPG up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-[var(--color-border)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-[var(--color-error)] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Additional Details */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Additional Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Dimensions (L x W x H cm)
                            </label>
                            <input
                                type="text"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="e.g., 10 x 5 x 3"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        Create Product
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

