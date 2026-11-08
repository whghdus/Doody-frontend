import React, { useState } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '@/shared/lib/tailwind';
import HeaderSection from '@/shared/ui/HeaderSection';
import SelectionCard from '@/shared/ui/SelectionCard';
import { COLORS } from '@/shared/config/theme';

interface OnboardingScreen1Props {
  onNext: (selectedId: string) => void;
}

export default function OnboardingScreen1({ onNext }: OnboardingScreen1Props) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const options = [
    {
      id: 'start',
      title: '하루를 시작하기 어려워',
      subtitle: '잠, 식사, 생활 리듬이 흐트러졌어요',
      emoji: '🌅', // Sunrise (하루의 시작)
    },
    {
      id: 'money',
      title: '돈·통장을 마주하기 어려워',
      subtitle: '잔액, 소비, 돈 생각을 피하게 돼',
      emoji: '💳', // Credit Card (금융/통장)
    },
    {
      id: 'contact',
      title: '사람이나 기관에 연락하기 어려워',
      subtitle: '친구, 가족, 상담, 청년센터가 부담돼',
      emoji: '💬', // Speech Bubble (연락/소통)
    },
    {
      id: 'multiple',
      title: '여러 가지가 같이 어려워',
      subtitle: '뭐가 먼저인지 모르겠어',
      emoji: '🌫️', // Fog (흐리고 복잡함)
    },
    {
      id: 'unknown',
      title: '아직 잘 모르겠어',
      subtitle: '천천히 알아가도 괜찮아',
      emoji: '💭', // Thought Cloud (생각/천천히)
    },
  ];

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={[
          tw`px-6 pt-0 pb-12`,
          Platform.OS === 'android' && { paddingBottom: insets.bottom + 48 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Dummy spacer to align the header with subsequent screens */}
        <View style={tw`pt-2 pb-2 min-h-12`} />

        {/* Header Section */}
        <View style={tw`pt-4 mb-8`}>
          <HeaderSection
            label="만나서 반가워"
            title="요즘 어디가 제일 막히는 것 같아요?"
            subtitle="괜찮아. 정확히 몰라도 두디가 같이 찾아볼게."
          />
        </View>

        {/* Options List */}
        <View style={tw`gap-y-3`}>
          {options.map((option) => (
            <SelectionCard
              key={option.id}
              id={option.id}
              title={option.title}
              subtitle={option.subtitle}
              emoji={option.emoji}
              isSelected={selectedId === option.id}
              onPress={() => handleSelect(option.id)}
              showCheckmark={true}
            />
          ))}
        </View>

        {/* Bottom Button */}
        <View style={tw`mt-8 mb-4 px-2`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => selectedId && onNext(selectedId)}
            disabled={!selectedId}
            style={tw`${
              selectedId ? `bg-[${COLORS.primary}]` : 'bg-gray-300'
            } py-4 rounded-3xl w-full items-center shadow-lg`}
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
