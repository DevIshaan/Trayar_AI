import { ReactNode } from 'react';

// Common UI component types
export interface BaseComponent {
  testID?: string;
  accessibilityLabel?: string;
  accessible?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  error: Error | string | null;
  canRetry?: boolean;
  onRetry?: () => void;
}

export interface EmptyState {
  isEmpty: boolean;
  message: string;
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// Form types
export interface FormField {
  name: string;
  value: string;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
}

export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Modal types
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  animationType?: 'fade' | 'slide' | 'none';
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
}

// List/Item types
export interface ListItem<T = any> {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  data?: T;
  icon?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  rightComponent?: ReactNode;
  disabled?: boolean;
}

// Selection types
export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

export interface MultiSelectState<T = string> {
  selected: T[];
  options: SelectOption<T>[];
  isOpen: boolean;
  searchQuery?: string;
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule | ValidationRule[];
}

// Animation types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  type?: 'spring' | 'timing' | 'decay';
  easing?: string;
  useNativeDriver?: boolean;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: {
    50: string;
    500: string;
    600: string;
  };
  warning: {
    50: string;
    500: string;
    600: string;
  };
  error: {
    50: string;
    500: string;
    600: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: {
      sans: string[];
      mono: string[];
    };
  };
}

// Permission types
export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'blocked' | 'unavailable';
}

export type PermissionType =
  | 'audioRecording'
  | 'photos'
  | 'camera'
  | 'notifications'
  | 'storage';

// DateTime types
export type DateString = string; // ISO 8601 format
export type TimeString = string; // HH:MM format

export interface DateRange {
  start: DateString;
  end: DateString;
}

// File system types
export interface FileInfo {
  uri: string;
  name: string;
  size: number;
  type?: string;
  lastModified?: number;
}

// Keyboard types
export interface KeyboardState {
  isVisible: boolean;
  height: number;
}

// Dimensions
export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

// Misc utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};