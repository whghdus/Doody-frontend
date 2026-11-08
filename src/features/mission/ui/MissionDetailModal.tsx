// src/components/MissionDetailModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import SimpleBackButton from '@/shared/ui/SimpleBackButton';
import { formatLongTitle } from '@/shared/lib/textUtils';



interface MissionDetailModalProps {
  visible: boolean;
  currentMission: string;
  missionData?: import('@/shared/api/mission').Mission | null;
  hasFallback?: boolean;
  onClose: () => void;
  onComplete: () => void;
  onChangeToSmaller: () => void;
}

export default function MissionDetailModal({
  visible,
  currentMission,
  missionData,
  hasFallback = true,
  onClose,
  onComplete,
  onChangeToSmaller,
}: MissionDetailModalProps) {
  const steps = missionData?.steps?.length ? missionData.steps : [
    '오늘 미션 내용을 다시 한번 확인해',
    '미션 행동을 천천히 차근차근 실행해',
    '수행을 완료하고 미션 완료 버튼을 눌러 하나머니를 받아',
  ];
  const recommendation = missionData?.reason || '하루의 작은 목표를 완수하며 나만의 긍정적인 루틴을 쌓아가고 자립 에너지를 충전하는 미션이야.';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Dimmed Background Overlay */}
      <View style={tw`flex-1 bg-black/35 justify-center items-center px-4 py-8`}>
        {/* Modal Container Card */}
        <View style={tw`w-full bg-white rounded-[32px] p-6 border border-gray-100 shadow-2xl flex-1 max-h-[85%] justify-between`}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`flex-grow justify-between`}>
            <View>
              {/* Header (Back button with no background circle, left-aligned title, right-aligned badge) */}
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <View style={tw`flex-row items-center`}>
                  <SimpleBackButton onPress={onClose} style={tw`mr-1`} />
                  <Text style={tw`text-gray-900 text-xl font-bold`}>미션 상세</Text>
                </View>
                <View style={tw`bg-[#E6F4F1] px-3 py-1 rounded-full`}>
                  <Text style={tw`text-[#008C75] text-xs font-bold`}>{missionData?.difficulty === 'easy' ? '쉬움' : missionData?.difficulty === 'hard' ? '도전' : '보통'}</Text>
                </View>
              </View>

              {/* Banner Card (Teal container with rounded-square icon and tags) */}
              <View style={tw`bg-[#008C75] rounded-[24px] p-5 flex-row items-center mb-4 shadow-sm`}>
                {/* Rounded Square Icon Container */}
                <View style={tw`w-14 h-14 rounded-[16px] bg-white/20 items-center justify-center mr-4`}>
                  {/* High-quality White Thumbs-Up SVG */}
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3v11z"
                      fill="#FFFFFF"
                    />
                  </Svg>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-lg font-bold`}>
                    {formatLongTitle(currentMission)}
                  </Text>
                </View>
              </View>

              {/* Recommendation Card */}
              <View style={tw`bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm mb-4`}>
                <Text style={tw`text-gray-400 text-xs font-bold mb-2`}>추천 이유</Text>
                <Text style={tw`text-gray-800 text-sm leading-relaxed font-semibold`}>
                  {recommendation}
                </Text>
              </View>

              {/* Steps Card */}
              <View style={tw`bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm mb-6`}>
                <Text style={tw`text-gray-400 text-xs font-bold mb-4`}>하는 방법</Text>
                <View style={tw`gap-y-3.5`}>
                  {steps.map((step, idx) => (
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

            {/* Bottom Buttons */}
            <View style={tw`gap-y-3 mt-4`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onComplete}
                style={tw`bg-[#008C75] py-4 rounded-[20px] w-full items-center justify-center shadow-md`}
              >
                <Text style={tw`text-white font-bold text-base`}>미션 완료하기</Text>
              </TouchableOpacity>

              {hasFallback && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onChangeToSmaller}
                  style={tw`bg-gray-100 py-4 rounded-[20px] w-full items-center justify-center`}
                >
                  <Text style={tw`text-gray-800 font-bold text-base`}>더 작은 미션으로 바꾸기</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
