'use client';

import { useState } from 'react';
import { Plus, Search, Eye, MoreVertical, Filter } from 'lucide-react';
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '@/lib/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import type { Order, OrderStatus } from '@/lib/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-cyan-100 text-cyan-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
  returned: 'bg-orange-100 text-orange-800',
};

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');

  // Queries
  const { data: ordersData, isLoading } = useOrders({
    status: statusFilter !== 'all' ? (statusFilter as OrderStatus) : undefined,
  });

  // Mutations
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();

  const orders = ordersData?.data || [];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    await updateStatusMutation.mutateAsync({
      id: selectedOrder.id,
      data: { status: newStatus },
    });
    setIsStatusDialogOpen(false);
    setIsDetailOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const getCustomerName = (order: Order) => {
    if (typeof order.customerId === 'object') {
      return `${order.customerId.firstName} ${order.customerId.lastName}`;
    }
    return order.customerInfo?.name || 'Guest';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'blue' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'green' },
          { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{getCustomerName(order)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell className="font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setIsStatusDialogOpen(true);
                        }}>
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(order.id)}
                          className="text-destructive"
                          disabled={order.status !== 'pending'}
                        >
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

      {/* Order Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{getCustomerName(selectedOrder)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={STATUS_COLORS[selectedOrder.status]}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${selectedOrder.shippingAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <Label>Shipping Address</Label>
                  <p className="text-sm mt-1">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}<br />
                    {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.country} {selectedOrder.shippingAddress.zipCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

