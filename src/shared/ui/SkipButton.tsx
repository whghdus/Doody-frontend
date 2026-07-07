import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '@/shared/lib/tailwind';

interface SkipButtonProps {
  onPress: () => void;
  label?: string;
  style?: any;
}

export default function SkipButton({ onPress, label = '건너뛰기', style }: SkipButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[tw`bg-white/90 px-4 py-2 rounded-full border border-gray-100 shadow-sm flex-row items-center`, style]}
    >
      <Text style={tw`text-gray-500 text-xs font-medium mr-1`}>
        {label}
      </Text>
      <Svg width={6} height={8} viewBox="0 0 6 8" fill="none">
        <Path
          d="M1 1L4 4L1 7"
          stroke="#9CA3AF"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}
