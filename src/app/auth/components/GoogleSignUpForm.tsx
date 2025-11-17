'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { GoogleSignUp } from '@/components/auth/GoogleSignUp';

export default function GoogleSignUpForm() {
    const { register } = useAuth();
    const router = useRouter();

    // Mock Google user data (in real app, this would come from OAuth callback)
    const googleUser = {
        email: 'user@gmail.com',
        name: 'John Doe',
        picture: 'https://via.placeholder.com/150'
    };

    const handleGoogleSignUp = async (data: {
        email: string;
        firstName: string;
        lastName: string;
    }) => {
        try {
            // Google signup uses the same register endpoint
            const name = `${data.firstName} ${data.lastName}`.trim();

            await register.mutateAsync({
                email: data.email,
                password: '', // Google auth might not need a password, adjust based on your API
                name: name,
            });
            // Redirect will be handled by middleware
            router.push('/dashboard');
        } catch (error) {
            console.error('Google sign up error:', error);
            // Error handling is done in the mutation callbacks
            // You can add toast notifications here
        }
    };

    return (
        <GoogleSignUp
            onSwitchToLogin={() => router.push('/auth?mode=login')}
            onSwitchToSignUp={() => router.push('/auth?mode=signup')}
            onGoogleSignUp={handleGoogleSignUp}
            googleUser={googleUser}
        />
    );
}
