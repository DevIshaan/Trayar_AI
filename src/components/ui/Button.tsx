import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import styles
import { BaseComponent } from '@/types/common';

export interface ButtonProps extends BaseComponent {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animation?: boolean;
  haptic?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  animation = true,
  haptic = true,
  testID,
  accessibilityLabel,
  accessible = true,
}) => {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (disabled || loading) return;

    if (haptic) {
      // Add haptic feedback
      if (Platform.OS === 'ios') {
        // iOS haptic feedback would go here
      }
    }

    onPress();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
      minWidth: fullWidth ? '100%' : 120,
      opacity: disabled ? 0.5 : 1,
    };

    // Size variants
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: '#4BA3F2',
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#4BA3F2',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#4BA3F2',
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      danger: {
        backgroundColor: '#EF4444',
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: 'Inter',
      fontWeight: '600',
      textAlign: 'center',
      marginHorizontal: icon ? 8 : 0,
    };

    // Size text styles
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: 14,
        lineHeight: 20,
      },
      medium: {
        fontSize: 16,
        lineHeight: 24,
      },
      large: {
        fontSize: 18,
        lineHeight: 28,
      },
    };

    // Variant text styles
    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: '#FFFFFF',
      },
      secondary: {
        color: '#4BA3F2',
      },
      outline: {
        color: '#4BA3F2',
      },
      ghost: {
        color: '#4BA3F2',
      },
      danger: {
        color: '#FFFFFF',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  const buttonStyle = getButtonStyle();
  const textStyle = getTextStyle();

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#4BA3F2'}
          style={{ marginRight: icon ? 8 : 0 }}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 200 }}
        >
          {icon}
        </MotiView>
      )}
      <Text
        style={textStyle}
        selectable={false}
        maxFontSizeMultiplier={1.2}
      >
        {title}
      </Text>
      {!loading && icon && iconPosition === 'right' && (
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 200 }}
        >
          {icon}
        </MotiView>
      )}
    </>
  );

  const TouchableComponent = (
    <TouchableOpacity
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <ButtonContent />
    </TouchableOpacity>
  );

  if (!animation) {
    return TouchableComponent;
  }

  return (
    <MotiView
      from={{ scale: 1 }}
      animate={{
        scale: disabled ? 1 : 1,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', duration: 200 }}
    >
      {TouchableComponent}
    </MotiView>
  );
};

export default Button;