export interface ColorPalette {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        success: string;
        warning: string;
        error: string;
        info: string;
    };
}

export interface ThemeContextType {
    currentPalette: ColorPalette;
    setCurrentPalette: (palette: ColorPalette) => void;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    isMobile: boolean;
}
