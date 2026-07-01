import { Image } from 'expo-image';
// src/screens/OnboardingHatch.tsx — Screen 7: 두디 시작하기
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import DoodySvg from '../../assets/doody/Doody.webp';
import { COLORS } from '../../constants/theme';
import { useOnboardingStore } from '../../store/useOnboardingStore';

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
          <Text style={tw`text-gray-700 text-base text-center leading-relaxed font-semibold`}>
            반가워!{'\n'}
            너가 원하는 목표에 다가가기 위해{'\n'}
            나와 매일 한 칸 씩 나아가보자
          </Text>
        </View>

        {/* Bottom Spacer + Button */}
        <View style={tw`flex-1 justify-end pb-8`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              try {
                await useOnboardingStore.getState().submitOnboarding();
                onFinish();
              } catch (error: any) {
                console.error('Failed to submit onboarding', error);
                Alert.alert(
                  '회원가입 실패',
                  error.response?.data?.message || '회원가입 중 에러가 발생했습니다.'
                );
              }
            }}
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
