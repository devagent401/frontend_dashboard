'use client';

/**
 * Auth Context Provider
 * Wraps the app to provide auth state to all components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useProvideAuth, UseProvideAuthReturn } from '../hooks/useProvideAuth';
import { AuthState } from '../utils/types';

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<UseProvideAuthReturn | undefined>(undefined);

// ============================================================================
// Provider Props
// ============================================================================

interface AuthProviderProps {
    children: ReactNode;
    initialAuthState?: Partial<AuthState>;
}

// ============================================================================
// Provider Component
// ============================================================================

export function AuthProvider({ children, initialAuthState }: AuthProviderProps): JSX.Element {
    const auth = useProvideAuth(initialAuthState);

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Context Hook
// ============================================================================

/**
 * Access auth context (internal use)
 * For external use, prefer the useAuth hook from hooks/useAuth.tsx
 */
export function useAuthContext(): UseProvideAuthReturn {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

