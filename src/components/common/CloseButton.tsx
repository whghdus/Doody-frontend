// src/components/common/CloseButton.tsx
import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '../../utils/tailwind';

interface CloseButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function CloseButton({ onPress, style }: CloseButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[tw`w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center`, style]}
    >
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Path
          d="M13 1L1 13M1 1l12 12"
          stroke="#1F2A26"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
