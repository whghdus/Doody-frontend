import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface SpeechBubbleProps {
  text: string;
  sender: 'doody' | 'user';
  style?: any;
}

export default function SpeechBubble({ text, sender, style }: SpeechBubbleProps) {
  if (sender === 'doody') {
    return (
      <View style={[tw`bg-white rounded-3xl p-5 border border-gray-100 shadow-md w-full relative mb-4`, style]}>
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`bg-[#008C75] px-2.5 py-0.5 rounded-lg`}>
            <Text style={tw`text-white text-xs font-bold`}>🌱 두디</Text>
          </View>
        </View>
        <Text style={tw`text-gray-900 text-base font-bold leading-relaxed`}>
          {text}
        </Text>

        {/* Bubble pointer pointing down */}
        <View
          style={[
            tw`absolute bottom-[-9px] w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100/70`,
            { left: '50%', marginLeft: -8 },
          ]}
        />
      </View>
    );
  }

  // User message
  return (
    <View
      style={[
        tw`bg-white rounded-2xl px-5 py-3.5 border border-gray-100 shadow-lg`,
        style,
      ]}
    >
      <Text style={tw`text-gray-900 text-sm font-bold leading-relaxed`}>
        {text}
      </Text>

      {/* Pointer pointing down-right */}
      <View
        style={[
          tw`absolute bottom-[-6px] w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100/70`,
          { right: 20 },
        ]}
      />
    </View>
  );
}
