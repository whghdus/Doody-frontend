import { Image } from 'expo-image';
// src/screens/ConnectionSuccessScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import tw from '@/shared/lib/tailwind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Background from '@/shared/ui/Background';
import DoodySvg from '@/shared/assets/doody/Doody.webp';
import BrushDoodySvg from '@/shared/assets/doody/brushDoody.webp';
import HappyDoodySvg from '@/shared/assets/doody/happyDoody.webp';
import SadDoodySvg from '@/shared/assets/doody/sadDoody.webp';
import SmileDoodySvg from '@/shared/assets/doody/smileDoody.webp';
import ExplorationDoodySvg from '@/shared/assets/doody/explorationDoody.webp';
import SalaryDoodySvg from '@/shared/assets/doody/salaryDoodt.webp';
import GreenDoodySvg from '@/shared/assets/doody/greenDoody.webp';
import { useCollectionStore } from '@/entities/useCollectionStore';
import PointSvg from '@/shared/assets/icons/point.svg';

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg, ExplorationDoodySvg, SalaryDoodySvg, GreenDoodySvg];
const DOODY_NAMES = ['두디', '양치 두디', '해피 두디', '슬픈 두디', '스마일 두디', '탐험 두디', '회사 두디', '하나 두디'];

interface ConnectionSuccessScreenProps {
  onGoHome: () => void;
  onGoToPokedex: () => void;
  doodyIndex?: number;
  capturedReward?: number;
}

export default function ConnectionSuccessScreen({ onGoHome, onGoToPokedex, doodyIndex = 0, capturedReward = 30 }: ConnectionSuccessScreenProps) {
  const insets = useSafeAreaInsets();
  const SvgComponent = DOODY_SVGS[doodyIndex] || HappyDoodySvg;
  const doodyName = DOODY_NAMES[doodyIndex] || '해피 두디';

  const { unlockDoody } = useCollectionStore();

  useEffect(() => {
    unlockDoody(doodyIndex);
  }, [doodyIndex, unlockDoody]);

  return (
    <View style={tw`flex-1`}>
      <Background theme="day">

        {/* Speech Bubble */}
        <View style={[tw`px-6 z-20`, { paddingTop: insets.top + 40 }]}>
          <View style={tw`bg-white rounded-[24px] p-6 shadow-sm relative border border-gray-100`}>
            <View style={tw`absolute -top-3 left-6 bg-[#008C75] px-3 py-1 rounded-full flex-row items-center`}>
              <Text style={tw`text-white text-xs font-bold`}>🌱 두디</Text>
            </View>
            <Text style={tw`text-gray-900 text-lg font-bold mt-2 leading-7`}>
              안녕! 나는 {doodyName}야! 만나서 반가워!!
            </Text>
            {/* Bubble Tail */}
            <View style={[
              tw`absolute w-6 h-6 bg-white rotate-45 border-r border-b border-gray-100`,
              { bottom: -8, alignSelf: 'center' },
            ]} />
          </View>
        </View>

        {/* Center Doody */}
        <View style={tw`flex-1 justify-center items-center mt-2 mb-2`}>
          <View style={tw`w-full h-full max-w-[280px] max-h-[280px]`}>
            <Image source={SvgComponent} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>

        {/* Floating Reward Card */}
        <View style={[tw`px-6 z-30 w-full`, { paddingBottom: Math.max(insets.bottom + 10, 24) }]}>
          <View style={tw`bg-white rounded-[24px] px-5 py-5 shadow-md`}>
            
            {/* Points Card */}
            <View style={tw`bg-[#FFF9E6] rounded-[20px] p-4 flex-row items-center justify-center mb-5`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`mr-3 shadow-sm`}>
                  <PointSvg width={28} height={28} />
                </View>
                <View style={tw`flex-row items-baseline`}>
                  <Text style={tw`text-[#B38F00] font-bold text-[11px] mr-2`}>금 RWA 토큰 적립 완료</Text>
                  <Text style={tw`text-[#B38F00] font-black text-[22px]`}>+{capturedReward}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row gap-x-3`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onGoHome}
                style={tw`flex-1 bg-[#F3F4F6] py-4 rounded-full items-center justify-center`}
              >
                <Text style={tw`text-gray-700 font-bold text-base`}>홈으로 가기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onGoToPokedex}
                style={tw`flex-1 bg-[#008C75] py-4 rounded-full items-center justify-center shadow-sm`}
              >
                <Text style={tw`text-white font-bold text-base`}>도감으로 가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Background>
    </View>
  );
}
