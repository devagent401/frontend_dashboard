import { getServerSideAuth } from '@/lib/auth-server';
import { AuthProvider } from '@/contexts/AuthProvider';

interface ServerAuthProviderProps {
    children: React.ReactNode;
}

export default async function ServerAuthProvider({ children }: ServerAuthProviderProps) {
    const { isAuthenticated, user } = await getServerSideAuth();

    return (
        <AuthProvider initialAuthState={{ isAuthenticated, user, isLoading: false }}>
            {children}
        </AuthProvider>
    );
}
