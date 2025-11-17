/**
 * Forgot password form component
 */

import React, { FormEvent, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthButton } from './AuthButton';

// ============================================================================
// Props
// ============================================================================

interface ForgotPasswordFormProps {
    onSuccess?: () => void;
    onBackToLogin?: () => void;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ForgotPasswordForm({
    onSuccess,
    onBackToLogin,
    className = '',
}: ForgotPasswordFormProps): JSX.Element {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!email) {
                return;
            }

            forgotPassword.mutate(
                { email },
                {
                    onSuccess: () => {
                        setIsSubmitted(true);
                        onSuccess?.();
                    },
                }
            );
        },
        [email, forgotPassword, onSuccess]
    );

    if (isSubmitted) {
        return (
            <div className={`auth-form ${className}`}>
                <div className="auth-form__header">
                    <h2 className="auth-form__title">Check Your Email</h2>
                    <p className="auth-form__subtitle">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                </div>

                <div className="auth-form__success">
                    <p>Please check your inbox and follow the instructions to reset your password.</p>
                </div>

                {onBackToLogin && (
                    <AuthButton
                        type="button"
                        variant="outline"
                        fullWidth
                        onClick={onBackToLogin}
                    >
                        Back to Login
                    </AuthButton>
                )}
            </div>
        );
    }

    return (
        <form
            className={`auth-form ${className}`}
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="auth-form__header">
                <h2 className="auth-form__title">Forgot Password?</h2>
                <p className="auth-form__subtitle">
                    Enter your email and we'll send you a link to reset your password.
                </p>
            </div>

            {forgotPassword.isError && (
                <div className="auth-form__error">
                    {forgotPassword.error?.message || 'Failed to send reset email. Please try again.'}
                </div>
            )}

            <div className="auth-form__fields">
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
                        disabled={forgotPassword.isPending}
                    />
                </div>
            </div>

            <div className="auth-form__actions">
                <AuthButton
                    type="submit"
                    fullWidth
                    isLoading={forgotPassword.isPending}
                    disabled={!email}
                >
                    Send Reset Link
                </AuthButton>

                {onBackToLogin && (
                    <AuthButton
                        type="button"
                        variant="outline"
                        fullWidth
                        onClick={onBackToLogin}
                        disabled={forgotPassword.isPending}
                    >
                        Back to Login
                    </AuthButton>
                )}
            </div>
        </form>
    );
}

