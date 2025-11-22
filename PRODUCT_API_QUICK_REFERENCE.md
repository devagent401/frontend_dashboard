# Product API Quick Reference

Quick reference guide for common product operations.

## Import Statements

```typescript
// Hooks
import { 
  useProducts, 
  useProduct, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useAdjustStock,
  useLowStockProducts 
} from '@/hooks/useProducts';

// Upload hooks
import { 
  useUploadFile, 
  useFileUploadWithProgress 
} from '@/hooks/useUpload';

// Types
import type { 
  Product, 
  CreateProductInput, 
  UpdateProductInput,
  ProductQueryParams,
  StockAdjustment 
} from '@/types/api';
```

## Common Operations

### Get Products List

```typescript
const { data, isLoading, error } = useProducts({
  page: 1,
  limit: 20,
  q: 'search term',        // Text search
  category: 'cat-id',      // Filter by category
  brand: 'brand-id',       // Filter by brand
  min_price: 10,           // Minimum price
  max_price: 100,          // Maximum price
  publish: true,           // Published only
  featured: true,          // Featured only
  sortBy: 'unit_price',    // Sort field
  order: 'asc',            // Sort order
});

// Access data
const products = data?.data;           // Product array
const totalPages = data?.meta?.totalPages;
const total = data?.meta?.total;
```

### Get Single Product

```typescript
const { data: product, isLoading } = useProduct(productId);
```

### Get Low Stock Products

```typescript
const { data: lowStockProducts } = useLowStockProducts();
```

### Create Product

```typescript
const createProduct = useCreateProduct();

createProduct.mutate({
  name: 'Product Name',
  sku: 'SKU-001',
  unit: 'piece',
  unit_price: 99.99,
  quantity: 100,
  low_stock_quantity: 10,
  publish: true,
  description: 'Product description',
  thumbnail_image: {
    url: 'https://...',
    alt: 'Product image',
  },
  tags: ['electronics', 'gadgets'],
});
```

### Update Product

```typescript
const updateProduct = useUpdateProduct();

updateProduct.mutate({
  id: productId,
  data: {
    name: 'Updated Name',
    unit_price: 89.99,
    quantity: 150,
  },
});
```

### Delete Product

```typescript
const deleteProduct = useDeleteProduct();

deleteProduct.mutate(productId);
```

### Adjust Stock

```typescript
const adjustStock = useAdjustStock();

// Stock In (Add)
adjustStock.mutate({
  id: productId,
  adjustment: {
    change: 50,
    type: 'in',
    reason: 'Restocked from supplier',
    reference: 'PO-12345',
  },
});

// Stock Out (Remove)
adjustStock.mutate({
  id: productId,
  adjustment: {
    change: 10,
    type: 'out',
    reason: 'Damaged items',
  },
});

// Direct Adjustment (Set to specific value)
adjustStock.mutate({
  id: productId,
  adjustment: {
    change: 100,
    type: 'adjustment',
    reason: 'Inventory correction',
  },
});
```

### Upload File

```typescript
// Simple upload
const uploadFile = useUploadFile();

uploadFile.mutate(file, {
  onSuccess: (uploadedFile) => {
    console.log('URL:', uploadedFile.url);
    console.log('Preview:', uploadedFile.previewUrl);
  },
});

// Upload with progress
const { uploadFile, uploadProgress, isUploading } = useFileUploadWithProgress();

const handleUpload = async (file: File) => {
  const uploadedFile = await uploadFile(file);
  // Progress available in uploadProgress (0-100)
};
```

## Complete Form Example

### Product Create Form

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProduct } from '@/hooks/useProducts';
import { useFileUploadWithProgress } from '@/hooks/useUpload';
import type { CreateProductInput, ProductImage } from '@/types/api';

