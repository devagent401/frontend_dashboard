'use client';

import React from 'react';
import { ArrowLeft, Edit, Trash2, Package, DollarSign, Archive, Calendar, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

// Sample product data
const getProductById = (id: string) => {
    return {
        id: parseInt(id),
        name: 'Wireless Headphones Premium',
        sku: 'WH-001',
        category: 'Electronics',
        subcategory: 'Audio',
        brand: 'TechSound',
        price: 99.99,
        costPrice: 65.00,
        stock: 45,
        minStock: 10,
        status: 'active',
        description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
        createdAt: '2024-01-15',
        updatedAt: '2024-02-20',
        weight: 0.25,
        dimensions: '20 x 18 x 8',
        images: [
            'https://via.placeholder.com/600x400?text=Product+Image+1',
            'https://via.placeholder.com/600x400?text=Product+Image+2',
            'https://via.placeholder.com/600x400?text=Product+Image+3',
        ],
        totalSold: 156,
        revenue: 15593.44,
        specifications: {
            'Battery Life': '30 hours',
            'Connectivity': 'Bluetooth 5.0',
            'Driver Size': '40mm',
            'Frequency Response': '20Hz - 20kHz',
            'Impedance': '32 Ohm',
            'Weight': '250g',
        }
    };
};

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const product = getProductById(resolvedParams.id);
    const [mainImage, setMainImage] = React.useState(product.images[0]);

    const profitMargin = ((product.price - product.costPrice) / product.price * 100).toFixed(1);
    const stockStatus = product.stock === 0 ? 'Out of Stock' : product.stock <= product.minStock ? 'Low Stock' : 'In Stock';
    const stockColor = product.stock === 0 ? 'error' : product.stock <= product.minStock ? 'warning' : 'success';

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
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">{product.name}</h1>
                        <p className="text-[var(--color-textSecondary)] mt-1">
                            SKU: {product.sku}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface)] transition-colors flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </Link>
                    <button className="px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <div className="aspect-video bg-[var(--color-background)] rounded-lg overflow-hidden mb-4">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        mainImage === image
                                            ? 'border-[var(--color-primary)]'
                                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Product Information</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-[var(--color-textSecondary)] mb-2">Description</h3>
                                <p className="text-[var(--color-text)]">{product.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                                <div>
                                    <p className="text-sm text-[var(--color-textSecondary)]">Category</p>
                                    <p className="text-[var(--color-text)] font-medium">{product.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-textSecondary)]">Subcategory</p>
                                    <p className="text-[var(--color-text)] font-medium">{product.subcategory}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-textSecondary)]">Brand</p>
                                    <p className="text-[var(--color-text)] font-medium">{product.brand}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-textSecondary)]">Weight</p>
                                    <p className="text-[var(--color-text)] font-medium">{product.weight} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-textSecondary)]">Dimensions (L×W×H)</p>
                                    <p className="text-[var(--color-text)] font-medium">{product.dimensions} cm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center p-3 bg-[var(--color-background)] rounded-lg">
                                    <span className="text-sm text-[var(--color-textSecondary)]">{key}</span>
                                    <span className="text-sm text-[var(--color-text)] font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Stats & Details */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Status</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--color-textSecondary)]">Product Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    product.status === 'active'
                                        ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                                        : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                                }`}>
                                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--color-textSecondary)]">Stock Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-${stockColor})]/10 text-[var(--color-${stockColor})]`}>
                                    {stockStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Pricing
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[var(--color-textSecondary)]">Selling Price</p>
                                <p className="text-3xl font-bold text-[var(--color-text)]">${product.price}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                                <div>
                                    <p className="text-xs text-[var(--color-textSecondary)]">Cost Price</p>
                                    <p className="text-lg font-semibold text-[var(--color-text)]">${product.costPrice}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--color-textSecondary)]">Profit Margin</p>
                                    <p className="text-lg font-semibold text-[var(--color-success)]">{profitMargin}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <Archive className="w-5 h-5" />
                            Inventory
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--color-textSecondary)]">Current Stock</span>
                                <span className="text-2xl font-bold text-[var(--color-text)]">{product.stock}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                                <span className="text-xs text-[var(--color-textSecondary)]">Minimum Stock Alert</span>
                                <span className="text-sm font-medium text-[var(--color-text)]">{product.minStock}</span>
                            </div>
                            {product.stock <= product.minStock && product.stock > 0 && (
                                <div className="flex items-start gap-2 p-3 bg-[var(--color-warning)]/10 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-[var(--color-warning)] mt-0.5" />
                                    <p className="text-xs text-[var(--color-warning)]">
                                        Stock is running low. Consider restocking soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sales Performance */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Sales Performance
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[var(--color-textSecondary)]">Total Sold</p>
                                <p className="text-2xl font-bold text-[var(--color-text)]">{product.totalSold}</p>
                            </div>
                            <div className="pt-4 border-t border-[var(--color-border)]">
                                <p className="text-sm text-[var(--color-textSecondary)]">Total Revenue</p>
                                <p className="text-2xl font-bold text-[var(--color-success)]">${product.revenue.toFixed(2)}</p>
                            </div>
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
                                <p className="text-sm text-[var(--color-textSecondary)]">Created</p>
                                <p className="text-sm font-medium text-[var(--color-text)]">{product.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-textSecondary)]">Last Updated</p>
                                <p className="text-sm font-medium text-[var(--color-text)]">{product.updatedAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

