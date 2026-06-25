import { Image } from 'expo-image';
// src/screens/MissionDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import DoodySvg from '../../assets/doody/Doody.webp';

interface MissionDetailScreenProps {
  currentMission: string;
  onBack: () => void;
  onComplete: () => void;
  onChangeToSmaller: () => void;
}

export default function MissionDetailScreen({
  currentMission,
  onBack,
  onComplete,
  onChangeToSmaller,
}: MissionDetailScreenProps) {
  return (
    <View style={tw`flex-1 bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm mt-4 mb-4`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`flex-grow justify-between`}>
        <View>
          {/* Header (Left-aligned text next to back arrow) */}
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity 
                onPress={onBack}
                style={tw`w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3`}
              >
                <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                  <Path d="M7 13L1 7L7 1" stroke="#1F2A26" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
              <Text style={tw`text-gray-900 text-xl font-bold`}>미션 상세</Text>
            </View>
            <View style={tw`bg-[#E6F4F1] px-3 py-1 rounded-full`}>
              <Text style={tw`text-[#008C75] text-xs font-bold`}>자립</Text>
            </View>
          </View>

          {/* Banner Card */}
          <View style={tw`bg-[#008C75] rounded-[24px] p-5 flex-row items-center mb-4`}>
            <View style={tw`w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4`}>
              <Image source={DoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white text-lg font-bold mb-2`}>
                {currentMission}
              </Text>
              <View style={tw`flex-row gap-x-2`}>
                {['일상', '자립', '매일'].map((tag, idx) => (
                  <View key={idx} style={tw`bg-white/20 px-3 py-0.5 rounded-full`}>
                    <Text style={tw`text-white text-[10px] font-bold`}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Recommendation Card */}
          <View style={tw`bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm mb-4`}>
            <Text style={tw`text-gray-400 text-xs font-bold mb-2`}>추천 이유</Text>
            <Text style={tw`text-gray-800 text-sm leading-relaxed font-semibold`}>
              0원도 중요한 기록이에요. 돈을 쓰지 않은 날을 남기면, 내 소비를 부담 없이 바라보는 연습이 돼요.
            </Text>
          </View>

          {/* Steps Card */}
          <View style={tw`bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm mb-6`}>
            <Text style={tw`text-gray-400 text-xs font-bold mb-4`}>하는 방법</Text>
            <View style={tw`gap-y-3`}>
              {[
                '오늘 돈을 쓴 게 있었는지만 떠올려요',
                "없었다면 '0원 소비'로 남겨요",
                '완료하면 자립 기록과 하나머니가 쌓여요',
              ].map((step, idx) => (
                <View key={idx} style={tw`flex-row items-start`}>
                  <View style={tw`w-5 h-5 rounded-full bg-[#008C75] items-center justify-center mr-3 mt-0.5`}>
                    <Text style={tw`text-white text-xs font-bold`}>{idx + 1}</Text>
                  </View>
                  <Text style={tw`text-gray-800 text-sm flex-1 leading-relaxed font-semibold`}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={tw`gap-y-3 mt-4`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onComplete}
            style={tw`bg-[#008C75] py-4 rounded-3xl w-full items-center justify-center shadow-md`}
          >
            <Text style={tw`text-white font-bold text-base`}>미션 완료하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onChangeToSmaller}
            style={tw`bg-gray-100 py-4 rounded-3xl w-full items-center justify-center`}
          >
            <Text style={tw`text-[#008C75] font-bold text-base`}>더 작은 미션으로 바꾸기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
