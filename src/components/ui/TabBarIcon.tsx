import React from 'react';
import { Text, TextStyle } from 'react-native';

export interface TabBarIconProps {
  name: string;
  size?: number;
  color?: string;
  focused?: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  size = 24,
  color = '#9CA3AF',
  focused = false,
}) => {
  const getIcon = (): string => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Record':
        return '🎙️';
      case 'History':
        return '📊';
      case 'Profile':
        return '👤';
      default:
        return '📱';
    }
  };

  const iconStyle: TextStyle = {
    fontSize: size,
    color,
    textAlign: 'center',
    lineHeight: size,
  };

  return <Text style={iconStyle}>{getIcon()}</Text>;
};

export { TabBarIcon };