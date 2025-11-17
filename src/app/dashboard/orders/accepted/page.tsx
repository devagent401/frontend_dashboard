'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Plus, X, Package, DollarSign, User, Calendar } from 'lucide-react';

interface OrderProduct {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    orderDate: string;
    products: OrderProduct[];
}

const sampleOrders: Order[] = [
    {
        id: 1,
        orderNumber: 'ORD-2024-001',
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        total: 299.97,
        status: 'processing',
        orderDate: '2024-02-20',
        products: [
            { id: 1, name: 'Wireless Headphones', sku: 'WH-001', quantity: 2, price: 99.99 },
            { id: 2, name: 'USB-C Cable', sku: 'UC-004', quantity: 1, price: 19.99 },
        ]
    },
    {
        id: 2,
        orderNumber: 'ORD-2024-002',
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        total: 599.98,
        status: 'shipped',
        orderDate: '2024-02-19',
        products: [
            { id: 3, name: 'Smart Watch', sku: 'SW-002', quantity: 2, price: 299.99 },
        ]
    },
    {
        id: 3,
        orderNumber: 'ORD-2024-003',
        customerName: 'Bob Johnson',
        customerEmail: 'bob@example.com',
        total: 149.99,
        status: 'delivered',
        orderDate: '2024-02-18',
        products: [
            { id: 4, name: 'Mechanical Keyboard', sku: 'MK-005', quantity: 1, price: 149.99 },
        ]
    },
];

// Sample products for adding to order
const availableProducts = [
    { id: 5, name: 'Laptop Stand', sku: 'LS-003', price: 49.99 },
    { id: 6, name: 'Wireless Mouse', sku: 'WM-006', price: 29.99 },
    { id: 7, name: 'Monitor', sku: 'MN-007', price: 299.99 },
];

