// src/screens/OnboardingSummary.tsx — Screen 6: 두디 플랜
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
import { useOnboardingStore } from '@/entities/useOnboardingStore';
import { COLORS } from '@/shared/config/theme';

interface OnboardingSummaryProps {
  onNext: () => void;
}

export default function OnboardingSummary({ onNext }: OnboardingSummaryProps) {
  const insets = useSafeAreaInsets();
  const goalId = useOnboardingStore((state) => state.selectedGoal);
  const scores = useOnboardingStore((state) => state.onboardingScores);
  const userNickname = useOnboardingStore((state) => state.userNickname) || '사용자';
  
  // Render goal text with split colors
  const renderGoalText = () => {
    switch (goalId) {
      case 'g1':
        return (
          <Text style={tw`text-gray-900 text-lg font-bold leading-snug`}>
            작은 루틴부터 시작해{"\n"}
            <Text style={tw`text-[${COLORS.primary}]`}>일상을 탄탄히 채우기</Text>
          </Text>
        );
      case 'g2':
        return (
          <Text style={tw`text-gray-900 text-lg font-bold leading-snug`}>
            돈과 소비를 피하지 않고{"\n"}
            <Text style={tw`text-[${COLORS.primary}]`}>편안하게 마주하기</Text>
          </Text>
        );
      case 'g3':
        return (
          <Text style={tw`text-gray-900 text-lg font-bold leading-snug`}>
            취업·상담 지원을{"\n"}
            <Text style={tw`text-[${COLORS.primary}]`}>용기 내어 알아보기</Text>
          </Text>
        );
      default:
        return (
          <Text style={tw`text-gray-900 text-lg font-bold leading-snug`}>
            일상을 가볍게 시작하고{"\n"}
            <Text style={tw`text-[${COLORS.primary}]`}>안정 되찾기</Text>
          </Text>
        );
    }
  };

  // Mapped first step text
  const getFirstStepText = () => {
    switch (goalId) {
      case 'g1':
        return '아침 알람 소리를 듣고\n침대에 3분 동안 기지개 켜기';
      case 'g2':
        return '통장 잔액 딱 한 번만\n슬쩍 보고 닫기';
      case 'g3':
        return '가까운 청년센터 사이트\n즐겨찾기(북마크) 해두기';
      default:
        return '오늘 하루 딱 5분만\n햇볕 아래 걷고 오기';
    }
  };

  // Determine top 2 focus areas based on highest scores (burden)
  const focusAreas = React.useMemo(() => {
    const areas = [
      { id: 'rhythm', title: '리듬', desc: '하루 시작을 가볍게 되찾기', score: scores.rhythm },
      { id: 'independence', title: '자립', desc: '돈과 소비를 천천히 마주하기', score: scores.independence },
      { id: 'connection', title: '연결', desc: '주변 관계를 가볍게 되찾기', score: scores.connection },
    ];

    // Sort descending by score, select top 2
    const sorted = [...areas].sort((a, b) => b.score - a.score);
    return [sorted[0], sorted[1]];
  }, [scores]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={[
          tw`px-6 pt-0 pb-8 flex-grow justify-between`,
          Platform.OS === 'android' && { paddingBottom: insets.bottom + 32 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Label */}
        <View style={tw`flex-row items-center pt-2 pb-2 min-h-12`}>
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold ml-1`}>
            첫 여정
          </Text>
        </View>

        {/* Header Content */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-2xl font-bold text-gray-900 leading-tight mb-3`}>
            오늘부터 시작될{'\n'}{userNickname}님의 첫 두디 플랜
          </Text>
          <Text style={tw`text-gray-500 text-sm leading-relaxed`}>
            지금 목표와 답변을 바탕으로,{'\n'}
            두디가 먼저 시작할 방향과 첫 미션을 골랐어.
          </Text>
        </View>

        {/* Summary Card Details */}
        <View style={tw`bg-white rounded-3xl p-6 shadow-md border border-gray-100 w-full mb-6 gap-y-4`}>
          {/* My Goal */}
          <View>
            <Text style={tw`text-[#8C9C98] text-xs font-bold mb-1.5`}>
              나의 목표
            </Text>
            {renderGoalText()}
          </View>

          <View style={tw`h-px bg-gray-100 w-full`} />

          {/* Focus Areas to Grow */}
          <View>
            <Text style={tw`text-[#8C9C98] text-xs font-bold mb-3`}>
              두디와 함께 키워갈 것
            </Text>
            
            <View style={tw`gap-y-3`}>
              {focusAreas.map((area) => (
                <View 
                  key={area.id}
                  style={tw`bg-[#EEF7F5] rounded-2xl p-4 flex-row items-center`}
                >
                  {/* Outer circle with light mint bg, Inner solid green dot */}
                  <View style={tw`w-9 h-9 rounded-full bg-[#D1ECE6] items-center justify-center mr-3.5`}>
                    <View style={tw`w-4 h-4 rounded-full bg-[${COLORS.primary}]`} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[#0B6A56] text-base font-bold`}>
                      {area.title}
                    </Text>
                    <Text style={tw`text-[#7B8E8A] text-[13px] font-semibold mt-0.5`}>
                      {area.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={tw`h-px bg-gray-100 w-full`} />

          {/* Today's First Step */}
          <View>
            <Text style={tw`text-[${COLORS.primary}] text-xs font-bold mb-2`}>
              오늘의 첫걸음
            </Text>
            <Text style={tw`text-gray-900 text-lg font-bold leading-snug`}>
              {getFirstStepText()}
            </Text>
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
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
