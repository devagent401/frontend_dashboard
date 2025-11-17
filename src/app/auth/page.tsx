import { requireGuest } from '@/lib/auth-server';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import GoogleSignUpForm from './components/GoogleSignUpForm';

type AuthMode = 'login' | 'signup' | 'google-signup';

interface AuthPageProps {
    searchParams: Promise<{
        mode?: AuthMode;
    }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
    // Ensure user is not authenticated (redirect to dashboard if they are)
    await requireGuest();

    const resolvedSearchParams = await searchParams;
    const mode = resolvedSearchParams?.mode || 'login';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
            <div className="w-full max-w-md">
                {mode === 'login' && <LoginForm />}
                {mode === 'signup' && <RegisterForm />}
                {mode === 'google-signup' && <GoogleSignUpForm />}
            </div>
        </div>
    );
}