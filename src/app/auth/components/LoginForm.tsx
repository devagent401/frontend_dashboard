'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Login } from '@/components/auth/Login';

export default function LoginForm() {
    const [googleUser, setGoogleUser] = useState<any>(null);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            await login.mutateAsync({
                email: data.email,
                password: data.password,
            });
            
            // Small delay to ensure cookies are set
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirect to dashboard - middleware will verify auth
            router.push('/dashboard');
            router.refresh(); // Force refresh to trigger middleware
        } catch (error) {
            console.error('Login error:', error);
            // Error handling is done in the mutation callbacks
            // You can add toast notifications here
        }
    };

    const handleGoogleAuth = () => {
        // Simulate Google OAuth flow
        // In a real app, this would integrate with Google OAuth
        const mockGoogleUser = {
            email: 'user@gmail.com',
            name: 'John Doe',
            picture: 'https://via.placeholder.com/150'
        };

        setGoogleUser(mockGoogleUser);
        router.push('/auth?mode=google-signup');
    };

    return (
        <Login
            onSwitchToSignUp={() => router.push('/auth?mode=signup')}
            onSwitchToGoogleSignUp={handleGoogleAuth}
            onLogin={handleLogin}
        />
    );
}
