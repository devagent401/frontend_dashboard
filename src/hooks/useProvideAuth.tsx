/**
 * Internal provider hook for auth state management
 * This hook contains the core auth logic used by AuthProvider
 */

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../utils/types';
import { getAccessToken } from '@/lib/api-client';
import { storageAdapter } from '../utils/storage';
import { getUserFromToken, refreshToken } from '../services/auth.service';

export interface UseProvideAuthReturn extends AuthState {
    setUser: (user: User | null) => void;
    setIsLoading: (loading: boolean) => void;
    initializeAuth: () => void;
}

/**
 * Internal hook for managing auth state
 */
export function useProvideAuth(initialAuthState?: Partial<AuthState>): UseProvideAuthReturn {
    const [user, setUser] = useState<User | null>(initialAuthState?.user || null);
    const [isLoading, setIsLoading] = useState<boolean>(initialAuthState?.isLoading ?? true);

    /**
     * Initialize auth state from stored tokens
     */
    const initializeAuth = useCallback(async () => {
        const token = getAccessToken();
        const refreshTokenValue = storageAdapter.getItem('refresh_token');

        console.log('Initializing auth:', { hasToken: !!token, hasRefreshToken: !!refreshTokenValue });

        if (token && refreshTokenValue) {
            // Both tokens exist, extract user from access token
            const userData = getUserFromToken(token);
            if (userData) {
                console.log('User data extracted from token:', userData);
                setUser(userData);
                setIsLoading(false);
                return;
            } else {
                console.warn('Failed to extract user data from token, trying refresh');
            }
        }

        if (refreshTokenValue && !token) {
            // Only refresh token exists, try to refresh access token
            console.log('Only refresh token found, attempting to refresh access token');
            try {
                const newTokens = await refreshToken(refreshTokenValue);
                const userData = getUserFromToken(newTokens.accessToken);
                if (userData) {
                    console.log('Successfully refreshed tokens and restored user:', userData);
                    setUser(userData);
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Failed to refresh token:', error);
                // Clear invalid refresh token
                storageAdapter.removeItem('refresh_token');
            }
        }

        console.log('No valid tokens found, user not authenticated');
        setIsLoading(false);
    }, []);

    /**
     * Listen for auth session expiry events
     */
    useEffect(() => {
        const handleSessionExpired = () => {
            setUser(null);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:session-expired', handleSessionExpired);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('auth:session-expired', handleSessionExpired);
            }
        };
    }, []);

    /**
     * Initialize auth on mount (skip if we have initial state)
     */
    useEffect(() => {
        if (!initialAuthState) {
            initializeAuth();
        } else {
            setIsLoading(false);
        }
    }, [initializeAuth, initialAuthState]);

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        setIsLoading,
        initializeAuth,
    };
}

