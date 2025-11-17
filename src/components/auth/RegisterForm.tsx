/**
 * Registration form component
 */

import React, { FormEvent, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthButton } from './AuthButton';

// ============================================================================
// Props
// ============================================================================

interface RegisterFormProps {
    onSuccess?: () => void;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function RegisterForm({
    onSuccess,
    className = '',
}: RegisterFormProps): JSX.Element {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setValidationError(null);

            if (!name || !email || !password || !confirmPassword) {
                setValidationError('All fields are required');
                return;
            }

            if (password !== confirmPassword) {
                setValidationError('Passwords do not match');
                return;
            }

            if (password.length < 8) {
                setValidationError('Password must be at least 8 characters');
                return;
            }

            register.mutate(
                { name, email, password },
                {
                    onSuccess: () => {
                        onSuccess?.();
                    },
                }
            );
        },
        [name, email, password, confirmPassword, register, onSuccess]
    );

    const errorMessage = validationError || register.error?.message;

    return (
        <form
            className={`auth-form ${className}`}
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="auth-form__header">
                <h2 className="auth-form__title">Create Account</h2>
                <p className="auth-form__subtitle">Sign up to get started.</p>
            </div>

            {errorMessage && (
                <div className="auth-form__error">
                    {errorMessage}
                </div>
            )}

            <div className="auth-form__fields">
                <div className="auth-form__field">
                    <label htmlFor="name" className="auth-form__label">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="auth-form__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        autoComplete="name"
                        disabled={register.isPending}
                    />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="email" className="auth-form__label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="auth-form__input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        disabled={register.isPending}
                    />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="password" className="auth-form__label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="auth-form__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        autoComplete="new-password"
                        disabled={register.isPending}
                    />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="confirmPassword" className="auth-form__label">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="auth-form__input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        autoComplete="new-password"
                        disabled={register.isPending}
                    />
                </div>
            </div>

            <AuthButton
                type="submit"
                fullWidth
                isLoading={register.isPending}
                disabled={!name || !email || !password || !confirmPassword}
            >
                Create Account
            </AuthButton>
        </form>
    );
}

