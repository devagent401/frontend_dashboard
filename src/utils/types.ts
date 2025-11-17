/**
 * Shared types for the authentication module
 */

// ============================================================================
// User
// ============================================================================

export interface User {
    id: string;
    email: string;
    name: string;
    [key: string]: any; // Allow additional fields from backend
}

// ============================================================================
// Tokens
// ============================================================================

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

// ============================================================================
// API Error
// ============================================================================

export interface APIError {
    message: string;
    status?: number;
    code?: string;
    details?: any;
}

// ============================================================================
// Auth State
// ============================================================================

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

