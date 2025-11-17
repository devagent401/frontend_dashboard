'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/lib/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { Category, CreateCategoryData } from '@/lib/types';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'flat'>('flat');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Queries
  const { data: categoriesData, isLoading } = useCategories({
    flat: viewMode === 'flat',
  });

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = categoriesData?.data || [];

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: CreateCategoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      parentId: formData.get('parentId') as string || undefined,
      icon: formData.get('icon') as string || undefined,
      status: (formData.get('status') as 'active' | 'inactive') || 'active',
      seoTitle: formData.get('seoTitle') as string || undefined,
      seoDescription: formData.get('seoDescription') as string || undefined,
    };

    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product categories and hierarchy
          </p>
        </div>
        <Button onClick={() => {
          setEditingCategory(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={viewMode} onValueChange={(value: 'tree' | 'flat') => setViewMode(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flat">Flat List</SelectItem>
            <SelectItem value="tree">Tree View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {category.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category.productCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Level {category.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update category information'
                : 'Add a new category to your store'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                  placeholder="Electronics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={editingCategory?.icon}
                  placeholder="📱"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingCategory?.description}
                placeholder="Category description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select name="parentId" defaultValue={editingCategory?.parentId || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="None (Root Category)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Root Category)</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingCategory?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                name="seoTitle"
                defaultValue={editingCategory?.seoTitle}
                placeholder="Best Electronics 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                name="seoDescription"
                defaultValue={editingCategory?.seoDescription}
                placeholder="Shop the latest electronics..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : editingCategory
                  ? 'Update'
                  : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
