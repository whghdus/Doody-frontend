import { Image } from 'expo-image';
// src/screens/OnboardingHatch.tsx — Screen 7: 두디 시작하기
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '@/shared/lib/tailwind';
import DoodySvg from '@/shared/assets/doody/Doody.webp';
import { COLORS } from '@/shared/config/theme';

interface OnboardingHatchProps {
  onFinish: () => void;
}

export default function OnboardingHatch({ onFinish }: OnboardingHatchProps) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View
        style={[
          tw`flex-1 px-6 justify-between`,
          Platform.OS === 'android' && { paddingBottom: insets.bottom + 32 },
        ]}
      >
        {/* Top Spacer */}
        <View style={tw`flex-1`} />

        {/* Center: Doody Character */}
        <View style={tw`items-center justify-center`}>
          <View style={tw`w-52 h-52 items-center justify-center mb-6`}>
            <Image source={DoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>

          {/* Welcome Message */}
          <Text style={tw`text-gray-800 text-[17px] text-center leading-[28px] font-bold`}>
            반가워! 난 너의 친구 두디야.{'\n'}
            네가 꿈꾸는 목표에 닿을 수 있게{'\n'}
            매일 한 칸씩 나와 함께 나아가볼까?
          </Text>
        </View>

        {/* Bottom Spacer + Button */}
        <View style={tw`flex-1 justify-end pb-8`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onFinish}
            style={tw`bg-[${COLORS.primary}] py-4 rounded-3xl w-full items-center shadow-lg`}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              두디랑 시작하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
