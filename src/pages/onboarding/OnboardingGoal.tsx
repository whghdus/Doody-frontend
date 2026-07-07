// src/screens/OnboardingGoal.tsx — Screen 2: 목표 선택
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
import tw from '@/shared/lib/tailwind';
import LaterButton from '@/shared/ui/LaterButton';
import StepIndicator from '@/shared/ui/StepIndicator';
import HeaderSection from '@/shared/ui/HeaderSection';
import SelectionCard from '@/shared/ui/SelectionCard';
import { COLORS } from '@/shared/config/theme';

interface OnboardingGoalProps {
  onNext: (goalId: string) => void;
  onLater: () => void;
}

export default function OnboardingGoal({ onNext, onLater }: OnboardingGoalProps) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string>('g1');

  const goals = [
    {
      id: 'g1',
      num: '01',
      title: '나만의 속도로 차근차근 홀로서고 싶어요',
      subtitle: '스스로 소비와 예산을 관리하며 단단한 내일 준비하기',
    },
    {
      id: 'g2',
      num: '02',
      title: '홀로서기와 함께 기대는 법도 배우고 싶어요',
      subtitle: '스스로 할 수 있는 건 해보고, 필요한 도움은 받아보기',
    },
    {
      id: 'g3',
      num: '03',
      title: '나에게 필요한 도움과 지원을 알아보고 싶어요',
      subtitle: '상담, 취업, 청년 지원 등 나와 세상을 이어줄 연결고리 찾기',
    },
  ];

  const handleNext = () => {
    onNext(selectedId);
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
          {/* Left Group: Step Indicators */}
          <View style={tw`flex-row items-center`}>
            <StepIndicator steps={['목표', '기간', '질문']} currentStepIndex={0} />
          </View>

          {/* Later Button */}
          <LaterButton onPress={onLater} />
        </View>

        {/* Header Content */}
        <View>
          <HeaderSection
            label=""
            title="두디와 어디까지 가보고 싶나요?"
            subtitle={`고른 목표에 맞춰, 오늘의 작은 미션을 준비할게.\n나중에 언제든 바꿀 수 있어.`}
          />
        </View>

        {/* Quest Goals List */}
        <View style={tw`flex-1 gap-y-3.5 my-6`}>
          {goals.map((goal) => (
            <SelectionCard
              key={goal.id}
              id={goal.num}
              title={goal.title}
              subtitle={goal.subtitle}
              isSelected={selectedId === goal.id}
              onPress={() => setSelectedId(goal.id)}
              showCheckmark={true}
            />
          ))}
        </View>

        {/* Bottom Button */}
        <View style={tw`w-full`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            style={tw`bg-[${COLORS.primary}] py-4 rounded-3xl w-full items-center shadow-lg`}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
