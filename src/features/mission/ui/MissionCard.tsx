// src/components/MissionCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from '@/shared/lib/tailwind';
import { COLORS } from '@/shared/config/theme';
import { formatLongTitle } from '@/shared/lib/textUtils';

interface MissionCardProps {
  currentMission: string;
  isCompleted?: boolean;
  completable?: boolean;
  onRest: () => void;
  onStartMission: () => void;
}

export default function MissionCard({
  currentMission,
  isCompleted = false,
  completable = true,
  onRest,
  onStartMission,
}: MissionCardProps) {
  const now = new Date();
  const currentMonthDay = `${now.getMonth() + 1}월 ${now.getDate()}일`;

  return (
    <View style={tw`bg-white rounded-3xl p-6 shadow-md border border-gray-100 w-full mb-4`}>
      {/* Header Row */}
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-[${COLORS.primary}] text-sm font-bold`}>오늘의 미션</Text>
        <Text style={tw`text-gray-400 text-xs font-medium`}>{currentMonthDay}</Text>
      </View>

      {/* Mission Title */}
      <Text style={tw`text-gray-900 text-xl font-bold mt-3`}>
        {formatLongTitle(currentMission)}
      </Text>

      {/* Subtitle */}
      <Text style={tw`text-gray-400 text-center text-xs mt-3 font-medium`}>
        {isCompleted
          ? '오늘의 일일 미션을 모두 완료했어요! 🎉'
          : !completable
          ? '지도에서 두디를 잡으러 가보자'
          : '완료하면 회복 리포트에 기록돼'}
      </Text>

      {/* Action Buttons */}
      {!isCompleted && (
        <View style={tw`flex-row gap-x-3 mt-4`}>
          {completable && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onRest}
              style={tw`bg-gray-100 py-3.5 rounded-full flex-1 items-center justify-center`}
            >
              <Text style={tw`text-gray-700 font-bold text-sm`}>쉬러 가기</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onStartMission}
            style={tw`bg-[${COLORS.primary}] py-3.5 rounded-full flex-1 items-center justify-center shadow-md`}
          >
            <Text style={tw`text-white font-bold text-sm`}>{completable ? '하러 가기' : '🗺️ 두디 잡으러 가기'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
