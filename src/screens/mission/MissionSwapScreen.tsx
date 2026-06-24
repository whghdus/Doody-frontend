// src/screens/MissionSwapScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';

interface MissionSwapScreenProps {
  selectedSmallerIdx: number;
  setSelectedSmallerIdx: (idx: number) => void;
  onBack: () => void;
  onRest: () => void;
  onStartSmaller: () => void;
}

export default function MissionSwapScreen({
  selectedSmallerIdx,
  setSelectedSmallerIdx,
  onBack,
  onRest,
  onStartSmaller,
}: MissionSwapScreenProps) {
  const smallerMissions = [
    {
      emoji: '👀',
      title: '잔액 한 번만 보고 닫기',
      subtitle: '앱을 열고 숫자만 확인해요',
      badge: '쉬움',
      badgeBg: 'bg-[#E6F4F1]',
      badgeText: 'text-[#008C75]',
    },
    {
      emoji: '📝',
      title: '오늘 돈 쓴 게 있었는지 떠올리기',
      subtitle: '있었다면 하나만 기록해요',
      badge: '보통',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600',
    },
    {
      emoji: '🗓️',
      title: '한 달 고정 지출 파악하기',
      subtitle: '월세·통신비·구독료 목록 작성',
      badge: '도전',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-600',
    },
  ];

  return (
    <View style={tw`flex-1 bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm mt-4 mb-4`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`flex-grow justify-between`}>
        <View>
          {/* Header (Left-aligned next to back arrow) */}
          <View style={tw`flex-row items-center mb-6`}>
            <TouchableOpacity 
              onPress={onBack}
              style={tw`w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3`}
            >
              <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                <Path d="M7 13L1 7L7 1" stroke="#1F2A26" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={tw`text-gray-900 text-lg font-bold flex-1`}>조금 더 작은 걸음으로 바꿔볼게요</Text>
          </View>

          {/* Top Green Box */}
          <View style={tw`bg-[#E6F4F1] rounded-[20px] p-4 mb-6`}>
            <Text style={tw`text-[#008C75] text-sm font-bold text-center leading-relaxed`}>
              괜찮아요. 지금 가능한 만큼만 해도 충분해요.
            </Text>
          </View>

          {/* Section Title */}
          <Text style={tw`text-gray-700 text-sm font-bold text-center mb-5`}>
            💳 자립 미션을 작게 나눴어요
          </Text>

          {/* Three Swapping Options */}
          <View style={tw`gap-y-3 mb-6`}>
            {smallerMissions.map((item, idx) => {
              const isSelected = selectedSmallerIdx === idx;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <Text style={tw`text-gray-300 text-center text-xs font-bold my-1`}>↓</Text>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedSmallerIdx(idx)}
                    style={tw`border rounded-2xl p-4 flex-row items-center justify-between shadow-sm ${
                      isSelected 
                        ? 'border-[#008C75] bg-[#E6F4F1]/10' 
                        : 'border-gray-100 bg-white/60 opacity-70'
                    }`}
                  >
                    <View style={tw`flex-row items-center flex-1 mr-3`}>
                      <Text style={tw`text-2xl mr-4`}>{item.emoji}</Text>
                      <View style={tw`flex-1`}>
                        <Text style={tw`text-gray-900 text-sm font-bold ${isSelected ? 'text-[#008C75]' : ''}`}>
                          {item.title}
                        </Text>
                        <Text style={tw`text-gray-400 text-xs mt-1 font-semibold`}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>
                    <View style={tw`${item.badgeBg} px-2.5 py-0.5 rounded-full`}>
                      <Text style={tw`${item.badgeText} text-[10px] font-bold`}>
                        {item.badge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Buttons */}
        <View style={tw`flex-row gap-x-3 mt-4`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onRest}
            style={tw`bg-gray-50 border border-gray-100 py-4 rounded-3xl flex-1 items-center justify-center`}
          >
            <Text style={tw`text-gray-600 font-bold text-sm`}>오늘은 쉬어가기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onStartSmaller}
            style={tw`bg-[#008C75] py-4 rounded-3xl flex-1 items-center justify-center shadow-md`}
          >
            <Text style={tw`text-white font-bold text-sm`}>쉬운 미션으로 시작!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
