import { Image } from 'expo-image';
// src/screens/report/ReportScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import tw from '@/shared/lib/tailwind';
import { COLORS } from '@/shared/config/theme';

import DoodySvg from '@/shared/assets/doody/Doody.webp';
import BrushDoodySvg from '@/shared/assets/doody/brushDoody.webp';
import HappyDoodySvg from '@/shared/assets/doody/happyDoody.webp';
import SadDoodySvg from '@/shared/assets/doody/sadDoody.webp';
import SmileDoodySvg from '@/shared/assets/doody/smileDoody.webp';
import ExplorationDoodySvg from '@/shared/assets/doody/explorationDoody.webp';
import SalaryDoodySvg from '@/shared/assets/doody/salaryDoodt.webp';
import GreenDoodySvg from '@/shared/assets/doody/greenDoody.webp';
import SimpleBackButton from '@/shared/ui/SimpleBackButton';
import { useCollectionStore } from '@/entities/useCollectionStore';
import { reportApi, RecoveryReportResponse } from '@/shared/api/report';

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg, ExplorationDoodySvg, SalaryDoodySvg, GreenDoodySvg];

interface ReportScreenProps {
  onBack: () => void;
  onDoodyClick: (id: string) => void;
}

export default function ReportScreen({ onBack, onDoodyClick }: ReportScreenProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('month');
  const [categoryTab, setCategoryTab] = useState<'rhythm' | 'independence' | 'connection'>('independence');
  const [timelineLimit, setTimelineLimit] = useState(3);
  const { unlockedDoodies } = useCollectionStore();

  // Build 6 preview slots: show unlocked doodies first, then locked placeholders
  const previewSlots = Array.from({ length: 6 }).map((_, i) => {
    const isUnlocked = unlockedDoodies.includes(i);
    const hasImage = i < DOODY_SVGS.length;
    return { index: i, isUnlocked, SvgComponent: hasImage ? DOODY_SVGS[i] : null };
  });

  const [reportData, setReportData] = useState<RecoveryReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await reportApi.getRecoveryReport(timeRange);
        setReportData(data);
      } catch (err) {
        console.error('Failed to fetch recovery report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [timeRange]);

  // Map API axis to categoryTab names
  const axisMap: Record<string, string> = {
    'RHYTHM': 'rhythm',
    'AUTONOMY': 'independence',
    'CONNECTION': 'connection'
  };

  const translateTitle = (title: string, category: string) => {
    if (category !== 'rhythm' || !title) return title || '기록';
    const upper = title.toUpperCase();
    if (upper === 'TERRIBLE') return '아침 기상: 아주 별로';
    if (upper === 'BAD') return '아침 기상: 별로';
    if (upper === 'OKAY') return '아침 기상: 그럭저럭';
    if (upper === 'GOOD') return '아침 기상: 좋음';
    if (upper === 'EXCELLENT') return '아침 기상: 아주 좋음';
    if (upper.includes('MORNING')) return '아침 회고';
    if (upper.includes('NIGHT') || upper.includes('EVENING')) return '저녁 회고';
    return title;
  };

  const timelineData = reportData?.recordGroups.flatMap(group => {
    return group.records.map((record: any) => {
      // Handle nested reward objects or various point field names
      let rewardAmt = 0;
      if (typeof record.reward === 'number') {
        rewardAmt = record.reward;
      } else if (record.reward && typeof record.reward.hanaMoney === 'number') {
        rewardAmt = record.reward.hanaMoney;
      } else {
        rewardAmt = record.point ?? record.points ?? record.pointsEarned ?? record.amount ?? record.hanaMoney ?? record.rewardAmount ?? record.acquiredPoint ?? 0;
      }

      const categoryStr = axisMap[group.axis] || 'rhythm';

      return {
        category: categoryStr,
        day: record.recordedAt ? new Date(record.recordedAt).toLocaleDateString('ko-KR', { weekday: 'short' }) : '오늘',
        time: record.recordedAt ? new Date(record.recordedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '00:00',
        title: translateTitle(record.title, categoryStr),
        points: `+${rewardAmt}`
      };
    })
  }) || [];

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
          <View style={tw`bg-white rounded-3xl p-5 mb-4 shadow-md`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-base mr-1`}>💡</Text>
              <Text style={tw`text-gray-700 text-xs font-bold`}>사용자 활동 요약</Text>
            </View>
            <View style={tw`bg-[#EEF7F5] rounded-xl p-4`}>
              <Text style={tw`text-gray-700 text-xs leading-relaxed font-semibold`}>
                {reportData?.activitySummary?.summary || '이번 달은 더 많은 활동을 기록해 봐!'}
              </Text>
            </View>
          </View>
        )}

        {/* General Summary Card */}
        <View style={tw`bg-white rounded-3xl p-5 mb-6 shadow-md`}>
          <Text style={tw`text-gray-500 text-xs font-bold mb-1`}>
            {timeRange === 'week' ? '이번 주의 작은 기록' : '이번 달의 작은 기록'}
          </Text>
          <View style={tw`flex-row justify-between items-end mb-4`}>
            <View style={tw`flex-row items-baseline`}>
              <Text style={tw`text-[${COLORS.primary}] text-4xl font-black mr-1`}>
                {reportData?.summary?.totalRecordCount || 0}
              </Text>
              <Text style={tw`text-gray-900 text-base font-bold`}>개 기록</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-gray-400 text-[10px] font-bold`}>기록한 날</Text>
              <Text style={tw`text-gray-900 text-base font-bold`}>
                {reportData?.summary?.recordedDayCount || 0}일
              </Text>
            </View>
          </View>

          {/* Points Row */}
          <View style={tw`bg-[#EEF7F5] rounded-xl p-3 flex-row justify-between items-center`}>
            <Text style={tw`text-[${COLORS.primary}] text-xs font-bold`}>하나머니 적립</Text>
            <Text style={tw`text-[${COLORS.primary}] text-base font-black`}>
              +{reportData?.summary?.totalPoint?.toLocaleString() || 0}
            </Text>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-gray-500 text-xs font-bold mb-3`}>리듬·자립·연결 기록</Text>

          {/* Category Tabs */}
          <View style={tw`flex-row bg-white rounded-full p-1 mb-4 shadow-sm border border-gray-100`}>
            {([
              { id: 'rhythm', label: '리듬', apiAxis: 'RHYTHM' },
              { id: 'independence', label: '자립', apiAxis: 'AUTONOMY' },
              { id: 'connection', label: '연결', apiAxis: 'CONNECTION' },
            ] as const).map((tab) => {
              const isActive = categoryTab === tab.id;
              const countInfo = reportData?.axisSummaries?.find(s => s.axis === tab.apiAxis);
              const count = countInfo ? countInfo.recordCount : 0;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => handleTabChange(tab.id as 'rhythm' | 'independence' | 'connection')}
                  style={tw`flex-1 items-center justify-center py-2 rounded-full ${isActive ? `bg-[${COLORS.primary}]` : 'bg-transparent'}`}
                >
                  <Text style={tw`font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{tab.label}</Text>
                  <Text style={tw`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={tw`mt-10`} />
          ) : (
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
                    <View style={tw`flex-1 bg-white rounded-2xl p-4 shadow-md flex-row justify-between items-center`}>
                      <View style={tw`flex-1 pr-3`}>
                        <Text style={tw`text-gray-400 text-[10px] font-bold mb-1`}>{item.day} {item.time}</Text>
                        <Text style={tw`text-gray-900 text-sm font-bold`} numberOfLines={2}>{item.title}</Text>
                      </View>
                      <View style={tw`bg-[#EEF7F5] px-2 py-1 rounded-full shrink-0`}>
                        <Text style={tw`text-[${COLORS.primary}] text-[10px] font-bold`}>{item.points}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {filteredData.length === 0 && (
                <Text style={tw`text-gray-400 text-center py-4`}>기록이 없어.</Text>
              )}
            </View>
          )}

          {!loading && timelineLimit < filteredData.length && (
            <TouchableOpacity
              style={tw`items-center py-2`}
              onPress={() => setTimelineLimit(prev => prev + 5)}
            >
              <Text style={tw`text-[${COLORS.primary}] text-sm font-bold`}>더 보기</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
