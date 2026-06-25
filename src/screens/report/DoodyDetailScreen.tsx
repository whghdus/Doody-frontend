import { Image } from 'expo-image';
// src/screens/report/DoodyDetailScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import { COLORS } from '../../constants/theme';

import DoodySvg from '../../assets/doody/Doody.webp';
import BrushDoodySvg from '../../assets/doody/brushDoody.webp';
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import SadDoodySvg from '../../assets/doody/sadDoody.webp';
import SmileDoodySvg from '../../assets/doody/smileDoody.webp';
import SimpleBackButton from '../../components/common/SimpleBackButton';
import { useCollectionStore } from '../../store/useCollectionStore';

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg];

const DOODY_CATALOG = [
  { name: '두디',       description: '기본 두디예요. 어디서나 나타나 조용히 곁에 있어 줘요. 가장 먼저 만날 수 있어요.' },
  { name: '붓 두디',   description: '창의력이 넘치는 두디예요. 무언가를 만들고 기록하는 걸 좋아해요.' },
  { name: '해피 두디', description: '항상 웃고 있는 두디예요. 미션을 완료할수록 더 자주 나타나요.' },
  { name: '슬픈 두디', description: '오늘 좀 힘든 날에 나타나요. 옆에서 같이 있어줄게요.' },
  { name: '스마일 두디', description: '따뜻한 미소를 가진 두디예요. 꾸준히 해낸 날 당신 곁으로 달려와요.' },
];

interface DoodyDetailScreenProps {
  doodyId: string;
  onBack: () => void;
}

export default function DoodyDetailScreen({ doodyId, onBack }: DoodyDetailScreenProps) {
  const { unlockedDoodies } = useCollectionStore();
  const insets = useSafeAreaInsets();

  // Parse index from doodyId (format: 'doody_N')
  const index = parseInt(doodyId.replace('doody_', ''), 10);
  const isValidIndex = !isNaN(index) && index >= 0 && index < DOODY_CATALOG.length;
  const catalog = isValidIndex ? DOODY_CATALOG[index] : DOODY_CATALOG[0];
  const SvgComponent = isValidIndex ? DOODY_SVGS[index] : DOODY_SVGS[2];

  return (
    <View style={[tw`flex-1 bg-white`, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 pt-4 pb-4 bg-white z-10`}>
        <SimpleBackButton onPress={onBack} style={tw`mr-4`} />
        <Text style={tw`flex-1 text-center text-gray-900 text-xl font-bold pr-12`}>
          {catalog.name}
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
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold mb-2`}>소개</Text>
          <View style={tw`bg-white border border-[${COLORS.primary}] rounded-2xl p-5 shadow-sm`}>
            <Text style={tw`text-gray-700 leading-relaxed`}>
              {catalog.description}
            </Text>
          </View>
        </View>

        {/* Info Card 2: 획득 방법 */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-[${COLORS.primary}] text-sm font-bold mb-2`}>획득 방법</Text>
          <View style={tw`bg-white border border-[${COLORS.primary}] rounded-2xl p-5 shadow-sm`}>
            <View style={tw`flex-row items-center justify-between border-b border-gray-100 pb-3 mb-3`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-2 h-2 rounded-full bg-[${COLORS.primary}] mr-2`} />
                <Text style={tw`text-gray-900 font-bold`}>청년센터/하나은행 두디 포획</Text>
              </View>
              <View style={tw`bg-[#EEF7F5] px-2 py-0.5 rounded-full`}>
                <Text style={tw`text-[${COLORS.primary}] text-[10px] font-bold`}>연결</Text>
              </View>
            </View>
            <Text style={tw`text-gray-700 leading-relaxed`}>
              지도에서 가까운 청년센터나 하나은행을 방문하고,{`\n`}카메라로 두디를 잡아보세요!
            </Text>
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
