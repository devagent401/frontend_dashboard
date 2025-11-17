/**
 * Reset password form component
 */

import React, { FormEvent, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthButton } from './AuthButton';

// ============================================================================
// Props
// ============================================================================

interface ResetPasswordFormProps {
    token: string;
    onSuccess?: () => void;
    className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ResetPasswordForm({
    token,
    onSuccess,
    className = '',
}: ResetPasswordFormProps): JSX.Element {
    const { resetPassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setValidationError(null);

            if (!newPassword || !confirmPassword) {
                setValidationError('All fields are required');
                return;
            }

            if (newPassword !== confirmPassword) {
                setValidationError('Passwords do not match');
                return;
            }

            if (newPassword.length < 8) {
                setValidationError('Password must be at least 8 characters');
                return;
            }

            resetPassword.mutate(
                { token, new_password: newPassword },
                {
                    onSuccess: () => {
                        setIsSubmitted(true);
                        onSuccess?.();
                    },
                }
            );
        },
        [newPassword, confirmPassword, token, resetPassword, onSuccess]
    );

    const errorMessage = validationError || resetPassword.error?.message;

    if (isSubmitted) {
        return (
            <div className={`auth-form ${className}`}>
                <div className="auth-form__header">
                    <h2 className="auth-form__title">Password Reset Successful</h2>
                    <p className="auth-form__subtitle">
                        Your password has been successfully reset.
                    </p>
                </div>

                <div className="auth-form__success">
                    <p>You can now sign in with your new password.</p>
                </div>

                <AuthButton
                    type="button"
                    fullWidth
                    onClick={onSuccess}
                >
                    Go to Login
                </AuthButton>
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
                <h2 className="auth-form__title">Reset Password</h2>
                <p className="auth-form__subtitle">
                    Enter your new password below.
                </p>
            </div>

            {errorMessage && (
                <div className="auth-form__error">
                    {errorMessage}
                </div>
            )}

            <div className="auth-form__fields">
                <div className="auth-form__field">
                    <label htmlFor="newPassword" className="auth-form__label">
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        className="auth-form__input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        autoComplete="new-password"
                        disabled={resetPassword.isPending}
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
                        placeholder="Confirm new password"
                        required
                        autoComplete="new-password"
                        disabled={resetPassword.isPending}
                    />
                </div>
            </div>

            <AuthButton
                type="submit"
                fullWidth
                isLoading={resetPassword.isPending}
                disabled={!newPassword || !confirmPassword}
            >
                Reset Password
            </AuthButton>
        </form>
    );
}

