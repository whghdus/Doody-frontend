import { Image } from 'expo-image';
// src/screens/NextStageScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Background from '../../components/common/Background';
import CloseButton from '../../components/common/CloseButton';
import SalaryDoodySvg from '../../assets/doody/salaryDoodt.webp';
import GreenDoodySvg from '../../assets/doody/greenDoody.webp';

export type StageType = 'connection' | 'independence';

interface NextStageScreenProps {
  onClose: () => void;
  stageType?: StageType;
  onGoToStage?: () => void;
}

export default function NextStageScreen({ onClose, stageType = 'connection', onGoToStage }: NextStageScreenProps) {
  const insets = useSafeAreaInsets();

  const isConnection = stageType === 'connection';

  const message = isConnection
    ? '연결 기록이 많이 쌓였어요.\n이제 다음 단계가 열렸어요.'
    : '자립 기록이 많이 쌓였어요.\n이제 다음 단계가 열렸어요.';

  const stageLabel = isConnection ? '🌱 연결 단계 열림' : '🌱 자립 단계 열림';
  const ctaLabel = isConnection ? '연결 혜택 바로가기' : '자립 혜택 바로가기';

  // 연결 해금 = 정장 두디, 자립 해금 = 그린 두디
  const DoodySvg = isConnection ? SalaryDoodySvg : GreenDoodySvg;

  return (
    <View style={tw`flex-1`}>
      <Background theme="day">
        {/* Close Button */}
        <View style={[tw`px-6`, { paddingTop: insets.top + 12 }]}>
          <CloseButton onPress={onClose} />
        </View>

        {/* Speech Bubble Card */}
        <View style={tw`px-6 mt-4`}>
          <View style={tw`bg-white rounded-[24px] p-6 border border-[#008C75]/20 shadow-sm relative`}>
            {/* Doody Badge */}
            <View style={tw`flex-row items-center mb-3`}>
              <View style={tw`bg-[#008C75] px-3 py-1 rounded-full`}>
                <Text style={tw`text-white text-xs font-bold`}>🌱 두디</Text>
              </View>
            </View>
            {/* Message */}
            <Text style={tw`text-gray-800 text-base font-bold leading-7`}>
              {message}
            </Text>

            {/* Speech bubble pointer */}
            <View style={[
              tw`absolute w-4 h-4 bg-white border-b border-r border-[#008C75]/20 rotate-45`,
              { bottom: -8, left: 40 },
            ]} />
          </View>
        </View>

        {/* Doody Illustration */}
        <View style={tw`flex-1 items-center justify-center`}>
          <View style={tw`w-80 h-80 items-center justify-center`}>
            <Image source={DoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>

        {/* Bottom Action Card */}
        <View style={[tw`px-6`, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}>
          <View style={tw`bg-white rounded-[28px] px-6 pt-6 pb-6 shadow-md`}>
            {/* Title */}
            <Text style={tw`text-[#008C75] text-base font-black text-center mb-5`}>
              {stageLabel}
            </Text>

            {/* Primary CTA */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onGoToStage?.();
                onClose();
              }}
              style={tw`bg-[#008C75] py-4 rounded-full items-center shadow-md`}
            >
              <Text style={tw`text-white text-base font-bold`}>
                {ctaLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Background>
    </View>
  );
}
