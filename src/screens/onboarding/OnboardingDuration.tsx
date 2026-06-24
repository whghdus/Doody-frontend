import { Image } from 'expo-image';
// src/screens/OnboardingDuration.tsx — Screen 3: 기간 선택
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import BackButton from '../../components/common/BackButton';
import LaterButton from '../../components/common/LaterButton';
import StepIndicator from '../../components/common/StepIndicator';
import HeaderSection from '../../components/common/HeaderSection';
import EggSvg from '../../assets/doody/egg.webp';
import { COLORS } from '../../constants/theme';

interface OnboardingDurationProps {
  onNext: (duration: string) => void;
  onBack: () => void;
  onLater: () => void;
}

export default function OnboardingDuration({ onNext, onBack, onLater }: OnboardingDurationProps) {
  const insets = useSafeAreaInsets();
  const [selectedDuration, setSelectedDuration] = useState<string>('1w');

  const durations = [
    { id: '1d', label: '오늘만' },
    { id: '1w', label: '1주' },
    { id: '1m', label: '1개월' },
    { id: '3m', label: '3개월' },
  ];

  const getHelperText = () => {
    switch (selectedDuration) {
      case '1d':
        return '하루 집중 플랜을 추천해요! 바로 가볍게 성공해봐요.';
      case '1w':
        return '1주 플랜을 추천해요! 작은 단계로 나눠볼게요.';
      case '1m':
        return '1개월 플랜을 추천해요! 서서히 습관을 만들어가요.';
      case '3m':
        return '3개월 장기 플랜을 추천해요! 단단하게 삶을 가꿔봐요.';
      default:
        return '당신만의 든든한 일정을 추천해드릴게요.';
    }
  };

  const handleNext = () => {
    onNext(selectedDuration);
  };

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
          {/* Left Group: Back Arrow and Step Indicators */}
          <View style={tw`flex-row items-center gap-x-3`}>
            {/* Back Arrow */}
            <BackButton onPress={onBack} />

            {/* Step Indicators */}
            <StepIndicator steps={['목표', '기간', '질문']} currentStepIndex={1} />
          </View>

          {/* Later Button */}
          <LaterButton onPress={onLater} />
        </View>

        {/* Header Content */}
        <View style={tw`h-24 justify-start`}>
          <HeaderSection
            label=""
            title="두디가 이 호흡을 추천했어요"
            subtitle={`지금 목표와 상태를 보고 정했어요.\n언제든 바꿀 수 있어요.`}
          />
        </View>

        {/* Selection card with Pill Tabs */}
        <View style={tw`bg-white rounded-3xl p-5 shadow-md border border-gray-100 w-full mt-4`}>
          <View style={tw`flex-row bg-gray-50 p-1 rounded-2xl justify-between`}>
            {durations.map((d) => {
              const isActive = selectedDuration === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDuration(d.id)}
                  style={tw`flex-grow py-3 px-2 rounded-xl items-center justify-center ${isActive ? `bg-[${COLORS.primary}]` : 'bg-transparent'
                    }`}
                >
                  <Text style={tw`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={tw`text-gray-900 text-sm font-bold text-center mt-5 leading-relaxed`}>
            {getHelperText()}
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
            onPress={handleNext}
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
