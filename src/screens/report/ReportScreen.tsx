import { Image } from 'expo-image';
// src/screens/report/ReportScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import tw from 'twrnc';
import { COLORS } from '../../constants/theme';

// Dummy SVG for Doody preview
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import SimpleBackButton from '../../components/common/SimpleBackButton';

interface ReportScreenProps {
  onBack: () => void;
  onGoCollection: () => void;
  onDoodyClick: (id: string) => void;
}

export default function ReportScreen({ onBack, onGoCollection, onDoodyClick }: ReportScreenProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('month');
  const [categoryTab, setCategoryTab] = useState<'rhythm' | 'independence' | 'connection'>('independence');
  const [timelineLimit, setTimelineLimit] = useState(3);

  // Dummy timeline data
  const timelineData = [
    { category: 'rhythm', day: '월', time: '09:42', title: '아침 일찍 일어나기 1', points: '+50P' },
    { category: 'rhythm', day: '월', time: '10:00', title: '물 한잔 마시기', points: '+10P' },
    { category: 'rhythm', day: '화', time: '08:30', title: '아침 일찍 일어나기 2', points: '+50P' },
    { category: 'rhythm', day: '화', time: '13:00', title: '점심 후 산책', points: '+20P' },
    { category: 'rhythm', day: '수', time: '09:00', title: '아침 일찍 일어나기 3', points: '+50P' },
    { category: 'rhythm', day: '목', time: '09:15', title: '아침 일찍 일어나기 4', points: '+50P' },
    { category: 'rhythm', day: '금', time: '08:45', title: '아침 일찍 일어나기 5', points: '+50P' },
    { category: 'rhythm', day: '토', time: '10:00', title: '주말 아침 스트레칭', points: '+30P' },
    { category: 'rhythm', day: '일', time: '11:00', title: '주말 아침 스트레칭', points: '+30P' },
    { category: 'rhythm', day: '일', time: '22:00', title: '일찍 잠자리에 들기', points: '+50P' },
    { category: 'rhythm', day: '일', time: '23:00', title: '수면 안대 착용', points: '+10P' },
    { category: 'independence', day: '월', time: '14:30', title: '0원 소비 기록 남기기', points: '+50P' },
    { category: 'independence', day: '수', time: '19:45', title: '통장 잔액 한 번 보고 닫기', points: '+50P' },
    { category: 'independence', day: '금', time: '22:00', title: '기분 좋았던 지출 하나 적기', points: '+50P' },
    { category: 'independence', day: '토', time: '14:30', title: '자립 관련 기사 1편 읽기', points: '+50P' },
    { category: 'independence', day: '일', time: '11:00', title: '이번 주 지출 내역 점검하기', points: '+50P' },
    { category: 'connection', day: '수', time: '12:00', title: '친구에게 안부 문자', points: '+50P' },
    { category: 'connection', day: '금', time: '18:00', title: '가족과 저녁 식사', points: '+50P' },
  ];

  const filteredData = timelineData.filter(item => item.category === categoryTab);

  const handleTabChange = (tabId: 'rhythm' | 'independence' | 'connection') => {
    setCategoryTab(tabId);
    setTimelineLimit(3);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F5F5F5]`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 pt-4 pb-4 bg-[#F5F5F5] z-10`}>
        <SimpleBackButton onPress={onBack} style={tw`mr-4`} />
        <Text style={tw`flex-1 text-center text-gray-900 text-xl font-bold pr-12`}>
          리포트
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`flex-grow px-6 pb-24`} showsVerticalScrollIndicator={false}>
        {/* Toggle (이번 주 / 이번 달) */}
        <View style={tw`flex-row bg-white rounded-full p-1 mb-6 self-start shadow-sm border border-gray-100`}>
          <TouchableOpacity
            onPress={() => setTimeRange('week')}
            style={tw`px-6 py-2 rounded-full ${timeRange === 'week' ? `bg-[${COLORS.primary}]` : 'bg-transparent'}`}
          >
            <Text style={tw`font-bold ${timeRange === 'week' ? 'text-white' : 'text-gray-500'}`}>이번 주</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeRange('month')}
            style={tw`px-6 py-2 rounded-full ${timeRange === 'month' ? `bg-[${COLORS.primary}]` : 'bg-transparent'}`}
          >
            <Text style={tw`font-bold ${timeRange === 'month' ? 'text-white' : 'text-gray-500'}`}>이번 달</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Summary Card (Only shows when 'month' is selected) */}
        {timeRange === 'month' && (
          <View style={tw`bg-white border border-[${COLORS.primary}] rounded-3xl p-5 mb-4 shadow-sm`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-base mr-1`}>💡</Text>
              <Text style={tw`text-gray-700 text-xs font-bold`}>사용자 활동 요약</Text>
            </View>
            <View style={tw`bg-[#EEF7F5] rounded-xl p-4`}>
              <Text style={tw`text-gray-700 text-xs leading-relaxed font-semibold`}>
                사용자님은 주로 오전 9시쯤 지출을 통제하는 습관(0원 소비 기록)이 강하시네요! 반면 금요일 저녁 지출 기록이 아직 비어있어요. 오늘 밤에는 나를 위한 기분 좋은 지출을 기록하고 50P를 챙겨보세요!
              </Text>
            </View>
          </View>
        )}

        {/* General Summary Card */}
        <View style={tw`bg-white border border-[${COLORS.primary}] rounded-3xl p-5 mb-6 shadow-sm`}>
          <Text style={tw`text-gray-500 text-xs font-bold mb-1`}>
            {timeRange === 'week' ? '이번 주의 작은 기록' : '이번 달의 작은 기록'}
          </Text>
          <View style={tw`flex-row justify-between items-end mb-4`}>
            <View style={tw`flex-row items-baseline`}>
              <Text style={tw`text-[${COLORS.primary}] text-4xl font-black mr-1`}>
                {timeRange === 'week' ? '5' : '28'}
              </Text>
              <Text style={tw`text-gray-900 text-base font-bold`}>개 기록</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-gray-400 text-[10px] font-bold`}>기록한 날</Text>
              <Text style={tw`text-gray-900 text-base font-bold`}>
                {timeRange === 'week' ? '3일' : '18일'}
              </Text>
            </View>
          </View>
          
          {/* Points Row */}
          <View style={tw`bg-[#EEF7F5] rounded-xl p-3 flex-row justify-between items-center`}>
            <Text style={tw`text-[${COLORS.primary}] text-xs font-bold`}>모의 적립 포인트</Text>
            <Text style={tw`text-[${COLORS.primary}] text-base font-black`}>
              {timeRange === 'week' ? '+250 P' : '+1,400 P'}
            </Text>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-gray-500 text-xs font-bold mb-3`}>리듬·자립·연결 기록</Text>
          
          {/* Category Tabs */}
          <View style={tw`flex-row bg-white rounded-full p-1 mb-4 shadow-sm border border-gray-100`}>
            {([
              { id: 'rhythm', label: '리듬' },
              { id: 'independence', label: '자립' },
              { id: 'connection', label: '연결' },
            ] as const).map((tab) => {
              const isActive = categoryTab === tab.id;
              const count = timelineData.filter(item => item.category === tab.id).length;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => handleTabChange(tab.id)}
                  style={tw`flex-1 items-center justify-center py-2 rounded-full ${isActive ? `bg-[${COLORS.primary}]` : 'bg-transparent'}`}
                >
                  <Text style={tw`font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{tab.label}</Text>
                  <Text style={tw`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Timeline List */}
          <View style={tw`ml-2`}>
            {filteredData.slice(0, timelineLimit).map((item, index) => {
              const isLast = index === timelineLimit - 1 || index === filteredData.length - 1;
              return (
                <View key={index} style={tw`flex-row mb-4`}>
                  {/* Timeline Line & Dot */}
                  <View style={tw`items-center mr-4 w-4 relative`}>
                    <View style={tw`w-4 h-4 rounded-full bg-[${COLORS.primary}] z-10 mt-1`} />
                    {!isLast && (
                      <View style={[tw`absolute top-3 bottom-[-32px] w-0.5 bg-[#C2E0D9]`, { left: 7 }]} />
                    )}
                  </View>
                  
                  {/* Content Card */}
                  <View style={tw`flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex-row justify-between items-center`}>
                    <View>
                      <Text style={tw`text-gray-400 text-[10px] font-bold mb-1`}>{item.day} {item.time}</Text>
                      <Text style={tw`text-gray-900 text-sm font-bold`}>{item.title}</Text>
                    </View>
                    <View style={tw`bg-[#EEF7F5] px-2 py-1 rounded-full`}>
                      <Text style={tw`text-[${COLORS.primary}] text-[10px] font-bold`}>{item.points}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            
            {filteredData.length === 0 && (
              <Text style={tw`text-gray-400 text-center py-4`}>기록이 없습니다.</Text>
            )}
          </View>
          
          {timelineLimit < filteredData.length && (
            <TouchableOpacity 
              style={tw`items-center py-2`}
              onPress={() => setTimelineLimit(prev => prev + 5)}
            >
              <Text style={tw`text-[${COLORS.primary}] text-sm font-bold`}>더 보기</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Doody Collection Preview Section */}
        <View style={tw`mb-4`}>
          <TouchableOpacity onPress={onGoCollection} style={tw`flex-row items-center mb-3`}>
            <Text style={tw`text-gray-500 text-xs font-bold mr-1`}>두디 도감</Text>
            <Text style={tw`text-gray-500 text-xs font-bold`}>&gt;</Text>
          </TouchableOpacity>

          {/* Doody Preview Grid (3 cols x 2 rows = 6 items) */}
          <View style={tw`bg-white rounded-3xl p-4 border border-[rgba(0,140,117,0.15)] flex-row flex-wrap justify-between`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => onDoodyClick(`preview_${i}`)}
                style={tw`w-[30%] aspect-square bg-white border border-[rgba(0,140,117,0.15)] rounded-2xl mb-3 items-center justify-center p-2`}
              >
                <Image source={HappyDoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
