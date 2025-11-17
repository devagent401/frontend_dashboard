'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SignUp } from '@/components/auth/SignUp';

export default function RegisterForm() {
    const { register } = useAuth();
    const router = useRouter();

    const handleSignUp = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) => {
        try {
            // Combine firstName and lastName into name for the API
            const name = `${data.firstName} ${data.lastName}`.trim();

            await register.mutateAsync({
                email: data.email,
                password: data.password,
                name: name,
            });
            // Redirect will be handled by middleware
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign up error:', error);
            // Error handling is done in the mutation callbacks
            // You can add toast notifications here
        }
    };

    const handleGoogleAuth = () => {
        router.push('/auth?mode=google-signup');
    };

    return (
        <SignUp
            onSwitchToLogin={() => router.push('/auth?mode=login')}
            onSwitchToGoogleSignUp={handleGoogleAuth}
            onSignUp={handleSignUp}
        />
    );
}
