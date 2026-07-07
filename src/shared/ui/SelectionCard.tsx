import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '@/shared/lib/tailwind';

interface SelectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  isSelected: boolean;
  onPress: () => void;
  emoji?: string;
  showCheckmark?: boolean;
  style?: any;
  contentStyle?: any;
}

export default function SelectionCard({
  id,
  title,
  subtitle,
  isSelected,
  onPress,
  emoji,
  showCheckmark = false,
  style,
  contentStyle,
}: SelectionCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        tw`bg-white rounded-3xl p-5 border ${
          isSelected ? 'border-[#008C75] shadow-md' : 'border-gray-100 shadow-sm'
        }`,
        style,
      ]}
    >
      {/* With Emoji and Checkmark */}
      {emoji && showCheckmark && (
        <View style={tw`flex-row justify-between items-start`}>
          <View style={tw`flex-row items-start flex-1`}>
            <Text style={tw`text-2xl mr-3`}>{emoji}</Text>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-900 font-bold`}>{title}</Text>
              {subtitle && (
                <Text style={tw`text-gray-400 text-xs font-semibold mt-1`}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          <View style={tw`w-6 h-6 rounded-full border items-center justify-center ${
            isSelected ? 'bg-[#008C75] border-[#008C75]' : 'border-gray-200 bg-gray-50'
          }`}>
            {isSelected && (
              <Svg width={12} height={8} viewBox="0 0 12 8" fill="none">
                <Path
                  d="M1 4L4.5 7L11 1"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          </View>
        </View>
      )}

      {/* Badge + QUEST format (Goal style) */}
      {!emoji && showCheckmark && (
        <>
          <View style={tw`flex-row justify-between items-start mb-3`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-12 h-8 rounded-lg items-center justify-center mr-3 ${
                isSelected ? 'bg-[#008C75]' : 'bg-[#E6F4F1]'
              }`}>
                <Text style={tw`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-[#008C75]'}`}>
                  {id}
                </Text>
              </View>
              <Text style={tw`text-[#008C75] text-xs font-extrabold`}>
                QUEST
              </Text>
            </View>

            <View style={tw`w-6 h-6 rounded-full border items-center justify-center ${
              isSelected ? 'bg-[#008C75] border-[#008C75]' : 'border-gray-200 bg-gray-50'
            }`}>
              {isSelected && (
                <Svg width={12} height={8} viewBox="0 0 12 8" fill="none">
                  <Path
                    d="M1 4L4.5 7L11 1"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </View>
          </View>

          <View style={[tw`mt-3`, contentStyle]}>
            <Text style={tw`text-gray-950 text-base font-bold`}>
              {title}
            </Text>
            {subtitle && (
              <Text style={tw`text-gray-400 text-xs font-semibold mt-1`}>
                {subtitle}
              </Text>
            )}
          </View>
        </>
      )}

      {/* Simple text only */}
      {!emoji && !showCheckmark && (
        <View style={contentStyle}>
          <Text style={tw`text-gray-900 font-bold`}>{title}</Text>
          {subtitle && (
            <Text style={tw`text-gray-400 text-xs font-semibold mt-1`}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
