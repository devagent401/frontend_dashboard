/**
 * Storage adapter interface and implementations
 * Allows swapping storage mechanism (localStorage, sessionStorage, cookies, etc.)
 */

// ============================================================================
// Storage Adapter Interface
// ============================================================================

export interface StorageAdapter {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
}

// ============================================================================
// LocalStorage Adapter (Default)
// ============================================================================

class LocalStorageAdapter implements StorageAdapter {
    getItem(key: string): string | null {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('LocalStorage getItem error:', error);
            return null;
        }
    }

    setItem(key: string, value: string): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('LocalStorage setItem error:', error);
        }
    }

    removeItem(key: string): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('LocalStorage removeItem error:', error);
        }
    }

    clear(): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.clear();
        } catch (error) {
            console.error('LocalStorage clear error:', error);
        }
    }
}

// ============================================================================
// SessionStorage Adapter (Alternative)
// ============================================================================

class SessionStorageAdapter implements StorageAdapter {
    getItem(key: string): string | null {
        if (typeof window === 'undefined') return null;
        try {
            return sessionStorage.getItem(key);
        } catch (error) {
            console.error('SessionStorage getItem error:', error);
            return null;
        }
    }

    setItem(key: string, value: string): void {
        if (typeof window === 'undefined') return;
        try {
            sessionStorage.setItem(key, value);
        } catch (error) {
            console.error('SessionStorage setItem error:', error);
        }
    }

    removeItem(key: string): void {
        if (typeof window === 'undefined') return;
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('SessionStorage removeItem error:', error);
        }
    }

    clear(): void {
        if (typeof window === 'undefined') return;
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('SessionStorage clear error:', error);
        }
    }
}

// ============================================================================
// Memory Storage Adapter (For SSR or testing)
// ============================================================================

class MemoryStorageAdapter implements StorageAdapter {
    private storage: Map<string, string> = new Map();

    getItem(key: string): string | null {
        return this.storage.get(key) || null;
    }

    setItem(key: string, value: string): void {
        this.storage.set(key, value);
    }

    removeItem(key: string): void {
        this.storage.delete(key);
    }

    clear(): void {
        this.storage.clear();
    }
}

// ============================================================================
// Cookie Storage Adapter (For secure httpOnly cookie simulation)
// Note: For true httpOnly cookies, backend must set them via Set-Cookie header
// This adapter manages client-accessible cookies only
// ============================================================================

class CookieStorageAdapter implements StorageAdapter {
    getItem(key: string): string | null {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieKey, cookieValue] = cookie.trim().split('=');
            if (cookieKey === key) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    setItem(key: string, value: string): void {
        if (typeof document === 'undefined') return;
        // Set cookie with secure flags and expiration
        const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
        // Set different expiration times based on token type
        const maxAge = key === 'access_token' ? '; Max-Age=3600' : '; Max-Age=604800'; // 1 hour for access, 7 days for refresh
        document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; SameSite=Strict${secure}${maxAge}`;
    }

    removeItem(key: string): void {
        if (typeof document === 'undefined') return;
        document.cookie = `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    clear(): void {
        if (typeof document === 'undefined') return;
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [key] = cookie.trim().split('=');
            this.removeItem(key);
        }
    }
}

// ============================================================================
// Default Storage Adapter Instance
// ============================================================================

// Use CookieStorageAdapter for better security (httpOnly cookies would be ideal)
let currentAdapter: StorageAdapter = new CookieStorageAdapter();

/**
 * Get current storage adapter
 */
export const storageAdapter = {
    getItem: (key: string) => currentAdapter.getItem(key),
    setItem: (key: string, value: string) => currentAdapter.setItem(key, value),
    removeItem: (key: string) => currentAdapter.removeItem(key),
    clear: () => currentAdapter.clear(),
};

/**
 * Set custom storage adapter
 * Call this early in your app initialization to swap storage mechanism
 * 
 * @example
 * ```ts
 * import { setStorageAdapter, CookieStorageAdapter } from './utils/storage';
 * setStorageAdapter(new CookieStorageAdapter());
 * ```
 */
export function setStorageAdapter(adapter: StorageAdapter): void {
    currentAdapter = adapter;
}

// Export adapter classes for consumer use
export { LocalStorageAdapter, SessionStorageAdapter, MemoryStorageAdapter, CookieStorageAdapter };

