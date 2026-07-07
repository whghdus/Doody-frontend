// src/screens/OnboardingQuestions.tsx — Screen 4: 기분 질문 (3문항 한 페이지, 칩 선택)
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
import tw from '../../utils/tailwind';
import { COLORS } from '../../constants/theme';
import type { MoodAnswers } from '../../store/useOnboardingStore';

interface OnboardingQuestionsProps {
  onNext: (answers: MoodAnswers) => void;
  onBack: () => void;
}

interface QuestionConfig {
  key: keyof MoodAnswers;
  title: string;
  options: string[];
}

export default function OnboardingQuestions({ onNext, onBack }: OnboardingQuestionsProps) {
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<MoodAnswers>({
    daily: '',
    spending: '',
    contact: '',
  });

  const questions: QuestionConfig[] = [
    {
      key: 'daily',
      title: '요즘 하루동안 기분이 어때?',
      options: ['너무 지치고 힘들어', '기운이 없고 무기력해', '평소랑 비슷해', '꽤 괜찮고 편안해'],
    },
    {
      key: 'spending',
      title: '최근 돈이나 소비 내역을 마주하는 게 어땠어?',
      options: ['너무 막막하고 피하고 싶어', '마주하기 부담스럽고 걱정돼', '크게 신경 쓰이지 않아', '잘 관리하고 있고 편안해'],
    },
    {
      key: 'contact',
      title: '연락하거나 문의해야 할 일이 생기면 어떤 기분이 들어?',
      options: ['너무 긴장되고 피하고 싶어', '왠지 불편하고 망설여져', '별 생각 없이 할 수 있어', '마음 편하게 연락할 수 있어'],
    },
  ];

  const handleSelectOption = (questionKey: keyof MoodAnswers, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: option,
    }));
  };

  const allAnswered = answers.daily !== '' && answers.spending !== '' && answers.contact !== '';

  const handleNext = () => {
    if (allAnswered) {
      onNext(answers);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={[
          tw`px-6 pt-0 pb-8 flex-grow`,
          Platform.OS === 'android' && { paddingBottom: insets.bottom + 32 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer for top area (doody logo is on Background) */}
        <View style={tw`pt-2 pb-4 min-h-12`} />

        {/* Questions */}
        <View style={tw`gap-y-8`}>
          {questions.map((q) => (
            <View key={q.key}>
              {/* Question Title */}
              <Text style={tw`text-gray-900 text-lg font-bold leading-snug mb-1.5`}>
                {q.title}
              </Text>
              <Text style={tw`text-gray-400 text-xs font-semibold mb-3`}>
                정답은 없으니 솔직하게 대답해줘
              </Text>

              {/* Chip Options */}
              <View style={tw`flex-row flex-wrap gap-2`}>
                {q.options.map((option) => {
                  const isSelected = answers[q.key] === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.8}
                      onPress={() => handleSelectOption(q.key, option)}
                      style={tw`px-4 py-2.5 rounded-xl border ${
                        isSelected
                          ? `bg-[${COLORS.primary}] border-[${COLORS.primary}]`
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        style={tw`text-sm font-bold ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View style={tw`flex-1 min-h-8`} />

        {/* Bottom Button */}
        <View style={tw`w-full mt-6`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={!allAnswered}
            style={tw`${
              allAnswered ? `bg-[${COLORS.primary}]` : 'bg-gray-300'
            } py-4 rounded-3xl w-full items-center shadow-lg`}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              다음 →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
