import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MotiView } from 'moti';
import { BaseComponent } from '@/types/common';

export interface LoadingProps extends BaseComponent {
  size?: 'small' | 'large';
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'shimmer';
  color?: string;
  backgroundColor?: string;
  overlay?: boolean;
  fullscreen?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animation?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  message,
  variant = 'spinner',
  color = '#4BA3F2',
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  overlay = false,
  fullscreen = false,
  style,
  textStyle,
  animation = true,
  testID,
  accessibilityLabel = 'Loading indicator',
  accessible = true,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    };

    if (fullscreen) {
      return {
        ...baseStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlay ? backgroundColor : 'transparent',
        zIndex: 1000,
      };
    }

    if (overlay) {
      return {
        ...baseStyle,
        backgroundColor,
        borderRadius: 12,
        margin: 20,
      };
    }

    return {
      ...baseStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    return {
      fontSize: 16,
      lineHeight: 24,
      color: '#374151',
      textAlign: 'center',
      marginTop: 12,
      fontFamily: 'Inter',
      fontWeight: '500',
      ...textStyle,
    };
  };

  const renderSpinner = () => (
    <ActivityIndicator
      size={size}
      color={color}
      animating={true}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    />
  );

  const renderDots = () => {
    const dotSize = size === 'small' ? 8 : 12;
    const spacing = 8;

    return (
      <MotiView style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[0, 1, 2].map((index) => (
          <MotiView
            key={index}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              marginHorizontal: spacing / 2,
            }}
            from={{
              scale: 0.8,
              opacity: 0.4,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              type: 'timing',
              duration: 1200,
              loop: true,
              repeatReverse: true,
              delay: index * 200,
            }}
          />
        ))}
      </MotiView>
    );
  };

  const renderPulse = () => (
    <MotiView
      style={{
        width: size === 'small' ? 32 : 48,
        height: size === 'small' ? 32 : 48,
        borderRadius: size === 'small' ? 16 : 24,
        backgroundColor: color,
      }}
      from={{
        scale: 0.8,
        opacity: 0.8,
      }}
      animate={{
        scale: [0.8, 1.1, 0.8],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        type: 'timing',
        duration: 1500,
        loop: true,
        repeatReverse: true,
      }}
    />
  );

  const renderShimmer = () => (
    <MotiView
      style={{
        width: size === 'small' ? 60 : 100,
        height: size === 'small' ? 20 : 30,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
      }}
    >
      <MotiView
        style={{
          width: '60%',
          height: '100%',
          backgroundColor: color,
          opacity: 0.3,
        }}
        from={{
          translateX: -60,
        }}
        animate={{
          translateX: 160,
        }}
        transition={{
          type: 'timing',
          duration: 1200,
          loop: true,
        }}
      />
    </MotiView>
  );

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'shimmer':
        return renderShimmer();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  const containerStyle = getContainerStyle();
  const textStyle = getTextStyle();

  const LoadingContent = (
    <View style={containerStyle}>
      {renderLoadingIndicator()}
      {message && (
        <Text
          style={textStyle}
          selectable={false}
          maxFontSizeMultiplier={1.2}
        >
          {message}
        </Text>
      )}
    </View>
  );

  if (!animation) {
    return LoadingContent;
  }

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 300 }}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      accessibilityLiveRegion="polite"
    >
      {LoadingContent}
    </MotiView>
  );
};

export default Loading;