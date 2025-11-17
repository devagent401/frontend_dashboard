'use client';

import { createContext, useContext, useEffect } from 'react';
import { useCurrentUser, useLogout } from './hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from './types';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userData, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  const user = userData?.data;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.roleId) return false;
    const role = typeof user.roleId === 'object' ? user.roleId : null;
    return role?.permissions?.includes(permission) || false;
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    return user.role === roleName;
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated,
    logout,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Permission guard component
export function RequirePermission({ 
  permission, 
  children,
  fallback = <div>You don't have permission to view this content.</div>
}: { 
  permission: string; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Role guard component
export function RequireRole({ 
  role, 
  children,
  fallback = <div>You don't have access to this content.</div>
}: { 
  role: string | string[]; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasRole } = useAuth();
  
  const roles = Array.isArray(role) ? role : [role];
  const hasAccess = roles.some(r => hasRole(r));
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

