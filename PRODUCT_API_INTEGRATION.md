# Product API Integration Documentation

This document provides comprehensive information about the Product API integration in the frontend dashboard.

## Overview

The Product API integration follows best practices with a clean separation of concerns:
- **Types**: TypeScript interfaces matching the API documentation
- **Services**: API client methods for HTTP requests
- **Hooks**: React hooks for state management and mutations
- **Components**: UI pages using the hooks

## Architecture

```
┌─────────────────────────────────────────────┐
│           React Components                   │
│  (pages, UI components)                      │
└──────────────┬──────────────────────────────┘
               │ uses
┌──────────────▼──────────────────────────────┐
│           Custom Hooks                       │
│  (useProducts, useUpload)                    │
│  - State management                          │
│  - React Query integration                   │
│  - Toast notifications                       │
└──────────────┬──────────────────────────────┘
               │ calls
┌──────────────▼──────────────────────────────┐
│           Services                           │
│  (productsService, uploadService)            │
│  - API methods                               │
│  - Data transformation                       │
└──────────────┬──────────────────────────────┘
               │ uses
┌──────────────▼──────────────────────────────┐
│           API Client                         │
│  (apiClient from @/lib/api-client)           │
│  - HTTP requests                             │
│  - Authentication                            │
│  - Error handling                            │
└──────────────┬──────────────────────────────┘
               │ calls
┌──────────────▼──────────────────────────────┐
│           Backend API                        │
│  /api/v1/products                            │
│  /api/v1/upload                              │
└─────────────────────────────────────────────┘
```

## File Structure

```
frontend_Dashboard/
├── src/
│   ├── types/
│   │   └── api.ts                      # TypeScript type definitions
│   ├── services/
│   │   ├── products.service.ts         # Product API service
│   │   └── upload.service.ts           # Upload API service
│   ├── hooks/
│   │   ├── useProducts.ts              # Product hooks
│   │   └── useUpload.ts                # Upload hooks
│   ├── app/
│   │   └── dashboard/
│   │       └── products/
│   │           ├── page.tsx            # Products list page
│   │           ├── create/
│   │           │   └── page.tsx        # Create product page
│   │           └── [id]/
│   │               └── page.tsx        # Product detail/edit page
│   └── lib/
│       └── api-client.ts               # Base API client
```

## TypeScript Types

### Product Types

All product types match the API documentation exactly:

```typescript
interface Product {
  _id: string;
  name: string;
  sku: string;
  unit: string;
  unit_price: number;
  quantity: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  // ... and more fields
}

interface CreateProductInput {
  name: string;
  sku: string;
  unit: string;
  unit_price: number;
  // ... other fields
}
```

### Upload Types

```typescript
interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  previewUrl: string;
  category: FileCategory;
  // ... other fields
}
```

## Services

### Products Service

Located at: `src/services/products.service.ts`

**Available Methods:**

```typescript
// Get all products with filters
getProducts(params?: ProductQueryParams): Promise<ApiResponse<Product[]>>

// Get single product by ID
getProductById(id: string): Promise<Product>

// Get product by slug
getProductBySlug(slug: string): Promise<Product>

// Get product by barcode
getProductByBarcode(barcode: string): Promise<Partial<Product>>

// Get low stock products
getLowStockProducts(): Promise<Product[]>

// Create product
createProduct(data: CreateProductInput): Promise<Product>

// Update product
updateProduct(id: string, data: UpdateProductInput): Promise<Product>

// Delete product
deleteProduct(id: string): Promise<void>

// Adjust stock
adjustStock(id: string, adjustment: StockAdjustment): Promise<StockAdjustmentResponse>
```

### Upload Service

Located at: `src/services/upload.service.ts`

**Available Methods:**

```typescript
// Upload single file
uploadFile(file: File): Promise<UploadedFile>

// Upload multiple files
uploadMultipleFiles(files: File[]): Promise<{ files: UploadedFile[]; count: number }>

// Get all files
getFiles(params?: UploadQueryParams): Promise<ApiResponse<UploadedFile[]>>

// Get file by ID
getFileById(id: string): Promise<UploadedFile>

// Get preview URL
getPreviewUrl(filename: string): string

// Download file
downloadFile(id: string, originalName: string): Promise<void>

// Update file
updateFile(id: string, file: File): Promise<UploadedFile>

// Delete file
deleteFile(id: string): Promise<void>
```

## Custom Hooks

### Product Hooks

Located at: `src/hooks/useProducts.ts`

#### useProducts

