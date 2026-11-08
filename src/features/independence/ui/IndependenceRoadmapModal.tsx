// src/screens/independence/IndependenceRoadmapModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import tw from '@/shared/lib/tailwind';

interface IndependenceRoadmapModalProps {
  visible: boolean;
  onClose: () => void;
  // Props are kept for compatibility but not used in this mock version
  currentStep?: number;
  nodes?: any[];
  pathTitle?: string;
}

export default function IndependenceRoadmapModal({
  visible,
  onClose,
}: IndependenceRoadmapModalProps) {

  // Hardcoded mock data for testing
  const MOCK_TAGS = ['IBK 기업 은행', '코레일', '한국 주택 금융 공사'];

  const MOCK_STEPS = [
    { title: '마음에 드는 공고 이미지 찍어서 올리기' },
    { title: '마음에 드는 공고 이미지 찍어서 올리기' },
    { title: '마음에 드는 공고 이미지 찍어서 올리기' },
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
            <Text style={tw`text-gray-400 text-sm font-bold mb-1`}>내가 가고 싶은 방향</Text>
            <Text style={tw`text-gray-900 text-[22px] font-black leading-snug tracking-tight`}>
              두디가 추천하는{'\n'}지훈이가 나아가야 하는 길
            </Text>
          </View>

          {/* Green Divider */}
          <View style={tw`h-[1.5px] bg-[#008C75] mb-5`} />

          {/* Section 2: Tags */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-gray-400 text-sm font-bold mb-3`}>두디가 옆에서 본 것</Text>
            <View style={tw`flex-row flex-wrap gap-1.5`}>
              {MOCK_TAGS.map((tag, index) => (
                <View key={index} style={tw`bg-[#008C75] rounded-full px-2.5 py-1.5`}>
                  <Text style={tw`text-white text-xs font-bold`}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Green Divider */}
          <View style={tw`h-[1.5px] bg-[#008C75] mb-5`} />

          {/* Section 3: Next Steps */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-gray-400 text-sm font-bold mb-0.5`}>언젠가 같이 알아두면 좋을 것</Text>
            <Text style={tw`text-gray-400 text-xs font-bold mb-4`}>한번에 다 말고, 천천히!</Text>

            {/* List */}
            <View style={tw`gap-y-3`}>
              {MOCK_STEPS.map((node, index) => (
                <View
                  key={index}
                  style={tw`bg-[#EEF7F5] rounded-2xl p-4 flex-row items-center`}
                >
                  <View style={tw`w-5 h-5 rounded-full bg-[#008C75] border-[3px] border-[#B9E5DD] mr-3`} />
                  <Text style={tw`text-[#008C75] text-[15px] font-bold flex-1`}>
                    {node.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 4: Confirm Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={tw`bg-[#008C75] py-3.5 px-10 rounded-2xl items-center justify-center self-center shadow-md min-w-[140px]`}
          >
            <Text style={tw`text-white font-bold text-lg`}>확인!</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
