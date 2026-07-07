import { Image } from 'expo-image';
// src/screens/report/DoodyDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
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
import { useCollectionStore, mapDoodyIdToIndex } from '@/entities/useCollectionStore';
import { collectionApi, BackendDoodyCollectionResponse, BackendDoodyCollectionDetailResponse } from '@/shared/api/collection';

const DOODY_SVGS = [
  DoodySvg, 
  BrushDoodySvg, 
  HappyDoodySvg, 
  SadDoodySvg, 
  SmileDoodySvg,
  ExplorationDoodySvg, // index 5
  SalaryDoodySvg, // index 6
  GreenDoodySvg   // index 7
];

const DOODY_CATALOG = [
  { name: '두디',       description: '기본 두디야. 어디서나 나타나 조용히 곁에 있어 줘요. 가장 먼저 만날 수 있어.' },
  { name: '양치 두디',   description: '창의력이 넘치는 두디야. 무언가를 만들고 기록하는 걸 좋아해.' },
  { name: '해피 두디', description: '항상 웃고 있는 두디야. 미션을 완료할수록 더 자주 나타나요.' },
  { name: '슬픈 두디', description: '오늘 좀 힘든 날에 나타나요. 옆에서 같이 있어줄게요.' },
  { name: '스마일 두디', description: '따뜻한 미소를 가진 두디야. 꾸준히 해낸 날 당신 곁으로 달려와.' },
  { name: '탐험 두디',   description: '낯선 곳을 탐험하는 걸 좋아하는 용감한 두디야. 주변을 둘러보면 찾을 수 있어.' },
  { name: '회사 두디',   description: '연결 온 단계를 해금하면 만날 수 있는 스마트한 두디야. 연결을 통해 성장했어요.' },
  { name: '하나 두디',   description: '자립 온 단계를 해금하면 만날 수 있는 희망찬 두디야. 스스로 자립할 수 있어.' },
];

interface DoodyDetailScreenProps {
  doodyId: string;
  onBack: () => void;
}

export default function DoodyDetailScreen({ doodyId, onBack }: DoodyDetailScreenProps) {
  const { unlockedDoodies, collectedDoodies } = useCollectionStore();
  const insets = useSafeAreaInsets();

  // Parse index from doodyId (format: 'doody_N')
  const index = parseInt(doodyId.replace('doody_', ''), 10);
  const isValidIndex = !isNaN(index) && index >= 0 && index < DOODY_CATALOG.length;
  const catalog = isValidIndex ? DOODY_CATALOG[index] : DOODY_CATALOG[0];
  const SvgComponent = isValidIndex ? DOODY_SVGS[index] : DOODY_SVGS[2];

  const [detailData, setDetailData] = useState<BackendDoodyCollectionDetailResponse | null>(null);
  const [fallbackData, setFallbackData] = useState<BackendDoodyCollectionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      const collectedMatch = collectedDoodies.find(d => mapDoodyIdToIndex(d.doodyId) === index);
      if (collectedMatch) {
        setLoading(true);
        try {
          const detail = await collectionApi.getDoodyCollectionDetail(collectedMatch.doodyCollectionId);
          setDetailData(detail);
        } catch (error) {
          console.error('Failed to fetch doody detail:', error);
          setFallbackData(collectedMatch); // Fallback to list item data
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetail();
  }, [index, collectedDoodies]);

  return (
    <View style={[tw`flex-1 bg-white`, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 pt-4 pb-4 bg-white z-10`}>
        <SimpleBackButton onPress={onBack} style={tw`mr-4`} />
        <Text style={tw`flex-1 text-center text-gray-900 text-xl font-bold pr-12`}>
          {detailData?.name || fallbackData?.name || catalog.name}
        </Text>
      </View>

      <View style={tw`flex-1 bg-[#F5F5F5]`}>
        <ScrollView contentContainerStyle={tw`flex-grow px-6 pb-24`} showsVerticalScrollIndicator={false}>
        {/* Doody Image */}
        <View style={tw`items-center justify-center py-10`}>
          <View style={tw`w-48 h-48`}>
            <Image source={SvgComponent} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>

        {/* Info Card 1: 소개 */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold mb-2`}>
            {detailData?.detail?.detailTitle || '소개'}
          </Text>
          <View style={tw`bg-white border border-[${COLORS.primary}] rounded-2xl p-5 shadow-sm`}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={tw`py-4`} />
            ) : (
              <>
                <Text style={tw`text-gray-700 leading-relaxed`}>
                  {detailData?.detail?.detailDescription || detailData?.description || catalog.description}
                </Text>
                {detailData?.detail?.personality && (
                  <View style={tw`mt-3 pt-3 border-t border-gray-100`}>
                    <Text style={tw`text-[${COLORS.primary}] text-xs font-bold mb-1`}>성격</Text>
                    <Text style={tw`text-gray-600 text-xs`}>{detailData.detail.personality}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Info Card 2: 획득 방법/정보 */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold mb-2`}>
            {detailData || fallbackData ? '획득 정보' : '획득 방법'}
          </Text>
          <View style={tw`bg-white border border-[${COLORS.primary}] rounded-2xl p-5 shadow-sm`}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={tw`py-4`} />
            ) : (
              <>
                <View style={tw`flex-row items-center justify-between border-b border-gray-100 pb-3 mb-3`}>
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`w-2 h-2 rounded-full bg-[${COLORS.primary}] mr-2`} />
                    <Text style={tw`text-gray-900 font-bold`}>
                      {detailData ? (detailData.source || '미션 완료 보상') : fallbackData ? (fallbackData.source || '미션 완료 보상') : '청년센터/하나은행 두디 포획'}
                    </Text>
                  </View>
                  {detailData?.axis || fallbackData?.axis ? (
                    <View style={tw`bg-[#EEF7F5] px-2 py-0.5 rounded-full`}>
                      <Text style={tw`text-[${COLORS.primary}] text-[10px] font-bold`}>{detailData?.axis || fallbackData?.axis}</Text>
                    </View>
                  ) : (
                    <View style={tw`bg-[#EEF7F5] px-2 py-0.5 rounded-full`}>
                      <Text style={tw`text-[${COLORS.primary}] text-[10px] font-bold`}>연결</Text>
                    </View>
                  )}
                </View>
                <Text style={tw`text-gray-700 leading-relaxed`}>
                  {(() => {
                    const data = detailData || fallbackData;
                    if (!data) return `지도에서 가까운 청년센터나 하나은행을 방문하고,\n카메라로 두디를 잡아봐!`;
                    
                    const dt = new Date(data.collectedAt);
                    const dateStr = dt.toLocaleDateString('ko-KR');
                    const timeStr = dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
                    
                    let extraInfo = `\n\n획득일시: ${dateStr} ${timeStr}`;
                    
                    const isConnectionDoody = data.axis === 'connection' || String(doodyId) === '5';
                    if (isConnectionDoody) {
                      extraInfo += `\n획득 장소: 서울 청년센터`;
                    }
                    
                    return `${data.earnedReason || '자립/연결 활동을 통해 얻은 소중한 두디야.'}${extraInfo}`;
                  })()}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Bottom Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          // TODO: 나중에 '두디 잡는 화면'으로 이동하도록 연결 예정 (현재는 임시로 뒤로가기)
          onPress={onBack}
          style={tw`bg-[#1C4E3D] py-4 rounded-xl w-full items-center shadow-md`}
        >
          <Text style={tw`text-white font-bold text-base`}>두디 잡으러 가기</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
