import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// Import theme types
import { Theme, ThemeColors } from '@/types/common';

// Define the default theme
const defaultColors: ThemeColors = {
  primary: '#4BA3F2',
  secondary: '#FFFFFF',
  accent: {
    50: '#E8F4FD',
    100: '#D1E9FB',
    200: '#A8D4F6',
    300: '#7FBFF1',
    400: '#4BA3F2',
    500: '#2E8FD8',
    600: '#1E7BC7',
    700: '#1565A7',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  success: {
    50: '#F0FDF4',
    500: '#22C55E',
    600: '#16A34A',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },
};

const defaultTheme: Theme = {
  colors: defaultColors,
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont'],
      mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    },
  },
};

// Theme Context
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Partial<Theme>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Partial<Theme>;
  followSystemTheme?: boolean;
}

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: customTheme = {},
  followSystemTheme = false,
}) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(followSystemTheme ? colorScheme === 'dark' : false);
  const [currentTheme, setCurrentTheme] = useState<Theme>({
    ...defaultTheme,
    ...customTheme,
  });

  // Update theme when system theme changes
  useEffect(() => {
    if (followSystemTheme) {
      setIsDark(colorScheme === 'dark');
    }
  }, [colorScheme, followSystemTheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Update theme function
  const setTheme = (themeUpdates: Partial<Theme>) => {
    setCurrentTheme((prevTheme) => ({
      ...prevTheme,
      ...themeUpdates,
    }));
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme: currentTheme,
      isDark,
      colors: currentTheme.colors,
      toggleTheme,
      setTheme,
    }),
    [currentTheme, isDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get theme colors
export const useThemeColors = (): ThemeColors => {
  const { colors } = useTheme();
  return colors;
};

// Hook to get theme spacing
export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

// Theme utilities
export const createTheme = (overrides: Partial<Theme>): Theme => {
  return {
    ...defaultTheme,
    ...overrides,
    colors: {
      ...defaultColors,
      ...(overrides.colors || {}),
    },
  };
};

export const withAlpha = (color: string, alpha: number): string => {
  // Simple alpha blending with white background
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const lightenColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const darkenColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export default ThemeContext;