Fetch all products with filters:

```typescript
const { data, isLoading, error } = useProducts({
  page: 1,
  limit: 20,
  q: 'search term',
  category: 'category-id',
  min_price: 10,
  max_price: 100,
  publish: true,
  sortBy: 'unit_price',
  order: 'asc',
});
```

#### useProduct

Fetch single product:

```typescript
const { data: product, isLoading, error } = useProduct(productId);
```

#### useCreateProduct

Create a new product:

```typescript
const createProduct = useCreateProduct();

createProduct.mutate(productData, {
  onSuccess: (product) => {
    console.log('Product created:', product);
  },
});
```

#### useUpdateProduct

Update existing product:

```typescript
const updateProduct = useUpdateProduct();

updateProduct.mutate({
  id: productId,
  data: { name: 'Updated Name', unit_price: 99.99 },
});
```

#### useDeleteProduct

Delete a product:

```typescript
const deleteProduct = useDeleteProduct();

deleteProduct.mutate(productId);
```

#### useAdjustStock

Adjust product stock:

```typescript
const adjustStock = useAdjustStock();

adjustStock.mutate({
  id: productId,
  adjustment: {
    change: 10,
    type: 'in',
    reason: 'Restocked from supplier',
  },
});
```

#### useProductOperations

Combined hook with all operations:

```typescript
const {
  products,
  product,
  lowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  isLoading,
} = useProductOperations(productId);
```

### Upload Hooks

Located at: `src/hooks/useUpload.ts`

#### useUploadFile

Upload a single file:

```typescript
const uploadFile = useUploadFile();

uploadFile.mutate(file, {
  onSuccess: (uploadedFile) => {
    console.log('File uploaded:', uploadedFile.url);
  },
});
```

#### useFileUploadWithProgress

Upload with progress tracking:

```typescript
const { uploadFile, uploadProgress, isUploading } = useFileUploadWithProgress();

const uploadedFile = await uploadFile(file);
// Progress is available in uploadProgress (0-100)
```

## Usage Examples

### 1. Fetching Products List

```typescript
'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useProducts({
    page,
    limit: 20,
    q: search,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      
      <div className="grid grid-cols-4 gap-4">
        {data?.data.map((product) => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>${product.unit_price}</p>
            <p>Stock: {product.quantity}</p>
          </div>
        ))}
      </div>

      {data?.meta && (
        <div>
          Page {data.meta.page} of {data.meta.totalPages}
        </div>
      )}
    </div>
  );
}
```

