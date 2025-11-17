'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { colorPalettes } from '@/data/colorPalettes';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPaletteSelectorProps {
    className?: string;
}

export function ColorPaletteSelector({ className }: ColorPaletteSelectorProps) {
    const { currentPalette, setCurrentPalette } = useTheme();

    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Color Themes</h3>
                <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center">
                    <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: currentPalette.colors.primary }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {colorPalettes.map((palette) => (
                    <button
                        key={palette.id}
                        onClick={() => setCurrentPalette(palette)}
                        className={cn(
                            'relative p-4 rounded-xl border-2 transition-all duration-300 group',
                            'hover:scale-105 hover:shadow-lg',
                            currentPalette.id === palette.id
                                ? 'border-[var(--color-primary)] shadow-lg bg-[var(--color-primary)]/5'
                                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-surface)]'
                        )}
                    >
                        <div className="space-y-3">
                            {/* Color Swatches */}
                            <div className="flex gap-2 justify-center">
                                <div
                                    className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                                    style={{ backgroundColor: palette.colors.primary }}
                                    title="Primary"
                                />
                                <div
                                    className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                                    style={{ backgroundColor: palette.colors.secondary }}
                                    title="Secondary"
                                />
                                <div
                                    className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                                    style={{ backgroundColor: palette.colors.accent }}
                                    title="Accent"
                                />
                            </div>

                            {/* Theme Name */}
                            <div className="text-center">
                                <div className="text-xs font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                                    {palette.name}
                                </div>
                            </div>
                        </div>

                        {/* Selected Indicator */}
                        {currentPalette.id === palette.id && (
                            <div className="absolute top-2 right-2 bg-[var(--color-primary)] rounded-full p-1 shadow-lg">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}

                        {/* Hover Effect */}
                        <div className={cn(
                            'absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-[var(--color-primary)]/5',
                            'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                        )} />
                    </button>
                ))}
            </div>

            {/* Current Theme Info */}
            <div className="pt-2 border-t border-[var(--color-border)]">
                <div className="text-xs text-[var(--color-textSecondary)] text-center">
                    Current: <span className="font-medium text-[var(--color-primary)]">{currentPalette.name}</span>
                </div>
            </div>
        </div>
    );
}
