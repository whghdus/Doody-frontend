// src/screens/independence/IndependenceRoadmapModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import tw from '../../utils/tailwind';
import { useOnboardingStore } from '../../store/useOnboardingStore';

interface IndependenceRoadmapModalProps {
  visible: boolean;
  onClose: () => void;
  currentStep?: number;
}

export default function IndependenceRoadmapModal({
  visible,
  onClose,
}: IndependenceRoadmapModalProps) {
  const userNickname = useOnboardingStore((state) => state.userNickname) || '지훈';

  const items = [
    '데이터 분석이 실제로 하는 일',
    '데이터 분석을 시작하는 방법',
    '데이터 관련 국가 지원',
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/40 justify-center items-center px-6`}>
        <View style={tw`w-full bg-white rounded-[32px] p-6 shadow-2xl`}>
          
          {/* Section 1: Header */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-400 text-xs font-bold mb-1`}>내가 가고 싶은 방향</Text>
            <Text style={tw`text-gray-900 text-xl font-bold leading-normal`}>
              두디가 추천하는{'\n'}
              <Text style={tw`text-gray-900`}>{userNickname}이</Text>가 나아가야 하는 길
            </Text>
          </View>

          {/* Green Divider */}
          <View style={tw`h-[1.5px] bg-[#008C75] mb-4`} />

          {/* Section 2: Badges */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-400 text-xs font-bold mb-2`}>두디가 옆에서 본 것</Text>
            <View style={tw`flex-row items-center gap-x-2`}>
              <View style={tw`bg-[#008C75] px-4 py-1.5 rounded-full`}>
                <Text style={tw`text-white text-xs font-bold`}>데이터 분석</Text>
              </View>
              <View style={tw`bg-[#008C75] px-4 py-1.5 rounded-full`}>
                <Text style={tw`text-white text-xs font-bold`}>SQL</Text>
              </View>
            </View>
          </View>

          {/* Green Divider */}
          <View style={tw`h-[1.5px] bg-[#008C75] mb-4`} />

          {/* Section 3: Next Steps */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-400 text-xs font-bold`}>언젠가 같이 알아두면 좋을 것</Text>
            <Text style={tw`text-gray-400 text-[10px] font-bold mb-4`}>한번에 다 말고, 천천히!</Text>

            {/* List */}
            <View style={tw`gap-y-3`}>
              {items.map((item, index) => (
                <View
                  key={index}
                  style={tw`bg-[#EEF7F5] rounded-2xl p-4 flex-row items-center`}
                >
                  {/* Decorative Dot with Double Ring Effect */}
                  <View style={tw`w-5 h-5 rounded-full bg-[#008C75] border-[3px] border-[#B9E5DD] mr-3`} />
                  <Text style={tw`text-[#008C75] text-sm font-bold flex-1`}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 4: Confirm Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={tw`bg-[#008C75] py-3.5 px-10 rounded-2xl items-center justify-center self-center shadow-md`}
          >
            <Text style={tw`text-white font-bold text-base`}>확인!</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
