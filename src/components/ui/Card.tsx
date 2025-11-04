import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { MotiView } from 'moti';
import LinearGradient from 'expo-linear-gradient';
import { BaseComponent } from '@/types/common';

export interface CardProps extends BaseComponent {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  padding?: number | 'none' | 'small' | 'medium' | 'large';
  margin?: number | 'none' | 'small' | 'medium' | 'large';
  borderRadius?: number;
  shadow?: boolean;
  onPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
  style?: ViewStyle;
  gradientColors?: string[];
  animation?: boolean;
  entranceAnimation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'slideLeft';
  delay?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  padding = 'medium',
  margin = 'none',
  borderRadius = 12,
  shadow = true,
  onPress,
  activeOpacity = 0.8,
  disabled = false,
  style,
  gradientColors,
  animation = true,
  entranceAnimation = 'fadeIn',
  delay = 0,
  testID,
  accessibilityLabel,
  accessible = true,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius,
      overflow: 'hidden',
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        minHeight: 80,
      },
      medium: {
        minHeight: 120,
      },
      large: {
        minHeight: 160,
      },
    };

    // Padding styles
    const paddingStyles: Record<string, ViewStyle> = {
      none: {},
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 20 },
    };

    // Margin styles
    const marginStyles: Record<string, ViewStyle> = {
      none: {},
      small: { margin: 8 },
      medium: { margin: 16 },
      large: { margin: 24 },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8F4FD',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: shadow ? 0.1 : 0,
        shadowRadius: shadow ? 3.84 : 0,
        elevation: shadow ? 5 : 0,
      },
      outlined: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#4BA3F2',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: shadow ? 0.05 : 0,
        shadowRadius: shadow ? 2.22 : 0,
        elevation: shadow ? 3 : 0,
      },
      elevated: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: shadow ? 0.15 : 0,
        shadowRadius: shadow ? 6.27 : 0,
        elevation: shadow ? 10 : 0,
      },
      gradient: {
        borderWidth: 0,
        shadowColor: '#4BA3F2',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: shadow ? 0.2 : 0,
        shadowRadius: shadow ? 8 : 0,
        elevation: shadow ? 12 : 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...paddingStyles[typeof padding === 'number' ? 'medium' : padding],
      ...marginStyles[typeof margin === 'number' ? 'medium' : margin],
      ...variantStyles[variant],
      ...(typeof padding === 'number' && { padding }),
      ...(typeof margin === 'number' && { margin }),
      ...style,
    };
  };

  const getEntranceAnimation = () => {
    switch (entranceAnimation) {
      case 'slideUp':
        return {
          from: { opacity: 0, translateY: 20 },
          animate: { opacity: 1, translateY: 0 },
        };
      case 'scaleIn':
        return {
          from: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'slideLeft':
        return {
          from: { opacity: 0, translateX: 20 },
          animate: { opacity: 1, translateX: 0 },
        };
      case 'fadeIn':
      default:
        return {
          from: { opacity: 0 },
          animate: { opacity: 1 },
        };
    }
  };

  const cardStyle = getCardStyle();
  const entranceConfig = getEntranceAnimation();

  const CardContent = () => {
    if (variant === 'gradient' && gradientColors) {
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        >
          {children}
        </LinearGradient>
      );
    }

    return <>{children}</>;
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (onPress) {
      return (
        <TouchableOpacity
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          accessible={accessible}
          accessibilityRole={onPress ? 'button' : 'none'}
          accessibilityState={{ disabled }}
          style={cardStyle}
          onPress={onPress}
          activeOpacity={activeOpacity}
          disabled={disabled}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {children}
        </TouchableOpacity>
      );
    }

    return (
      <View
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessible={accessible}
        style={cardStyle}
      >
        {children}
      </View>
    );
  };

  if (!animation) {
    return (
      <CardWrapper>
        <CardContent />
      </CardWrapper>
    );
  }

  return (
    <MotiView
      from={entranceConfig.from}
      animate={entranceConfig.animate}
      transition={{
        type: 'timing',
        duration: 400,
        delay,
      }}
      whileTap={onPress ? { scale: 0.98 } : undefined}
    >
      <CardWrapper>
        <CardContent />
      </CardWrapper>
    </MotiView>
  );
};

export default Card;