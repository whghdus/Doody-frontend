// src/components/MissionSuccessModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';

interface MissionSuccessModalProps {
  visible: boolean;
  currentMission: string;
  onGoHome: () => void;
  onViewNextMission: () => void;
}

export default function MissionSuccessModal({
  visible,
  currentMission,
  onGoHome,
  onViewNextMission,
}: MissionSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onGoHome}
    >
      <View style={tw`flex-1 bg-black/35 justify-center items-center px-5`}>
        <View style={tw`bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100 w-[80%] max-h-[80%] justify-between`}>
          <View>
            <Text style={tw`text-2xl font-bold text-center text-[#008C75] mb-2`}>
              미션 완료!
            </Text>
            <Text style={tw`text-sm font-bold text-center text-[#008C75]/80 mb-6`}>
              {currentMission}를 해냈어요
            </Text>

            {/* Point Card */}
            <View style={tw`bg-[#FFF9E6] rounded-[20px] p-4 flex-row items-center mb-3`}>
              <View style={tw`w-8 h-8 rounded-full bg-[#F5B800] items-center justify-center mr-4`}>
                <Text style={tw`text-white font-black text-sm`}>P</Text>
              </View>
              <View>
                <Text style={tw`text-[#D48C00] text-lg font-bold`}>+30P</Text>
                <Text style={tw`text-gray-500 text-xs font-semibold mt-0.5`}>
                  하나머니 적립 완료
                </Text>
              </View>
            </View>

            {/* Record Card */}
            <View style={tw`bg-[#F0F9F7] rounded-[20px] p-4 flex-row items-center mb-6`}>
              <View style={tw`w-8 h-8 rounded-full bg-[#E6F4F1] items-center justify-center mr-4`}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FF8A8A">
                  <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </Svg>
              </View>
              <View>
                <Text style={tw`text-gray-900 text-sm font-bold`}>
                  이번 달 기록 14개째!
                </Text>
                <Text style={tw`text-gray-400 text-xs font-semibold mt-0.5`}>
                  내일도 함께해요
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onGoHome}
              style={tw`bg-[#008C75] py-4 rounded-[20px] w-full items-center justify-center shadow-md mb-3`}
            >
              <Text style={tw`text-white font-bold text-base`}>홈으로 돌아가기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onViewNextMission}
              style={tw`bg-white border border-gray-200 py-4 rounded-[20px] w-full items-center justify-center`}
            >
              <Text style={tw`text-[#008C75] font-bold text-base`}>
                다음 미션 보기 ➔
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
