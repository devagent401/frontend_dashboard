import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Server-side authentication utilities
export async function getServerSideAuth() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('access_token')?.value;

    if (!token) {
        return { isAuthenticated: false, user: null };
    }

    try {
        // Basic JWT validation
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { isAuthenticated: false, user: null };
        }

        // Decode payload
        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if token is expired
        if (payload.exp && payload.exp < currentTime) {
            return { isAuthenticated: false, user: null };
        }

        // Extract user data from token
        const user = {
            id: payload.sub || payload.id || payload.user_id || '',
            email: payload.email || '',
            name: payload.name || '',
            ...payload,
        };

        return { isAuthenticated: true, user };
    } catch (error) {
        console.error('Server-side auth error:', error);
        return { isAuthenticated: false, user: null };
    }
}

// Server-side redirect helpers
export async function requireAuth() {
    const { isAuthenticated } = await getServerSideAuth();
    if (!isAuthenticated) {
        redirect('/auth');
    }
}

export async function requireGuest() {
    const { isAuthenticated } = await getServerSideAuth();
    if (isAuthenticated) {
        redirect('/dashboard');
    }
}