export default function CreateProductForm() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { uploadFile, isUploading } = useFileUploadWithProgress();

  const [formData, setFormData] = useState<Partial<CreateProductInput>>({
    name: '',
    sku: '',
    unit: 'piece',
    unit_price: 0,
    quantity: 0,
    publish: false,
  });
  
  const [thumbnail, setThumbnail] = useState<ProductImage | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploaded = await uploadFile(file);
    if (uploaded) {
      setThumbnail({
        url: uploaded.url,
        alt: formData.name || 'Product image',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: CreateProductInput = {
      name: formData.name!,
      sku: formData.sku!,
      unit: formData.unit!,
      unit_price: formData.unit_price!,
      quantity: formData.quantity,
      publish: formData.publish,
      thumbnail_image: thumbnail || undefined,
    };

    createProduct.mutate(productData, {
      onSuccess: () => router.push('/dashboard/products'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Product name"
        required
      />
      
      <input
        type="text"
        value={formData.sku}
        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        placeholder="SKU"
        required
      />
      
      <input
        type="number"
        value={formData.unit_price}
        onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
        placeholder="Price"
        required
        step="0.01"
      />
      
      <input
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        disabled={isUploading}
      />
      
      <button 
        type="submit" 
        disabled={createProduct.isPending || isUploading}
      >
        {createProduct.isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

## Mutation States

All mutation hooks provide these states:

```typescript
const mutation = useCreateProduct(); // or any mutation hook

mutation.mutate(data);              // Trigger mutation
mutation.isPending                   // Is loading
mutation.isError                     // Has error
mutation.isSuccess                   // Was successful
mutation.error                       // Error object
mutation.data                        // Response data
mutation.reset()                     // Reset state
```

## Product Fields Reference

### Required Fields
- `name` - Product name
- `sku` - Stock Keeping Unit (unique)
- `unit` - Unit of measurement
- `unit_price` - Price per unit

### Common Fields
- `description` - Product description
- `quantity` - Stock quantity
- `low_stock_quantity` - Low stock alert level
- `category` - Category ID
- `brand` - Brand ID
- `publish` - Published status
- `is_featured` - Featured status
- `thumbnail_image` - Main product image
- `gallery_images` - Additional images
- `tags` - Product tags array

### Stock Status
Automatically calculated based on quantity:
- `in_stock` - quantity > low_stock_quantity
- `low_stock` - quantity > 0 && quantity <= low_stock_quantity
- `out_of_stock` - quantity === 0

## Error Handling

```typescript
const createProduct = useCreateProduct();

createProduct.mutate(data, {
  onSuccess: (product) => {
    console.log('Success:', product);
  },
  onError: (error: any) => {
    console.error('Error:', error.response?.data?.message);
  },
});

// Or check state
if (createProduct.isError) {
  const errorMessage = createProduct.error?.response?.data?.message;
}
```

## Loading States

```typescript
const { data, isLoading, isFetching } = useProducts();

if (isLoading) return <LoadingSpinner />;
if (isFetching) return <RefreshingIndicator />;

// For mutations
const createProduct = useCreateProduct();

<button disabled={createProduct.isPending}>
  {createProduct.isPending ? 'Creating...' : 'Create'}
</button>
```

## Caching & Refetching

React Query handles caching automatically, but you can control it:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Manual refetch
queryClient.invalidateQueries({ queryKey: ['products'] });

// Refetch specific product
queryClient.invalidateQueries({ queryKey: ['products', productId] });

// Set data manually
queryClient.setQueryData(['products', productId], newProductData);
```

## Common Patterns

### Pagination Component

```typescript
function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div>
      <button 
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button 
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
```

### Search with Debounce

```typescript
import { useState, useEffect } from 'react';

function ProductSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data } = useProducts({ q: debouncedSearch });

  return (
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Conditional Fetching

```typescript
// Only fetch if user is authenticated
const { data } = useProduct(productId, isAuthenticated);

// Only fetch when needed
const [enabled, setEnabled] = useState(false);
const { data } = useProduct(productId, enabled);
```

## Tips & Tricks

1. **Always handle loading states** for better UX
2. **Use optimistic updates** for instant feedback
3. **Debounce search inputs** to reduce API calls
4. **Cache aggressively** with React Query
5. **Use TypeScript** for better type safety
6. **Handle errors gracefully** with toast notifications
7. **Test with different data** to ensure robustness

## Quick Debug

```typescript
// Log query state
const query = useProducts();
console.log({
  isLoading: query.isLoading,
  isError: query.isError,
  data: query.data,
  error: query.error,
});

// Log mutation state
const mutation = useCreateProduct();
console.log({
  isPending: mutation.isPending,
  isError: mutation.isError,
  isSuccess: mutation.isSuccess,
});
```

---

For detailed documentation, see: `PRODUCT_API_INTEGRATION.md`

