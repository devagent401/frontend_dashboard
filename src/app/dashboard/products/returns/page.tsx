'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

interface ReturnRequest {
    id: number;
    orderId: string;
    productName: string;
    productSku: string;
    quantity: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    customerName: string;
    requestDate: string;
    notes?: string;
}

const sampleReturns: ReturnRequest[] = [
    {
        id: 1,
        orderId: 'ORD-1001',
        productName: 'Wireless Headphones',
        productSku: 'WH-001',
        quantity: 1,
        reason: 'Defective product',
        status: 'pending',
        customerName: 'John Doe',
        requestDate: '2024-02-20',
        notes: 'Left earphone not working'
    },
    {
        id: 2,
        orderId: 'ORD-1002',
        productName: 'Smart Watch',
        productSku: 'SW-002',
        quantity: 1,
        reason: 'Wrong item received',
        status: 'approved',
        customerName: 'Jane Smith',
        requestDate: '2024-02-18',
    },
    {
        id: 3,
        orderId: 'ORD-1003',
        productName: 'Laptop Stand',
        productSku: 'LS-003',
        quantity: 2,
        reason: 'Changed mind',
        status: 'rejected',
        customerName: 'Bob Johnson',
        requestDate: '2024-02-15',
        notes: 'Return window expired'
    },
];

export default function ReturnProductsPage() {
    const [returns, setReturns] = useState<ReturnRequest[]>(sampleReturns);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const filteredReturns = returns.filter(returnReq => {
        const matchesSearch = 
            returnReq.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            returnReq.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            returnReq.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || returnReq.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (id: number, newStatus: 'approved' | 'rejected') => {
        setReturns(prev => prev.map(ret => 
            ret.id === id ? { ...ret, status: newStatus } : ret
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]';
            case 'approved': return 'bg-[var(--color-success)]/10 text-[var(--color-success)]';
            case 'rejected': return 'bg-[var(--color-error)]/10 text-[var(--color-error)]';
            default: return 'bg-[var(--color-textSecondary)]/10 text-[var(--color-textSecondary)]';
        }
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
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Product Returns</h1>
                    <p className="text-[var(--color-textSecondary)] mt-1">
                        Manage product return requests
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                            <input
                                type="text"
                                placeholder="Search by product, order ID, or customer..."
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
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Total Returns</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{filteredReturns.length}</p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Pending</p>
                    <p className="text-2xl font-bold text-[var(--color-warning)] mt-1">
                        {filteredReturns.filter(r => r.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Approved</p>
                    <p className="text-2xl font-bold text-[var(--color-success)] mt-1">
                        {filteredReturns.filter(r => r.status === 'approved').length}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Rejected</p>
                    <p className="text-2xl font-bold text-[var(--color-error)] mt-1">
                        {filteredReturns.filter(r => r.status === 'rejected').length}
                    </p>
                </div>
            </div>

            {/* Returns List */}
            <div className="space-y-4">
                {filteredReturns.map((returnReq) => (
                    <div key={returnReq.id} className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                                            {returnReq.productName}
                                        </h3>
                                        <p className="text-sm text-[var(--color-textSecondary)]">
                                            SKU: {returnReq.productSku} | Order: {returnReq.orderId}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(returnReq.status)}`}>
                                        {returnReq.status.charAt(0).toUpperCase() + returnReq.status.slice(1)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-[var(--color-textSecondary)]">Customer: </span>
                                        <span className="text-[var(--color-text)] font-medium">{returnReq.customerName}</span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--color-textSecondary)]">Quantity: </span>
                                        <span className="text-[var(--color-text)] font-medium">{returnReq.quantity}</span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--color-textSecondary)]">Reason: </span>
                                        <span className="text-[var(--color-text)] font-medium">{returnReq.reason}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                        <span className="text-[var(--color-text)]">{returnReq.requestDate}</span>
                                    </div>
                                </div>

                                {returnReq.notes && (
                                    <div className="flex items-start gap-2 p-3 bg-[var(--color-background)] rounded-lg">
                                        <FileText className="w-4 h-4 text-[var(--color-textSecondary)] mt-0.5" />
                                        <div>
                                            <p className="text-xs text-[var(--color-textSecondary)] mb-1">Notes:</p>
                                            <p className="text-sm text-[var(--color-text)]">{returnReq.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {returnReq.status === 'pending' && (
                                <div className="flex lg:flex-col gap-2">
                                    <button
                                        onClick={() => handleStatusChange(returnReq.id, 'approved')}
                                        className="flex-1 lg:flex-none px-4 py-2 bg-[var(--color-success)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(returnReq.id, 'rejected')}
                                        className="flex-1 lg:flex-none px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredReturns.length === 0 && (
                    <div className="bg-[var(--color-surface)] rounded-lg p-12 border border-[var(--color-border)] text-center">
                        <FileText className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-4" />
                        <p className="text-[var(--color-text)] font-medium">No return requests found</p>
                        <p className="text-[var(--color-textSecondary)] text-sm mt-1">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

