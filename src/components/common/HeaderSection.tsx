import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../utils/tailwind';

interface HeaderSectionProps {
  label: string;
  title: string;
  subtitle?: string;
  containerStyle?: any;
}

export default function HeaderSection({ label, title, subtitle, containerStyle }: HeaderSectionProps) {
  return (
    <View style={[tw`gap-y-5`, containerStyle]}>
      <Text style={tw`text-[#008C75] text-base font-semibold`}>
        {label}
      </Text>
      <Text style={tw`text-2xl font-bold text-gray-900 leading-tight`}>
        {title}
      </Text>
      {subtitle && (
        <Text style={tw`text-gray-500 text-sm leading-relaxed`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
