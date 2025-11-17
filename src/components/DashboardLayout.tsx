'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { ColorPaletteSelector } from './ColorPaletteSelector';
import { NotificationBell } from './NotificationBell';
import { cn } from '@/lib/utils';
import { Menu, X, Palette, LogOut, User } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isSidebarCollapsed, toggleSidebar, isMobile } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const paletteRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
                setIsPaletteOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout.mutateAsync();
            router.push('/auth');
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if logout API fails
            router.push('/auth');
        }
    };

    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                        >
                            {isSidebarCollapsed ? (
                                <Menu className="w-5 h-5 text-[var(--color-text)]" />
                            ) : (
                                <X className="w-5 h-5 text-[var(--color-text)]" />
                            )}
                        </button>
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">
                            Welcome to Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <NotificationBell />

                        {/* Theme Palette Selector */}
                        <div className="relative" ref={paletteRef}>
                            <button
                                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                                className={cn(
                                    'p-2 rounded-lg transition-all duration-200 hover:scale-105',
                                    'hover:bg-[var(--color-surface)] border border-transparent',
                                    isPaletteOpen
                                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                        : 'text-[var(--color-text)] hover:text-[var(--color-primary)]'
                                )}
                                title="Choose Color Theme"
                            >
                                <Palette className="w-5 h-5" />
                            </button>

                            {/* Color Palette Dropdown */}
                            {isPaletteOpen && (
                                <div className={cn(
                                    'absolute right-0 top-full mt-2 z-50',
                                    'bg-[var(--color-surface)] border border-[var(--color-border)]',
                                    'rounded-xl shadow-2xl backdrop-blur-sm',
                                    'p-4 min-w-[280px]',
                                    'animate-in slide-in-from-top-2 duration-200'
                                )}>
                                    <ColorPaletteSelector />
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className={cn(
                                    'flex items-center gap-2 p-2 rounded-lg transition-all duration-200',
                                    'hover:bg-[var(--color-surface)] border border-transparent',
                                    isUserMenuOpen
                                        ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20'
                                        : 'text-[var(--color-text)]'
                                )}
                            >
                                <div className="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-[var(--color-primary)]" />
                                </div>
                                <span className="text-sm font-medium">{user?.name}</span>
                            </button>

                            {/* User Menu Dropdown */}
                            {isUserMenuOpen && (
                                <div className={cn(
                                    'absolute right-0 top-full mt-2 z-50',
                                    'bg-[var(--color-surface)] border border-[var(--color-border)]',
                                    'rounded-xl shadow-2xl backdrop-blur-sm',
                                    'p-2 min-w-[200px]',
                                    'animate-in slide-in-from-top-2 duration-200'
                                )}>
                                    <div className="px-3 py-2 border-b border-[var(--color-border)]">
                                        <p className="text-sm font-medium text-[var(--color-text)]">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-[var(--color-textSecondary)]">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && !isSidebarCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}
