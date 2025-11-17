'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

interface CategoryOption {
    id: number;
    name: string;
    level: number;
}

// Flatten categories for dropdown
const flattenCategories = (categories: any[], level = 0): CategoryOption[] => {
    return categories.reduce((acc: CategoryOption[], cat) => {
        acc.push({ id: cat.id, name: cat.name, level });
        if (cat.children && cat.children.length > 0) {
            acc.push(...flattenCategories(cat.children, level + 1));
        }
        return acc;
    }, []);
};

// Sample categories for parent selection
const sampleCategories = [
    {
        id: 1,
        name: 'Electronics',
        children: [
            { id: 2, name: 'Computers', children: [] },
            { id: 5, name: 'Mobile Devices', children: [] }
        ]
    },
    {
        id: 8,
        name: 'Clothing',
        children: [
            { id: 9, name: "Men's Clothing", children: [] },
            { id: 13, name: "Women's Clothing", children: [] }
        ]
    },
    {
        id: 16,
        name: 'Home & Garden',
        children: []
    }
];

export default function CreateCategoryPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentId: '',
        image: '',
        metaTitle: '',
        metaDescription: '',
        isActive: true,
    });

    const [image, setImage] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your API
        console.log('Category data:', formData);
        // Redirect to categories list
        router.push('/dashboard/categories');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, name: value, slug }));
        } else if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setFormData(prev => ({ ...prev, image: imageUrl }));
        }
    };

    const removeImage = () => {
        setImage('');
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const categoryOptions = flattenCategories(sampleCategories);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/categories"
                    className="p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[var(--color-text)]" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Create New Category</h1>
                    <p className="text-[var(--color-textSecondary)] mt-1">
                        Add a new category to organize your products
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
                                Category Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="Enter category name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Slug *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="category-slug"
                            />
                            <p className="text-xs text-[var(--color-textSecondary)] mt-1">
                                Auto-generated from category name
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Parent Category
                            </label>
                            <select
                                name="parentId"
                                value={formData.parentId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="">None (Root Category)</option>
                                {categoryOptions.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {'—'.repeat(cat.level)} {cat.name}
                                    </option>
                                ))}
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
                                rows={3}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="Enter category description"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
                                />
                                <span className="text-sm font-medium text-[var(--color-text)]">
                                    Active (Category will be visible to customers)
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Category Image */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Category Image</h2>
                    
                    {!image ? (
                        <label className="block w-full cursor-pointer">
                            <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                                <Upload className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-2" />
                                <p className="text-sm text-[var(--color-text)] mb-1">Click to upload category image</p>
                                <p className="text-xs text-[var(--color-textSecondary)]">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="relative inline-block">
                            <img
                                src={image}
                                alt="Category preview"
                                className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-border)]"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-2 bg-[var(--color-error)] text-white rounded-full hover:opacity-90 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* SEO Settings */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">SEO Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleInputChange}
                                maxLength={60}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="Enter meta title"
                            />
                            <p className="text-xs text-[var(--color-textSecondary)] mt-1">
                                {formData.metaTitle.length}/60 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Meta Description
                            </label>
                            <textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleInputChange}
                                maxLength={160}
                                rows={3}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                placeholder="Enter meta description"
                            />
                            <p className="text-xs text-[var(--color-textSecondary)] mt-1">
                                {formData.metaDescription.length}/160 characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        Create Category
                    </button>
                    <Link
                        href="/dashboard/categories"
                        className="flex-1 px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface)] transition-colors font-medium text-center"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

