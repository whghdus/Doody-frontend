// src/components/TimelineRecords.tsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '../../utils/tailwind';
import TimeLineButtonPng from '../../assets/buttons/timeLineButton.png';
import { COLORS, ACCESSIBILITY_LABEL } from '../../constants/theme';


export type CategoryType = 'rhythm' | 'independence' | 'connection';

export interface TimelineItem {
  dayTime: string;
  title: string;
  points: string;
}

interface TimelineRecordsProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  filteredCounts: Record<CategoryType, number>;
  activeItems: TimelineItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  onOpenItemModal: (item: TimelineItem) => void;
  titleText?: string;
  titleStyle?: string;
}

function TimelineRecords({
  activeCategory,
  onCategoryChange,
  filteredCounts,
  activeItems,
  hasMore,
  onLoadMore,
  onOpenItemModal,
  titleText = '리듬 · 자립 · 연결 기록',
  titleStyle = '',
}: TimelineRecordsProps) {
  return (
    <View style={tw`w-full`}>
      <Text style={tw`text-gray-500 text-xs font-bold mb-3 mt-1 ${titleStyle}`}>
        {titleText}
      </Text>

      {/* Category Toggle Tabs */}
      <View style={tw`flex-row bg-gray-100 rounded-full p-1 mb-5 justify-between items-center`}>
        <TouchableOpacity
          onPress={() => onCategoryChange('rhythm')}
          style={tw`py-2 rounded-full flex-1 items-center ${activeCategory === 'rhythm' ? `bg-[${COLORS.primary}]` : ''}`}
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel={`리듬 카테고리, 기록 ${filteredCounts.rhythm}개`}
          accessibilityState={{ selected: activeCategory === 'rhythm' }}
        >
          <Text style={tw`text-xs font-bold ${activeCategory === 'rhythm' ? 'text-white' : 'text-gray-500'}`}>
            리듬 {filteredCounts.rhythm}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onCategoryChange('independence')}
          style={tw`py-2 rounded-full flex-1 items-center ${activeCategory === 'independence' ? `bg-[${COLORS.primary}]` : ''}`}
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel={`자립 카테고리, 기록 ${filteredCounts.independence}개`}
          accessibilityState={{ selected: activeCategory === 'independence' }}
        >
          <Text style={tw`text-xs font-bold ${activeCategory === 'independence' ? 'text-white' : 'text-gray-500'}`}>
            자립 {filteredCounts.independence}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onCategoryChange('connection')}
          style={tw`py-2 rounded-full flex-1 items-center ${activeCategory === 'connection' ? `bg-[${COLORS.primary}]` : ''}`}
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel={`연결 카테고리, 기록 ${filteredCounts.connection}개`}
          accessibilityState={{ selected: activeCategory === 'connection' }}
        >
          <Text style={tw`text-xs font-bold ${activeCategory === 'connection' ? 'text-white' : 'text-gray-500'}`}>
            연결 {filteredCounts.connection}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timeline Cards */}
      <View style={tw`mb-2`}>
        {activeItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.8}
            onPress={() => onOpenItemModal(item)}
            style={tw`relative flex-row pb-4`}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${item.dayTime} 기록: ${item.title}, 적립 금 RWA 토큰은 ${item.points}`}
            accessibilityHint="상세 기록 모달을 엽니다."
          >
            {/* Left vertical timeline line and dot (Absolutely positioned to stretch across padding-bottom) */}
            <View style={tw`absolute top-0 bottom-0 left-0 w-8 items-center`}>
              {/* Continuous Line logic: starts at center of first dot, ends at center of last dot */}
              {activeItems.length > 1 && (
                idx === 0 ? (
                  <View style={[tw`absolute w-[2.5px] bg-[${COLORS.primaryLight}]`, { top: 24, bottom: -24 }]} />
                ) : idx === activeItems.length - 1 ? (
                  <View style={[tw`absolute w-[2.5px] bg-[${COLORS.primaryLight}]`, { top: -24, height: 48 }]} />
                ) : (
                  <View style={[tw`absolute w-[2.5px] bg-[${COLORS.primaryLight}]`, { top: -24, bottom: -24 }]} />
                )
              )}
              {/* Dot */}
              <Image source={TimeLineButtonPng} style={tw`w-8 h-8`} resizeMode="contain" />
            </View>

            {/* Right side Card Content (Pushed right to clear absolute left column) */}
            <View style={tw`flex-1 ml-9 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-gray-400 text-[11px] font-bold`}>{item.dayTime}</Text>
                <View style={tw`bg-[${COLORS.primaryLight}] px-2 py-0.5 rounded-lg shrink-0 ml-2`}>
                  <Text style={tw`text-[${COLORS.primary}] text-[10px] font-black`}>{item.points}</Text>
                </View>
              </View>
              <Text style={tw`text-gray-900 text-sm font-bold`} numberOfLines={3}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* View More Link (Visible only if there are more items to load) */}
      {hasMore && (
        <TouchableOpacity
          onPress={onLoadMore}
          style={tw`items-center py-2.5 mb-6`}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="타임라인 기록 더 보기"
          accessibilityHint="더 많은 기록을 불러와 아래에 덧붙이야."
        >
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold`}>더 보기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default memo(TimelineRecords);
