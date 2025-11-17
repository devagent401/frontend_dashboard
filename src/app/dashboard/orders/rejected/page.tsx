'use client';

import React, { useState } from 'react';
import { Search, Calendar, FileText, AlertCircle, RotateCcw } from 'lucide-react';

interface RejectedOrder {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    orderDate: string;
    rejectedDate: string;
    reason: string;
    notes?: string;
    products: Array<{
        id: number;
        name: string;
        quantity: number;
        price: number;
    }>;
}

const sampleRejectedOrders: RejectedOrder[] = [
    {
        id: 1,
        orderNumber: 'ORD-2024-101',
        customerName: 'Alice Williams',
        customerEmail: 'alice@example.com',
        total: 499.99,
        orderDate: '2024-02-15',
        rejectedDate: '2024-02-16',
        reason: 'Payment failed',
        notes: 'Customer credit card was declined multiple times',
        products: [
            { id: 1, name: 'Smart Watch Pro', quantity: 1, price: 499.99 },
        ]
    },
    {
        id: 2,
        orderNumber: 'ORD-2024-102',
        customerName: 'Mike Brown',
        customerEmail: 'mike@example.com',
        total: 899.97,
        orderDate: '2024-02-14',
        rejectedDate: '2024-02-15',
        reason: 'Product unavailable',
        notes: 'Items out of stock at the time of processing',
        products: [
            { id: 2, name: 'Laptop Pro', quantity: 1, price: 799.99 },
            { id: 3, name: 'Mouse Pad', quantity: 1, price: 29.99 },
            { id: 4, name: 'Laptop Bag', quantity: 1, price: 69.99 },
        ]
    },
    {
        id: 3,
        orderNumber: 'ORD-2024-103',
        customerName: 'Sarah Davis',
        customerEmail: 'sarah@example.com',
        total: 299.99,
        orderDate: '2024-02-13',
        rejectedDate: '2024-02-14',
        reason: 'Suspicious activity',
        notes: 'Flagged by fraud detection system',
        products: [
            { id: 5, name: 'Headphones Elite', quantity: 1, price: 299.99 },
        ]
    },
    {
        id: 4,
        orderNumber: 'ORD-2024-104',
        customerName: 'Tom Wilson',
        customerEmail: 'tom@example.com',
        total: 1299.98,
        orderDate: '2024-02-12',
        rejectedDate: '2024-02-13',
        reason: 'Invalid shipping address',
        notes: 'Address could not be verified',
        products: [
            { id: 6, name: 'Gaming Console', quantity: 2, price: 649.99 },
        ]
    },
];

