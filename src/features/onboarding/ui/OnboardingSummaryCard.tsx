// src/components/OnboardingSummaryCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from '@/shared/lib/tailwind';

export interface OnboardingScores {
  rhythm: number;
  independence: number;
  connection: number;
}

interface OnboardingSummaryCardProps {
  goalId: string;
  scores: OnboardingScores;
}

export default function OnboardingSummaryCard({ goalId, scores }: OnboardingSummaryCardProps) {
  // Mapped goal text
  const getGoalText = () => {
    switch (goalId) {
      case 'g1':
        return '작은 루틴부터 시작해 일상을 탄탄히 채우기';
      case 'g2':
        return '돈과 소비를 피하지 않고 편안하게 마주하기';
      case 'g3':
        return '취업·상담 지원을 용기 내어 알아보기';
      default:
        return '일상을 가볍게 시작하고 안정 되찾기';
    }
  };

  // Mapped first step text
  const getFirstStepText = () => {
    switch (goalId) {
      case 'g1':
        return '아침 알람 소리를 듣고 침대에 3분 동안 기지개 켜기';
      case 'g2':
        return '통장 잔액 딱 한 번만 슬쩍 보고 닫기';
      case 'g3':
        return '가까운 청년센터 사이트를 즐겨찾기(북마크) 해두기';
      default:
        return '오늘 하루 딱 5분만 햇볕 아래 걷고 오기';
    }
  };

  // Determine top 2 focus areas based on highest scores (burden)
  const getFocusAreas = () => {
    const areas = [
      { id: 'rhythm', title: '리듬', desc: '하루 시작을 가볍게 되찾기', score: scores.rhythm },
      { id: 'independence', title: '자립', desc: '돈과 소비를 천천히 마주하기', score: scores.independence },
      { id: 'connection', title: '연결', desc: '세상과의 관계를 다시 이어가기', score: scores.connection },
    ];

    // Sort descending by score, select top 2
    areas.sort((a, b) => b.score - a.score);
    return [areas[0], areas[1]];
  };

  const focusAreas = getFocusAreas();

  return (
    <View style={tw`bg-white rounded-3xl p-6 shadow-md border border-gray-100 w-full mb-6 gap-y-4`}>
      {/* My Goal */}
      <View>
        <Text style={tw`text-gray-400 text-xs font-semibold mb-1.5`}>
          나의 목표
        </Text>
        <Text style={tw`text-[#008C75] text-lg font-bold leading-snug`}>
          {getGoalText()}
        </Text>
      </View>

      <View style={tw`h-px bg-gray-100 w-full`} />

      {/* Focus Areas to Grow */}
      <View>
        <Text style={tw`text-gray-400 text-xs font-semibold mb-3`}>
          두디와 함께 키워갈 것
        </Text>

        <View style={tw`gap-y-3`}>
          {focusAreas.map((area) => (
            <View
              key={area.id}
              style={tw`bg-[#E6F4F1]/30 border border-[#E6F4F1]/50 rounded-2xl p-4 flex-row items-center`}
            >
              {/* Green Dot */}
              <View style={tw`w-4 h-4 rounded-full bg-[#008C75] mr-3`} />
              <View>
                <Text style={tw`text-gray-900 text-sm font-bold`}>
                  {area.title}
                </Text>
                <Text style={tw`text-gray-500 text-xs font-semibold mt-0.5`}>
                  {area.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
