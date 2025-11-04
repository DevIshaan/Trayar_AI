import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { MotiView } from 'moti';
import { BaseComponent } from '@/types/common';

export interface InputProps extends BaseComponent, TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  animation?: boolean;
  animateOnFocus?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  showPasswordToggle = false,
  fullWidth = true,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  animation = true,
  animateOnFocus = true,
  testID,
  accessibilityLabel,
  accessible = true,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setIsSecure(secureTextEntry);
  }, [secureTextEntry]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    textInputProps.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    textInputProps.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setIsSecure(!isSecure);
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      outlined: {
        backgroundColor: '#FFFFFF',
        borderColor: error ? '#EF4444' : isFocused ? '#4BA3F2' : '#E5E7EB',
      },
      filled: {
        backgroundColor: error ? '#FEF2F2' : isFocused ? '#F0F9FF' : '#F9FAFB',
        borderColor: error ? '#EF4444' : isFocused ? '#4BA3F2' : 'transparent',
        borderWidth: error ? 1 : 0,
      },
      underlined: {
        backgroundColor: 'transparent',
        borderColor: error ? '#EF4444' : isFocused ? '#4BA3F2' : '#E5E7EB',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderRadius: 0,
        paddingHorizontal: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 24,
      color: '#111827',
      textAlignVertical: 'center',
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

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...inputStyle,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      color: error ? '#EF4444' : '#374151',
      marginBottom: 6,
      fontFamily: 'Inter',
      ...labelStyle,
    };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      fontSize: 12,
      lineHeight: 16,
      color: '#EF4444',
      marginTop: 4,
      fontFamily: 'Inter',
      ...errorStyle,
    };
  };

  const getHelperTextStyle = (): TextStyle => {
    return {
      fontSize: 12,
      lineHeight: 16,
      color: '#6B7280',
      marginTop: 4,
      fontFamily: 'Inter',
    };
  };

  const inputContainerStyle = getInputContainerStyle();
  const inputTextStyle = getInputStyle();
  const labelTextStyle = getLabelStyle();
  const errorTextStyle = getErrorStyle();

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <MotiView
        style={{ marginRight: 8 }}
        animate={{
          scale: isFocused ? 1.1 : 1,
          opacity: isFocused ? 1 : 0.7,
        }}
        transition={{ type: 'timing', duration: 200 }}
      >
        {leftIcon}
      </MotiView>
    );
  };

  const renderRightIcon = () => {
    if (!rightIcon && !showPasswordToggle) return null;

    if (showPasswordToggle && secureTextEntry) {
      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 8 }}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
        >
          <MotiView
            animate={{
              scale: isFocused ? 1.1 : 1,
              opacity: isFocused ? 1 : 0.7,
            }}
            transition={{ type: 'timing', duration: 200 }}
          >
            {/* Password visibility icon would go here */}
            <Text style={{ fontSize: 18, color: '#6B7280' }}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </MotiView>
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      const IconContainer = onRightIconPress ? TouchableOpacity : View;
      return (
        <IconContainer
          onPress={onRightIconPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginLeft: 8 }}
          accessibilityRole={onRightIconPress ? 'button' : undefined}
        >
          <MotiView
            animate={{
              scale: isFocused ? 1.1 : 1,
              opacity: isFocused ? 1 : 0.7,
            }}
            transition={{ type: 'timing', duration: 200 }}
          >
            {rightIcon}
          </MotiView>
        </IconContainer>
      );
    }

    return null;
  };

  const InputComponent = (
    <View style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <Text
          selectable={false}
          style={labelTextStyle}
          accessible={false}
        >
          {label}
        </Text>
      )}

      <MotiView
        animate={{
          scale: animateOnFocus && isFocused ? 1.02 : 1,
        }}
        transition={{ type: 'timing', duration: 200 }}
      >
        <View
          testID={testID}
          style={inputContainerStyle}
        >
          {renderLeftIcon()}

          <TextInput
            ref={inputRef}
            style={inputTextStyle}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isSecure}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={accessibilityLabel}
            accessible={accessible}
            importantForAccessibility={accessible ? 'yes' : 'no'}
            clearButtonMode="while-editing"
            enablesReturnKeyAutomatically
            keyboardAppearance="light"
            {...textInputProps}
          />

          {renderRightIcon()}
        </View>
      </MotiView>

      {error && (
        <MotiView
          from={{ opacity: 0, translateY: -5 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 200 }}
        >
          <Text
            selectable={false}
            style={errorTextStyle}
            accessible={true}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        </MotiView>
      )}

      {!error && helperText && (
        <Text
          selectable={false}
          style={getHelperTextStyle()}
          accessible={true}
          accessibilityRole="text"
        >
          {helperText}
        </Text>
      )}
    </View>
  );

  if (!animation) {
    return InputComponent;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      {InputComponent}
    </MotiView>
  );
};

export default Input;