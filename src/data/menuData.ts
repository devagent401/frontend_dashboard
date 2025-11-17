export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    children?: MenuItem[];
    badge?: string;
    disabled?: boolean;
}

export const menuData: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        href: '/dashboard',
    },
    {
        id: 'products',
        label: 'Products',
        icon: 'Package',
        children: [
            {
                id: 'create-product',
                label: 'Create Product',
                icon: 'PlusCircle',
                href: '/dashboard/products/create',
            },
            {
                id: 'all-products',
                label: 'All Products',
                icon: 'List',
                href: '/dashboard/products',
            },
            {
                id: 'return-products',
                label: 'Return Products',
                icon: 'RotateCcw',
                href: '/dashboard/products/returns',
            },
        ],
    },
    {
        id: 'categories',
        label: 'Categories',
        icon: 'FolderTree',
        children: [
            {
                id: 'category-list',
                label: 'All Categories',
                icon: 'Folders',
                href: '/dashboard/categories',
            },
            {
                id: 'create-category',
                label: 'Create Category',
                icon: 'FolderPlus',
                href: '/dashboard/categories/create',
            },
        ],
    },
    {
        id: 'orders',
        label: 'Orders',
        icon: 'ShoppingCart',
        children: [
            {
                id: 'accepted-orders',
                label: 'Accepted Orders',
                icon: 'CheckCircle',
                href: '/dashboard/orders/accepted',
                badge: '12',
            },
            {
                id: 'rejected-orders',
                label: 'Rejected Orders',
                icon: 'XCircle',
                href: '/dashboard/orders/rejected',
            },
        ],
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: 'BarChart3',
        href: '/dashboard/analytics',
        children: [
            {
                id: 'reports',
                label: 'Reports',
                icon: 'FileText',
                href: '/dashboard/analytics/reports',
            },
            {
                id: 'insights',
                label: 'Insights',
                icon: 'TrendingUp',
                href: '/dashboard/analytics/insights',
            },
            {
                id: 'metrics',
                label: 'Metrics',
                icon: 'Activity',
                href: '/dashboard/analytics/metrics',
            },
        ],
    },
    {
        id: 'users',
        label: 'Users',
        icon: 'Users',
        href: '/dashboard/users',
        children: [
            {
                id: 'user-list',
                label: 'User List',
                icon: 'UserCheck',
                href: '/dashboard/users',
            },
            {
                id: 'user-roles',
                label: 'Roles & Permissions',
                icon: 'Shield',
                href: '/dashboard/users/roles',
            },
            {
                id: 'user-groups',
                label: 'Groups',
                icon: 'UserCog',
                href: '/dashboard/users/groups',
            },
        ],
    },
    {
        id: 'profile',
        label: 'User Profile',
        icon: 'UserCircle',
        href: '/dashboard/profile',
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'Settings',
        children: [
            {
                id: 'general',
                label: 'General',
                icon: 'Sliders',
                href: '/dashboard/settings/general',
            },
            {
                id: 'company',
                label: 'Company Info',
                icon: 'Building2',
                href: '/dashboard/settings/company',
            },
            {
                id: 'appearance',
                label: 'Appearance',
                icon: 'Palette',
                href: '/dashboard/settings/appearance',
            },
            {
                id: 'security',
                label: 'Security',
                icon: 'Lock',
                href: '/dashboard/settings/security',
            },
        ],
    },
    {
        id: 'help',
        label: 'Help & Support',
        icon: 'HelpCircle',
        href: '/dashboard/help',
    },
];
