'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface SignUpProps {
    onSwitchToLogin: () => void;
    onSwitchToGoogleSignUp: () => void;
    onSignUp: (data: SignUpFormData) => void;
}

export function SignUp({ onSwitchToLogin, onSwitchToGoogleSignUp, onSignUp }: SignUpProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>();

    const password = watch('password');

    const onSubmit = (data: SignUpFormData) => {
        onSignUp(data);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-[var(--color-surface)] rounded-lg p-8 border border-[var(--color-border)] shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Create Account</h1>
                    <p className="text-[var(--color-textSecondary)]">Sign up to get started</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="First name"
                                    className="pl-10"
                                    {...register('firstName', {
                                        required: 'First name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'First name must be at least 2 characters'
                                        }
                                    })}
                                />
                            </div>
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-[var(--color-error)]">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Last name"
                                    className="pl-10"
                                    {...register('lastName', {
                                        required: 'Last name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Last name must be at least 2 characters'
                                        }
                                    })}
                                />
                            </div>
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-[var(--color-error)]">{errors.lastName.message}</p>
                            )}
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
                                placeholder="Create a password"
                                className="pl-10 pr-10"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters'
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-textSecondary)] hover:text-[var(--color-text)]"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-[var(--color-error)]">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            {...register('terms', {
                                required: 'You must accept the terms and conditions'
                            })}
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-[var(--color-textSecondary)]">
                            I agree to the{' '}
                            <button type="button" className="text-[var(--color-primary)] hover:underline">
                                Terms and Conditions
                            </button>{' '}
                            and{' '}
                            <button type="button" className="text-[var(--color-primary)] hover:underline">
                                Privacy Policy
                            </button>
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="text-sm text-[var(--color-error)]">{errors.terms.message}</p>
                    )}

                    <Button type="submit" className="w-full">
                        Create Account
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
                            variant="outline"
                            className="w-full"
                            onClick={onSwitchToGoogleSignUp}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                            Continue with Google
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
