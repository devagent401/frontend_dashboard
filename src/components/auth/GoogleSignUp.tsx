'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Mail, User, ArrowLeft } from 'lucide-react';

interface GoogleSignUpProps {
    onSwitchToLogin: () => void;
    onSwitchToSignUp: () => void;
    onGoogleSignUp: (data: { email: string; firstName: string; lastName: string }) => void;
    googleUser?: {
        email: string;
        name: string;
        picture?: string;
    };
}

export function GoogleSignUp({
    onSwitchToLogin,
    onSwitchToSignUp,
    onGoogleSignUp,
    googleUser
}: GoogleSignUpProps) {
    const [formData, setFormData] = useState({
        email: googleUser?.email || '',
        firstName: googleUser?.name?.split(' ')[0] || '',
        lastName: googleUser?.name?.split(' ').slice(1).join(' ') || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGoogleSignUp(formData);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-[var(--color-surface)] rounded-lg p-8 border border-[var(--color-border)] shadow-lg">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Complete Your Profile</h1>
                    <p className="text-[var(--color-textSecondary)]">
                        We've got your Google account info. Just fill in the details below to complete your registration.
                    </p>
                </div>

                {googleUser?.picture && (
                    <div className="text-center mb-6">
                        <img
                            src={googleUser.picture}
                            alt="Profile"
                            className="w-20 h-20 rounded-full mx-auto border-4 border-[var(--color-border)]"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="First name"
                                    className="pl-10"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Last name"
                                    className="pl-10"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled
                            />
                        </div>
                        <p className="mt-1 text-xs text-[var(--color-textSecondary)]">
                            This email is from your Google account and cannot be changed
                        </p>
                    </div>

                    <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-[var(--color-primary)]">
                                    Google Account Connected
                                </h3>
                                <div className="mt-2 text-sm text-[var(--color-textSecondary)]">
                                    <p>
                                        By continuing, you agree to our Terms of Service and Privacy Policy.
                                        Your Google account will be linked to your dashboard account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Complete Registration
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--color-border)]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--color-surface)] text-[var(--color-textSecondary)]">
                                Or
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={onSwitchToSignUp}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Use Email Instead
                        </Button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--color-textSecondary)]">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-[var(--color-primary)] hover:underline font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