export default function RejectedOrdersPage() {
    const [orders, setOrders] = useState<RejectedOrder[]>(sampleRejectedOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month'>('all');
    const [selectedOrder, setSelectedOrder] = useState<RejectedOrder | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.reason.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const rejectedDate = new Date(order.rejectedDate);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - rejectedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (dateFilter === 'week') matchesDate = diffDays <= 7;
            else if (dateFilter === 'month') matchesDate = diffDays <= 30;
        }

        return matchesSearch && matchesDate;
    });

    const handleViewDetails = (order: RejectedOrder) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleReprocess = (orderId: number) => {
        // Logic to reprocess order
        console.log('Reprocessing order:', orderId);
        alert('Order sent for reprocessing!');
    };

    const getRejectionReasonColor = (reason: string) => {
        const lowerReason = reason.toLowerCase();
        if (lowerReason.includes('payment')) return 'text-[var(--color-error)]';
        if (lowerReason.includes('unavailable') || lowerReason.includes('stock')) return 'text-[var(--color-warning)]';
        if (lowerReason.includes('suspicious') || lowerReason.includes('fraud')) return 'text-[var(--color-error)]';
        if (lowerReason.includes('address')) return 'text-[var(--color-info)]';
        return 'text-[var(--color-textSecondary)]';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Rejected Orders</h1>
                <p className="text-[var(--color-textSecondary)] mt-1">
                    View and manage rejected orders
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
                                placeholder="Search by order number, customer, or reason..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                        >
                            <option value="all">All Time</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Total Rejected</p>
                    <p className="text-2xl font-bold text-[var(--color-error)] mt-1">{filteredOrders.length}</p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Lost Revenue</p>
                    <p className="text-2xl font-bold text-[var(--color-error)] mt-1">
                        ${filteredOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">This Month</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                        {orders.filter(o => {
                            const date = new Date(o.rejectedDate);
                            const now = new Date();
                            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                </div>
            </div>

            {/* Rejection Reasons Summary */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Rejection Reasons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from(new Set(orders.map(o => o.reason))).map(reason => {
                        const count = orders.filter(o => o.reason === reason).length;
                        return (
                            <div key={reason} className="p-3 bg-[var(--color-background)] rounded-lg">
                                <p className="text-xs text-[var(--color-textSecondary)] mb-1">{reason}</p>
                                <p className="text-lg font-bold text-[var(--color-text)]">{count}</p>
                            </div>
                        );
                    })}
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
                                        <p className="text-sm text-[var(--color-textSecondary)] mt-1">
                                            {order.customerName} • {order.customerEmail}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-error)]/10 rounded-full">
                                        <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />
                                        <span className="text-xs font-medium text-[var(--color-error)]">Rejected</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-[var(--color-textSecondary)]">Order Date</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Calendar className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                            <span className="text-sm text-[var(--color-text)]">{order.orderDate}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--color-textSecondary)]">Rejected Date</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Calendar className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                            <span className="text-sm text-[var(--color-text)]">{order.rejectedDate}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--color-textSecondary)]">Total Amount</p>
                                        <p className="text-lg font-bold text-[var(--color-text)] mt-1">${order.total.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--color-textSecondary)]">Products</p>
                                        <p className="text-sm text-[var(--color-text)] mt-1">{order.products.length} item(s)</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-[var(--color-error)]/5 border border-[var(--color-error)]/10 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className={`w-4 h-4 mt-0.5 ${getRejectionReasonColor(order.reason)}`} />
                                        <div className="flex-1">
                                            <p className="text-xs text-[var(--color-textSecondary)]">Rejection Reason</p>
                                            <p className={`text-sm font-medium ${getRejectionReasonColor(order.reason)}`}>
                                                {order.reason}
                                            </p>
                                            {order.notes && (
                                                <p className="text-xs text-[var(--color-textSecondary)] mt-1">{order.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex lg:flex-col gap-2">
                                <button
                                    onClick={() => handleViewDetails(order)}
                                    className="flex-1 lg:flex-none px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background)] transition-colors text-sm font-medium"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleReprocess(order.id)}
                                    className="flex-1 lg:flex-none px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reprocess
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="bg-[var(--color-surface)] rounded-lg p-12 border border-[var(--color-border)] text-center">
                        <FileText className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-4" />
                        <p className="text-[var(--color-text)] font-medium">No rejected orders found</p>
                        <p className="text-[var(--color-textSecondary)] text-sm mt-1">
                            {searchQuery ? 'Try adjusting your search' : 'All orders are being processed successfully'}
                        </p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-surface)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--color-text)]">Order Details</h2>
                                    <p className="text-[var(--color-textSecondary)] mt-1">{selectedOrder.orderNumber}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                                >
                                    <AlertCircle className="w-6 h-6 text-[var(--color-textSecondary)]" />
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-6 p-4 bg-[var(--color-background)] rounded-lg">
                                <h3 className="text-sm font-medium text-[var(--color-textSecondary)] mb-3">Customer Information</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[var(--color-textSecondary)]">Name</span>
                                        <span className="text-sm font-medium text-[var(--color-text)]">{selectedOrder.customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-[var(--color-textSecondary)]">Email</span>
                                        <span className="text-sm font-medium text-[var(--color-text)]">{selectedOrder.customerEmail}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-[var(--color-textSecondary)] mb-3">Order Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.products.map(product => (
                                        <div key={product.id} className="flex justify-between items-center p-3 bg-[var(--color-background)] rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text)]">{product.name}</p>
                                                <p className="text-xs text-[var(--color-textSecondary)]">Qty: {product.quantity}</p>
                                            </div>
                                            <span className="text-sm font-medium text-[var(--color-text)]">
                                                ${(product.price * product.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rejection Info */}
                            <div className="mb-6 p-4 bg-[var(--color-error)]/5 border border-[var(--color-error)]/10 rounded-lg">
                                <h3 className="text-sm font-medium text-[var(--color-textSecondary)] mb-3">Rejection Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-xs text-[var(--color-textSecondary)]">Reason</span>
                                        <p className="text-sm font-medium text-[var(--color-error)]">{selectedOrder.reason}</p>
                                    </div>
                                    {selectedOrder.notes && (
                                        <div>
                                            <span className="text-xs text-[var(--color-textSecondary)]">Notes</span>
                                            <p className="text-sm text-[var(--color-text)]">{selectedOrder.notes}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-xs text-[var(--color-textSecondary)]">Rejected On</span>
                                        <p className="text-sm text-[var(--color-text)]">{selectedOrder.rejectedDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-[var(--color-border)] pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-[var(--color-text)]">Total</span>
                                    <span className="text-2xl font-bold text-[var(--color-text)]">
                                        ${selectedOrder.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleReprocess(selectedOrder.id)}
                                    className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reprocess Order
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="flex-1 px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background)] transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

