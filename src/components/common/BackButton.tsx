import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';

interface BackButtonProps {
  onPress: () => void;
  style?: any;
}

export default function BackButton({ onPress, style }: BackButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[tw`w-10 h-10 rounded-full bg-white/95 border border-gray-100 shadow-sm items-center justify-center`, style]}
    >
      <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
        <Path
          d="M7 13L1 7L7 1"
          stroke="#1F2A26"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
