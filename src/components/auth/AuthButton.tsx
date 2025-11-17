/**
 * Reusable button component for auth forms
 */

import React, { ButtonHTMLAttributes } from 'react';

// ============================================================================
// Props
// ============================================================================

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
    fullWidth?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function AuthButton({
    children,
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    disabled,
    className = '',
    ...props
}: AuthButtonProps): JSX.Element {
    const baseStyles = 'auth-button';
    const variantStyles = `auth-button--${variant}`;
    const widthStyles = fullWidth ? 'auth-button--full-width' : '';
    const loadingStyles = isLoading ? 'auth-button--loading' : '';
    const disabledStyles = disabled || isLoading ? 'auth-button--disabled' : '';

    const combinedClassName = [
        baseStyles,
        variantStyles,
        widthStyles,
        loadingStyles,
        disabledStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={combinedClassName}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="auth-button__spinner"></span>
                    <span className="auth-button__text">{children}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}

