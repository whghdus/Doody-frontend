// src/components/common/SimpleBackButton.tsx
import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '../../utils/tailwind';

interface SimpleBackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export default function SimpleBackButton({ onPress, style, color = '#1F2A26' }: SimpleBackButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[tw`w-8 h-8 items-center justify-center`, style]}
      activeOpacity={0.7}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path 
          d="M15 19L8 12L15 5" 
          stroke={color} 
          strokeWidth={2.5} 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </Svg>
    </TouchableOpacity>
  );
}
