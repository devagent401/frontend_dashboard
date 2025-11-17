/**
 * High-level authentication hook using React Query
 * This is the main hook consumers should use
 */

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useAuthContext } from '../contexts/AuthProvider';
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
} from '../services/auth.service';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
} from '@/types/api';
import { User, Tokens, APIError } from '../utils/types';

// Additional types for forgot/reset password
interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface LogoutResponse {
  message?: string;
}

// ============================================================================
// Return Type
// ============================================================================

export interface UseAuthReturn {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: UseMutationResult<AuthResponse, APIError, LoginRequest, unknown>;
    register: UseMutationResult<AuthResponse, APIError, RegisterRequest, unknown>;
    logout: UseMutationResult<void, APIError, void, unknown>;
    forgotPassword: UseMutationResult<ForgotPasswordResponse, APIError, ForgotPasswordRequest, unknown>;
    resetPassword: UseMutationResult<ResetPasswordResponse, APIError, ResetPasswordRequest, unknown>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Main authentication hook
 * Provides auth state and typed mutations for all auth operations
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login } = useAuth();
 * 
 * const handleLogin = () => {
 *   login.mutate({ email: 'user@example.com', password: 'password' });
 * };
 * ```
 */
export function useAuth(): UseAuthReturn {
    const { user, isAuthenticated, isLoading, setUser, setIsLoading } = useAuthContext();

    // ============================================================================
    // Login Mutation
    // ============================================================================

    const loginMutation = useMutation<AuthResponse, APIError, LoginRequest>({
        mutationFn: loginService,
        onMutate: () => {
            console.log('Login mutation started');
            setIsLoading(true);
        },
        onSuccess: (data) => {
            console.log('Login successful:', { user: data.user, hasTokens: !!(data.accessToken && data.refreshToken) });
            setUser(data.user);
            setIsLoading(false);
        },
        onError: (error) => {
            console.error('Login failed:', error);
            setIsLoading(false);
        },
    });

    // ============================================================================
    // Register Mutation
    // ============================================================================

    const registerMutation = useMutation<AuthResponse, APIError, RegisterRequest>({
        mutationFn: registerService,
        onMutate: () => {
            console.log('Register mutation started');
            setIsLoading(true);
        },
        onSuccess: (data) => {
            console.log('Register successful:', { user: data.user, hasTokens: !!(data.accessToken && data.refreshToken) });
            setUser(data.user);
            setIsLoading(false);
        },
        onError: (error) => {
            console.error('Register failed:', error);
            setIsLoading(false);
        },
    });

    // ============================================================================
    // Logout Mutation
    // ============================================================================

    const logoutMutation = useMutation<void, APIError, void>({
        mutationFn: logoutService,
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: () => {
            setUser(null);
            setIsLoading(false);
        },
        onError: () => {
            // Clear user even on error
            setUser(null);
            setIsLoading(false);
        },
    });

    // ============================================================================
    // Forgot Password Mutation
    // ============================================================================

    const forgotPasswordMutation = useMutation<ForgotPasswordResponse, APIError, ForgotPasswordRequest>({
        mutationFn: forgotPasswordService,
    });

    // ============================================================================
    // Reset Password Mutation
    // ============================================================================

    const resetPasswordMutation = useMutation<ResetPasswordResponse, APIError, ResetPasswordRequest>({
        mutationFn: resetPasswordService,
    });

    // ============================================================================
    // Return
    // ============================================================================

    return {
        user,
        isAuthenticated,
        isLoading,
        login: loginMutation,
        register: registerMutation,
        logout: logoutMutation,
        forgotPassword: forgotPasswordMutation,
        resetPassword: resetPasswordMutation,
    };
}

