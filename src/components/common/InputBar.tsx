import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import { COLORS } from '../../constants/theme';

interface InputBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isDisabled?: boolean;
  style?: any;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
}

export default function InputBar({
  placeholder,
  value,
  onChangeText,
  onSubmit,
  isDisabled = false,
  style,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
}: InputBarProps) {
  return (
    <View style={[tw`flex-row items-center bg-white border border-gray-200 rounded-full pl-5 pr-2 py-1.5 shadow-sm`, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="send"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        style={tw`flex-1 text-gray-800 text-sm`}
      />
      <TouchableOpacity
        onPress={onSubmit}
        activeOpacity={0.8}
        disabled={isDisabled}
        style={tw`w-10 h-10 rounded-full items-center justify-center ${
          isDisabled ? 'bg-gray-200' : `bg-[${COLORS.primary}]`
        }`}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 19V5M12 5L5 12M12 5L19 12"
            stroke={isDisabled ? '#9CA3AF' : '#FFFFFF'}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}
