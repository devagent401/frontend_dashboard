'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { GoogleIcon } from '@/icons/Icons';

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginProps {
    onSwitchToSignUp: () => void;
    onSwitchToGoogleSignUp: () => void;
    onLogin: (data: LoginFormData) => void;
}

export function Login({ onSwitchToSignUp, onSwitchToGoogleSignUp, onLogin }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = (data: LoginFormData) => {
        onLogin(data);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-[var(--color-surface)] rounded-lg p-8 border border-[var(--color-border)] shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Welcome Back</h1>
                    <p className="text-[var(--color-textSecondary)]">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-[var(--color-error)]">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="pl-10 pr-10"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-textSecondary)] hover:text-[var(--color-text)]"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-[var(--color-error)]">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                            <span className="ml-2 text-sm text-[var(--color-textSecondary)]">Remember me</span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-[var(--color-primary)] hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <Button type="submit" className="w-full bg-[var(--color-primary)] text-[var(--color-background)]">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--color-border)]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--color-surface)] text-[var(--color-textSecondary)]">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={onSwitchToGoogleSignUp}
                        >
                            <GoogleIcon className="w-5 h-5 mr-2" />
                            Continue with Google
                        </Button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--color-textSecondary)]">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToSignUp}
                            className="text-[var(--color-primary)] hover:underline font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