export default function AcceptedOrdersPage() {
    const [orders, setOrders] = useState<Order[]>(sampleOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [showAddProduct, setShowAddProduct] = useState(false);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]';
            case 'processing': return 'bg-[var(--color-info)]/10 text-[var(--color-info)]';
            case 'shipped': return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]';
            case 'delivered': return 'bg-[var(--color-success)]/10 text-[var(--color-success)]';
            default: return 'bg-[var(--color-textSecondary)]/10 text-[var(--color-textSecondary)]';
        }
    };

    const handleEditOrder = (order: Order) => {
        setEditingOrder({ ...order });
        setShowEditModal(true);
    };

    const handleAddProduct = (productId: number) => {
        if (!editingOrder) return;
        
        const product = availableProducts.find(p => p.id === productId);
        if (!product) return;

        const newProduct: OrderProduct = {
            id: product.id,
            name: product.name,
            sku: product.sku,
            quantity: 1,
            price: product.price,
        };

        setEditingOrder(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                products: [...prev.products, newProduct],
                total: prev.total + product.price,
            };
        });
        setShowAddProduct(false);
    };

    const handleRemoveProduct = (productId: number) => {
        if (!editingOrder) return;

        const product = editingOrder.products.find(p => p.id === productId);
        if (!product) return;

        setEditingOrder(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                products: prev.products.filter(p => p.id !== productId),
                total: prev.total - (product.price * product.quantity),
            };
        });
    };

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (!editingOrder || newQuantity < 1) return;

        setEditingOrder(prev => {
            if (!prev) return prev;
            
            const oldProduct = prev.products.find(p => p.id === productId);
            if (!oldProduct) return prev;

            const priceDiff = (newQuantity - oldProduct.quantity) * oldProduct.price;

            return {
                ...prev,
                products: prev.products.map(p => 
                    p.id === productId ? { ...p, quantity: newQuantity } : p
                ),
                total: prev.total + priceDiff,
            };
        });
    };

    const handleSaveOrder = () => {
        if (!editingOrder) return;

        setOrders(prev => prev.map(order => 
            order.id === editingOrder.id ? editingOrder : order
        ));
        setShowEditModal(false);
        setEditingOrder(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Accepted Orders</h1>
                <p className="text-[var(--color-textSecondary)] mt-1">
                    Manage and edit accepted orders
                </p>
            </div>

            {/* Filters */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                            <input
                                type="text"
                                placeholder="Search by order number, customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Total Orders</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{filteredOrders.length}</p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Processing</p>
                    <p className="text-2xl font-bold text-[var(--color-info)] mt-1">
                        {filteredOrders.filter(o => o.status === 'processing').length}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Shipped</p>
                    <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">
                        {filteredOrders.filter(o => o.status === 'shipped').length}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Total Revenue</p>
                    <p className="text-2xl font-bold text-[var(--color-success)] mt-1">
                        ${filteredOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                                            {order.orderNumber}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <User className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                            <span className="text-sm text-[var(--color-textSecondary)]">{order.customerName}</span>
                                            <span className="text-sm text-[var(--color-textSecondary)]">•</span>
                                            <span className="text-sm text-[var(--color-textSecondary)]">{order.customerEmail}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                        <span className="text-sm text-[var(--color-text)]">
                                            {order.products.length} item(s)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                        <span className="text-sm font-medium text-[var(--color-text)]">
                                            ${order.total.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                        <span className="text-sm text-[var(--color-text)]">{order.orderDate}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-[var(--color-background)] rounded-lg">
                                    <p className="text-xs font-medium text-[var(--color-textSecondary)] mb-2">Products:</p>
                                    <div className="space-y-1">
                                        {order.products.map(product => (
                                            <div key={product.id} className="flex justify-between text-sm">
                                                <span className="text-[var(--color-text)]">
                                                    {product.name} (x{product.quantity})
                                                </span>
                                                <span className="text-[var(--color-text)] font-medium">
                                                    ${(product.price * product.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-col gap-2">
                                <button
                                    onClick={() => handleEditOrder(order)}
                                    className="flex-1 lg:flex-none px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="bg-[var(--color-surface)] rounded-lg p-12 border border-[var(--color-border)] text-center">
                        <Package className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-4" />
                        <p className="text-[var(--color-text)] font-medium">No orders found</p>
                        <p className="text-[var(--color-textSecondary)] text-sm mt-1">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Order Modal */}
            {showEditModal && editingOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-surface)] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--color-text)]">Edit Order</h2>
                                    <p className="text-[var(--color-textSecondary)] mt-1">{editingOrder.orderNumber}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingOrder(null);
                                    }}
                                    className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-[var(--color-textSecondary)]" />
                                </button>
                            </div>

                            {/* Products List */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Products</h3>
                                    <button
                                        onClick={() => setShowAddProduct(!showAddProduct)}
                                        className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Product
                                    </button>
                                </div>

                                {showAddProduct && (
                                    <div className="p-4 bg-[var(--color-background)] rounded-lg">
                                        <p className="text-sm font-medium text-[var(--color-text)] mb-2">Select a product to add:</p>
                                        <div className="space-y-2">
                                            {availableProducts.map(product => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => handleAddProduct(product.id)}
                                                    className="w-full flex justify-between items-center p-3 bg-[var(--color-surface)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                                                >
                                                    <span className="text-sm text-[var(--color-text)]">{product.name}</span>
                                                    <span className="text-sm font-medium text-[var(--color-text)]">${product.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {editingOrder.products.map(product => (
                                        <div key={product.id} className="flex items-center gap-3 p-3 bg-[var(--color-background)] rounded-lg">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[var(--color-text)]">{product.name}</p>
                                                <p className="text-xs text-[var(--color-textSecondary)]">SKU: {product.sku}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={product.quantity}
                                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                                    className="w-20 px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-center text-[var(--color-text)]"
                                                />
                                                <span className="text-sm font-medium text-[var(--color-text)] w-20 text-right">
                                                    ${(product.price * product.quantity).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveProduct(product.id)}
                                                    className="p-2 hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-[var(--color-border)] pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-[var(--color-text)]">Total</span>
                                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                                        ${editingOrder.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveOrder}
                                    className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingOrder(null);
                                    }}
                                    className="flex-1 px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background)] transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

