import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard'];
const authRoutes = ['/auth'];

// Helper function to get token from cookies
function getTokenFromCookies(request: NextRequest): string | null {
    return request.cookies.get('access_token')?.value || null;
}

// Helper function to check if token is valid (basic check)
function isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
        // Basic JWT structure check (has 3 parts separated by dots)
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        // Decode payload to check expiration
        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if token is expired
        if (payload.exp && payload.exp < currentTime) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = getTokenFromCookies(request);
    const isAuthenticated = token && isTokenValid(token);

    // Check if accessing protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Check if accessing auth route
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users from protected routes to auth
    if (isProtectedRoute && !isAuthenticated) {
        console.log('Redirecting to auth - protected route without authentication');
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Redirect authenticated users from auth routes to dashboard
    if (isAuthRoute && isAuthenticated) {
        console.log('Redirecting to dashboard - authenticated user on auth route');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow the request to continue
    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
