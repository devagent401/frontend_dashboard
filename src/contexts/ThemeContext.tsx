'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContextType, ColorPalette } from '@/types/theme';
import { colorPalettes } from '@/data/colorPalettes';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [currentPalette, setCurrentPalette] = useState<ColorPalette>(colorPalettes[0]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile view
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Apply CSS custom properties when palette changes
    useEffect(() => {
        const root = document.documentElement;
        Object.entries(currentPalette.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }, [currentPalette]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const value: ThemeContextType = {
        currentPalette,
        setCurrentPalette,
        isSidebarCollapsed,
        toggleSidebar,
        isMobile,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
