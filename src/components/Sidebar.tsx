'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { menuData, MenuItem } from '@/data/menuData';
import { cn } from '@/lib/utils';
import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    BarChart3,
    Users,
    FileText,
    ShoppingCart,
    Settings,
    HelpCircle,
    UserCheck,
    Shield,
    UserCog,
    Edit3,
    File,
    Image,
    Package,
    ShoppingBag,
    Warehouse,
    UserPlus,
    Sliders,
    Palette,
    Lock,
    Zap,
    TrendingUp,
    Activity,
    PlusCircle,
    List,
    RotateCcw,
    FolderTree,
    Folders,
    FolderPlus,
    CheckCircle,
    XCircle,
    UserCircle,
    Building2,
} from 'lucide-react';

const iconMap = {
    LayoutDashboard,
    BarChart3,
    Users,
    FileText,
    ShoppingCart,
    Settings,
    HelpCircle,
    UserCheck,
    Shield,
    UserCog,
    Edit3,
    File,
    Image,
    Package,
    ShoppingBag,
    Warehouse,
    UserPlus,
    Sliders,
    Palette,
    Lock,
    Zap,
    TrendingUp,
    Activity,
    PlusCircle,
    List,
    RotateCcw,
    FolderTree,
    Folders,
    FolderPlus,
    CheckCircle,
    XCircle,
    UserCircle,
    Building2,
};

interface MenuItemComponentProps {
    item: MenuItem;
    level: number;
    isCollapsed: boolean;
}

function MenuItemComponent({ item, level, isCollapsed }: MenuItemComponentProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon ? iconMap[item.icon as keyof typeof iconMap] : null;

    const handleClick = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    const content = (
        <div
            className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--color-surface)] cursor-pointer',
                level > 0 && 'ml-4',
                item.disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={handleClick}
        >
            {Icon && <Icon className="w-5 h-5 text-[var(--color-textSecondary)] flex-shrink-0" />}
            {!isCollapsed && (
                <>
                    <span className="text-sm font-medium text-[var(--color-text)] flex-1">
                        {item.label}
                    </span>
                    {item.badge && (
                        <span className="px-2 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-full">
                            {item.badge}
                        </span>
                    )}
                    {hasChildren && (
                        <div className="text-[var(--color-textSecondary)]">
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );

    if (item.href && !hasChildren) {
        return (
            <Link href={item.href} className="block">
                {content}
            </Link>
        );
    }

    return (
        <div>
            {content}
            {hasChildren && isExpanded && !isCollapsed && (
                <div className="mt-1 space-y-1">
                    {item.children?.map((child) => (
                        <MenuItemComponent
                            key={child.id}
                            item={child}
                            level={level + 1}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const { isSidebarCollapsed, isMobile } = useTheme();

    return (
        <div
            className={cn(
                'h-full bg-[var(--color-background)] border-r border-[var(--color-border)] transition-all duration-300 ease-in-out',
                isSidebarCollapsed ? 'w-16' : 'w-64',
                isMobile && isSidebarCollapsed && 'hidden',
                className
            )}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">D</span>
                    </div>
                    {!isSidebarCollapsed && (
                        <div>
                            <h1 className="text-lg font-bold text-[var(--color-text)]">Dashboard</h1>
                            <p className="text-xs text-[var(--color-textSecondary)]">Admin Panel</p>
                        </div>
                    )}
                </div>

                <nav className="space-y-2">
                    {menuData.map((item) => (
                        <MenuItemComponent key={item.id} item={item} level={0} isCollapsed={isSidebarCollapsed} />
                    ))}
                </nav>
            </div>
        </div>
    );
}
