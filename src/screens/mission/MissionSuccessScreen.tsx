import { Image } from 'expo-image';
// src/screens/MissionSuccessScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '../../utils/tailwind';
import Background from '../../components/common/Background';
import SpeechBubble from '../../components/common/SpeechBubble';
import HappySvg from '../../assets/doody/happyDoody.webp';
import MissionSuccessModal from '../../components/mission/MissionSuccessModal';

interface MissionSuccessScreenProps {
  visibleModal: boolean;
  currentMission: string;
  onNext: () => void;
  onGoHome: () => void;
  onViewNextMission: () => void;
}

export default function MissionSuccessScreen({
  visibleModal,
  currentMission,
  onNext,
  onGoHome,
  onViewNextMission,
}: MissionSuccessScreenProps) {
  return (
    <Background theme="day">
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.65)' }]} />
      <SafeAreaView style={tw`flex-1`}>
        {/* Header Row */}
        <View style={tw`relative w-full flex-row items-center justify-center px-6 py-4`}>
          <Text style={tw`text-[#008C75] text-lg font-black`}>미션 완료!</Text>
        </View>

        {/* Centered Happy Doody */}
        <View style={tw`flex-grow justify-center items-center px-6 pb-4`}>
          <View style={tw`w-80 h-80 items-center justify-center`}>
            <Image source={HappySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>

        {/* Congratulations Card at the bottom */}
        <View style={tw`px-6 pb-12`}>
          <SpeechBubble
            text={`잘했어요!\n오늘의 자립 기록이 하나 쌓였어요.`}
            sender="doody"
          />
          <View style={tw`mt-4`}>
            <TouchableOpacity
              onPress={onNext}
              style={tw`flex-row items-center justify-end mr-1`}
              activeOpacity={0.7}
            >
              <Text style={tw`text-[#008C75] text-sm font-bold mr-1`}>다음</Text>
              <Svg width={10} height={6} viewBox="0 0 10 6" fill="none">
                <Path
                  d="M1 1L5 5L9 1"
                  stroke="#008C75"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Success Modal Component */}
        <MissionSuccessModal
          visible={visibleModal}
          currentMission={currentMission}
          onGoHome={onGoHome}
          onViewNextMission={onViewNextMission}
        />
      </SafeAreaView>
    </Background>
  );
}
