// src/components/NightSuccessModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import tw from '@/shared/lib/tailwind';
import PointSvg from '@/shared/assets/icons/point.svg';

interface NightSuccessModalProps {
  visible: boolean;
  onGoHome: () => void;
  onNextMission: () => void;
}

export default function NightSuccessModal({ visible, onGoHome, onNextMission }: NightSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onGoHome}
    >
      <View style={tw`flex-1 bg-black/40 justify-center items-center px-6 py-8`}>
        <View style={tw`w-full bg-white rounded-[32px] px-6 pt-10 pb-8 items-center shadow-2xl border border-gray-100 relative`}>

          <Text style={tw`text-[#008C75] text-2xl font-black mb-2 text-center`}>
            미션 완료!
          </Text>
          <Text style={tw`text-[#8C9C98] text-sm font-bold text-center mb-6`}>
            오늘 하루 기록하기를 해냈어
          </Text>

          {/* Points Card */}
          <View style={tw`w-full bg-[#FFF9E6] rounded-2xl p-4 flex-row items-center mb-3`}>
            <View style={tw`mr-4 shadow-sm`}>
              <PointSvg width={32} height={32} />
            </View>
            <View>
              <Text style={tw`text-[#D48C00] font-black text-xl mb-0.5`}>+30</Text>
              <Text style={tw`text-[#D48C00] font-bold text-xs`}>금 RWA 토큰 적립 완료</Text>
            </View>
          </View>

          {/* Record Count Card */}
          <View style={tw`w-full bg-[#EEF7F5] rounded-2xl p-4 flex-row items-center mb-8`}>
            <Text style={tw`text-xl mr-4`}>⭐</Text>
            <View>
              <Text style={tw`text-[#008C75] font-black text-base mb-0.5`}>이번 달 기록 14개째!</Text>
              <Text style={tw`text-[#8C9C98] font-bold text-xs`}>내일도 함께해</Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onGoHome}
            style={tw`w-full bg-[#008C75] py-4 rounded-full items-center justify-center shadow-sm mb-3`}
          >
            <Text style={tw`text-white font-bold text-base`}>홈으로 돌아가기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNextMission}
            style={tw`w-full bg-white py-4 rounded-full items-center justify-center border border-gray-200`}
          >
            <Text style={tw`text-[#008C75] font-bold text-base`}>다음 미션 보기 →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