### 2. Creating a Product with Image Upload & Preview

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCreateProduct } from '@/hooks/useProducts';
import { useFileUploadWithProgress } from '@/hooks/useUpload';

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unit: 'piece',
    unit_price: 0,
  });

  const createProduct = useCreateProduct();
  const { uploadFile, uploadProgress, isUploading } = useFileUploadWithProgress();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedFile = await uploadFile(file);
    if (uploadedFile) {
      // Use the uploaded file URL in product creation
      setFormData((prev) => ({
        ...prev,
        thumbnail_image: {
          url: uploadedFile.url,
          alt: formData.name,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate(formData);
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
      
      {/* Thumbnail upload */}
      <input
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        disabled={isUploading}
      />

      {/* Thumbnail preview (matches /dashboard/products/create implementation) */}
      {formData.thumbnail_image?.url && (
        <div className="relative mt-4 w-48 h-48">
          <Image
            src={formData.thumbnail_image.url}
            alt={formData.thumbnail_image.alt || formData.name}
            fill
            className="object-cover rounded-lg border border-[var(--color-border)]"
            // Important for local dev: avoid Next.js optimization issues
            unoptimized
          />
        </div>
      )}
      
      {isUploading && <div>Uploading... {uploadProgress}%</div>}
      
      <button type="submit" disabled={createProduct.isPending}>
        Create Product
      </button>
    </form>
  );
}
```

### 2.1. Product Card Image Preview (Products `page.tsx`)

The products list page (`src/app/dashboard/products/page.tsx`) uses `next/image` with `fill` and **`unoptimized`** to reliably display images coming from the backend upload API:

```tsx
// Inside the product card
<div className="relative w-full h-48">
  <Image
    src={
      product.thumbnail_image?.url ||
      product.gallery_images?.[0]?.url ||
      '/placeholder.png'
    }
    alt={product.thumbnail_image?.alt || product.name}
    fill
    className="object-cover rounded-t-lg"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    // Critical for local dev: renders the backend URL directly instead of via /_next/image
    unoptimized
  />
</div>
```

If you forget the `unoptimized` prop during local development, `next/image` will try to proxy your URL through `/_next/image?...`, which often results in the image not showing even though the URL works directly in the browser.

### 3. Updating a Product

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading } = useProduct(params.id);
  const updateProduct = useUpdateProduct();
  
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (product) {
      setEditData({
        name: product.name,
        unit_price: product.unit_price,
        quantity: product.quantity,
      });
    }
  }, [product]);

  const handleUpdate = () => {
    updateProduct.mutate({
      id: params.id,
      data: editData,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <input
        value={editData.name}
        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
      />
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
}
```

### 4. Stock Adjustment

```typescript
'use client';

import { useAdjustStock } from '@/hooks/useProducts';

export default function StockAdjustmentModal({ productId }: { productId: string }) {
  const adjustStock = useAdjustStock();

  const handleStockIn = () => {
    adjustStock.mutate({
      id: productId,
      adjustment: {
        change: 50,
        type: 'in',
        reason: 'Restocked from supplier',
        reference: 'PO-12345',
      },
    });
  };

  const handleStockOut = () => {
    adjustStock.mutate({
      id: productId,
      adjustment: {
        change: 10,
        type: 'out',
        reason: 'Damaged items',
      },
    });
  };

  return (
    <div>
      <button onClick={handleStockIn}>Add Stock (50)</button>
      <button onClick={handleStockOut}>Remove Stock (10)</button>
    </div>
  );
}
```

## Features

### ✅ Complete CRUD Operations
- Create, Read, Update, Delete products
- Advanced filtering and pagination
- Search functionality

### ✅ Stock Management
- Adjust stock with reason tracking
- Low stock alerts
- Stock status (in_stock, low_stock, out_of_stock)

### ✅ File Upload Integration
- Single and multiple file uploads
- Progress tracking
- Image preview
- Drag and drop support (can be added)

### ✅ Type Safety
- Full TypeScript support
- Type inference in hooks
- Compile-time error checking

### ✅ Error Handling
- Toast notifications for success/error
- Loading states
- Retry logic in React Query

### ✅ Caching & Performance
- React Query caching
- Automatic refetching
- Optimistic updates
- Stale-while-revalidate

### ✅ Authentication
- Automatic token management
- Token refresh on 401
- Redirect to login when needed

## Best Practices Implemented

1. **Separation of Concerns**: Clear separation between API calls, state management, and UI
2. **Type Safety**: Full TypeScript coverage with strict types
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Loading States**: Proper loading states for better UX
5. **Caching**: Smart caching strategy with React Query
6. **Code Reusability**: Reusable hooks and services
7. **Clean Code**: Well-documented, maintainable code
8. **Performance**: Optimized with pagination, lazy loading, and caching

## Environment Variables

Make sure to set the following environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## API Endpoints Used

All endpoints from the API documentation are implemented:

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/slug/:slug` - Get product by slug
- `GET /products/barcode/:barcode` - Get product by barcode
- `GET /products/stock/low` - Get low stock products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/:id/stock` - Adjust stock

- `POST /upload` - Upload single file
- `POST /upload/multiple` - Upload multiple files
- `GET /upload` - Get all files
- `GET /upload/:id` - Get file by ID
- `GET /upload/preview/:filename` - Preview file
- `GET /upload/download/:id` - Download file
- `PUT /upload/:id` - Update file
- `DELETE /upload/:id` - Delete file

## Troubleshooting

### Products not loading
- Check if API_URL is set correctly
- Verify authentication token is valid
- Check browser console for errors
- Check network tab for API responses

### Upload failing
- Ensure file size is within limits
- Check file type is supported
- Verify Content-Type header is set correctly

### Type errors
- Run `npm run build` to check for TypeScript errors
- Ensure all types are imported correctly

## Future Enhancements

Potential improvements that can be added:

1. **Bulk Operations**: Bulk update/delete products
2. **Export/Import**: CSV import/export
3. **Advanced Filters**: More filter options
4. **Product Variants**: Support for product variants
5. **Image Optimization**: Automatic image resizing
6. **Offline Support**: PWA with offline capabilities
7. **Real-time Updates**: WebSocket integration for live updates
8. **Advanced Search**: Full-text search with Elasticsearch

## Support

For issues or questions, refer to:
- API Documentation: `/backend_Dashboard/API_DOCUMENTATION.md`
- Backend API code
- Frontend code comments

---

**Last Updated**: November 2024
**Version**: 1.0.0

