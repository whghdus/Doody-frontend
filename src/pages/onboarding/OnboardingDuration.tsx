import { Image } from 'expo-image';
// src/screens/OnboardingDuration.tsx — Screen 3: 두디가 고른 호흡 (표시 전용)
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '@/shared/lib/tailwind';
import BackButton from '@/shared/ui/BackButton';
import LaterButton from '@/shared/ui/LaterButton';
import StepIndicator from '@/shared/ui/StepIndicator';
import HeaderSection from '@/shared/ui/HeaderSection';
import EggSvg from '@/shared/assets/doody/egg.webp';
import { COLORS } from '@/shared/config/theme';

// goal_choice → recommended_period 결정론적 카탈로그
const PERIOD_CATALOG: Record<string, { id: string; label: string; description: string }> = {
  g1: { id: '1w', label: '1주', description: '작은 루틴을 만들기엔 1주가 딱 맞아.\n부담 없이 한 걸음씩 시작해봐.' },
  g2: { id: '1m', label: '1개월', description: '돈과 소비를 천천히 마주하려면\n1개월이 가장 안전한 호흡이야.' },
  g3: { id: '3m', label: '3개월', description: '취업·상담 지원 탐색엔 3개월이 필요해.\n단단히 준비할 수 있게 함께 걸어.' },
};

const DEFAULT_PERIOD = { id: '1w', label: '1주', description: '지금 목표에 딱 맞는 호흡으로 시작해봐.' };

interface OnboardingDurationProps {
  goalId: string;
  onNext: () => void;
  onBack: () => void;
  onLater: () => void;
}

export default function OnboardingDuration({ goalId, onNext, onBack, onLater }: OnboardingDurationProps) {
  const insets = useSafeAreaInsets();
  const period = PERIOD_CATALOG[goalId] ?? DEFAULT_PERIOD;

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={[
          tw`px-6 pt-0 pb-8 flex-grow justify-between`,
          Platform.OS === 'android' && { paddingBottom: insets.bottom + 32 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar Navigation */}
        <View style={tw`flex-row justify-between items-center pt-2 pb-2 min-h-12`}>
          <View style={tw`flex-row items-center gap-x-3`}>
            <BackButton onPress={onBack} />
            <StepIndicator steps={['목표', '기간', '질문']} currentStepIndex={1} />
          </View>
          <LaterButton onPress={onLater} />
        </View>

        {/* Header */}
        <View style={tw`justify-start mt-8 mb-10`}>
          <Text style={tw`text-2xl font-bold text-gray-900 leading-tight mb-2`}>
            두디가 이 호흡을 골라줬어
          </Text>
          <Text style={tw`text-gray-500 text-sm leading-relaxed`}>
            지금 목표와 상태를 보고 정했어.{'\n'}언제든 바꿀 수 있어.
          </Text>
        </View>

        {/* Period Display Card — 선택 UI 없음, 표시만 */}
        <View style={tw`bg-white rounded-2xl py-4 px-4 shadow-sm border border-gray-100 w-[90%] self-center items-center`}>
          {/* Period Badge */}
          <View style={tw`bg-[${COLORS.primary}] px-6 py-1.5 rounded-xl mb-2.5`}>
            <Text style={tw`text-white text-xl font-black tracking-wide`}>
              {period.label}
            </Text>
          </View>

          {/* Description */}
          <Text style={tw`text-gray-700 text-sm font-bold text-center leading-relaxed`}>
            {period.description}
          </Text>
        </View>

        {/* Center Egg Illustration */}
        <View style={tw`h-64 items-center justify-center my-4`}>
          <View style={tw`w-64 h-64 items-center justify-center`}>
            <Image source={EggSvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>

        {/* Bottom Button */}
        <View style={tw`w-full`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNext}
            style={tw`bg-[${COLORS.primary}] py-4 rounded-3xl w-full items-center shadow-lg`}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              두디와 시작하기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}