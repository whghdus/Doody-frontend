import { Image } from 'expo-image';
// src/screens/ConnectionSuccessScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  } from 'react-native';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Background from '../../components/common/Background';
import DoodySvg from '../../assets/doody/Doody.webp';
import BrushDoodySvg from '../../assets/doody/brushDoody.webp';
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import SadDoodySvg from '../../assets/doody/sadDoody.webp';
import SmileDoodySvg from '../../assets/doody/smileDoody.webp';
import { useCollectionStore } from '../../store/useCollectionStore';

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg];
const DOODY_NAMES = ['두디', '브러시 두디', '해피 두디', '새드 두디', '스마일 두디'];

interface ConnectionSuccessScreenProps {
  onGoHome: () => void;
  onGoToPokedex: () => void;
  doodyIndex?: number;
}

export default function ConnectionSuccessScreen({ onGoHome, onGoToPokedex, doodyIndex = 0 }: ConnectionSuccessScreenProps) {
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
          <View style={tw`bg-white rounded-3xl p-8 shadow-sm relative border border-gray-100`}>
            <View style={tw`absolute -top-3 left-6 bg-[#008C75] px-4 py-1.5 rounded-full flex-row items-center`}>
              <Text style={tw`text-white text-sm font-bold`}>🌱 두디</Text>
            </View>
            <Text style={tw`text-gray-900 text-xl font-bold mt-2 leading-8`}>
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
        <View style={tw`flex-1 justify-center items-center mt-8`}>
          <View style={tw`w-80 h-80`}>
            <Image source={SvgComponent} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>

        {/* Floating Reward Card */}
        <View style={[tw`px-6 z-30 w-full`, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}>
          <View style={tw`bg-white rounded-[32px] px-6 pt-8 pb-8 shadow-md`}>
            <Text style={tw`text-[#008C75] font-black text-lg mb-4`}>
            획득 보상
          </Text>

          {/* Points Card */}
          <View style={tw`bg-[#FFF9E6] rounded-2xl p-6 items-center justify-center flex-row relative mb-6`}>
            <View style={tw`absolute left-6 w-8 h-8 bg-[#E6B800] rounded-full items-center justify-center`}>
              <Text style={tw`text-white font-bold text-sm`}>P</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-[#B38F00] font-black text-2xl mb-1`}>+30P</Text>
              <Text style={tw`text-[#B38F00] font-bold text-xs`}>하나머니 적립 완료</Text>
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
              style={tw`flex-1 bg-[#008C75] py-4 rounded-full items-center justify-center shadow-md`}
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
