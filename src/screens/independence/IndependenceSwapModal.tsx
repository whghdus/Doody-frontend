// src/screens/independence/IndependenceSwapModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import tw from '../../utils/tailwind';
import { Feather } from '@expo/vector-icons';

interface IndependenceSwapModalProps {
  visible: boolean;
  onBack: () => void;
  onRest: () => void;
  onStartSmaller: () => void;
}

export default function IndependenceSwapModal({
  visible,
  onBack,
  onRest,
  onStartSmaller,
}: IndependenceSwapModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onBack}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onBack}
        style={tw`flex-1 bg-black/40 justify-center items-center px-6`}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { }} // Prevent clicks inside the card from closing the modal
          style={tw`w-full bg-white rounded-[32px] p-6 shadow-2xl max-h-[85%]`}
        >

          {/* Header */}
          <View style={tw`flex-row items-center mb-6 gap-x-3`}>
            <TouchableOpacity onPress={onBack}>
              <View style={tw`w-9 h-9 rounded-full bg-[#EEF7F5] items-center justify-center`}>
                <Feather name="chevron-left" size={22} color="#008C75" />
              </View>
            </TouchableOpacity>
            <Text style={tw`text-[#008C75] text-[17px] font-black`}>
              조금 더 작은 걸음으로 바꿔볼게
            </Text>
          </View>

          <ScrollView style={{ flexGrow: 0 }} showsVerticalScrollIndicator={false}>

            {/* Encouragement Box */}
            <View style={tw`bg-[#EEF7F5] rounded-[20px] py-5 px-4 items-center mb-6`}>
              <Text style={tw`text-[#008C75] font-bold text-sm text-center leading-relaxed`}>
                괜찮아. 지금 가능한 만큼만 해도 충분해.
              </Text>
            </View>

            {/* Subtitle */}
            <View style={tw`items-center mb-6`}>
              <Text style={tw`text-[#008C75] font-black text-sm`}>
                💳 자립 미션을 난이도를 조절했어요
              </Text>
            </View>

            {/* Adjusted Mission Card */}
            <View style={tw`bg-[#008C75] rounded-[24px] p-6 mb-6 shadow-sm`}>
              {/* Points Badge */}
              <View style={tw`bg-white/20 px-3 py-1 rounded-full self-start mb-3`}>
                <Text style={tw`text-white text-xs font-bold`}>금 RWA 토큰 +50</Text>
              </View>
              {/* Mission Title */}
              <Text style={tw`text-white text-xl font-bold leading-normal`}>
                나에게 맞는 지원금 보기
              </Text>
            </View>

            {/* Instructions Steps */}
            <View style={tw`mb-2`}>
              <Text style={tw`text-gray-400 text-xs font-bold mb-4`}>이렇게 하면 돼</Text>
              <View style={tw`gap-y-4`}>
                {/* Step 1 */}
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                    <Text style={tw`text-[#008C75] text-xs font-bold`}>1</Text>
                  </View>
                  <Text style={tw`text-gray-800 text-sm font-bold leading-relaxed`}>
                    두디가 데려온 곳, 딱 한 곳만 열어봐
                  </Text>
                </View>
                {/* Step 2 */}
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                    <Text style={tw`text-[#008C75] text-xs font-bold`}>2</Text>
                  </View>
                  <Text style={tw`text-gray-800 text-sm font-bold leading-relaxed`}>
                    마음 가는 데 없으면 그냥 닫아도 돼
                  </Text>
                </View>
                {/* Step 3 */}
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                    <Text style={tw`text-[#008C75] text-xs font-bold`}>3</Text>
                  </View>
                  <Text style={tw`text-gray-800 text-sm font-bold leading-relaxed`}>
                    구경만 해도 자립 기록 한 칸이 쌓여
                  </Text>
                </View>
              </View>
            </View>

          </ScrollView>

          {/* Bottom Buttons */}
          <View style={tw`flex-row gap-x-3 mt-4 border-t border-gray-100 pt-4`}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onRest}
              style={tw`flex-1 bg-gray-50 py-4 rounded-[20px] items-center justify-center border border-gray-100`}
            >
              <Text style={tw`text-[#008C75] font-bold text-base`}>오늘은 쉬어가기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onStartSmaller}
              style={tw`flex-1 bg-[#008C75] py-4 rounded-[20px] items-center justify-center shadow-md`}
            >
              <Text style={tw`text-white font-bold text-base`}>쉬운 미션으로 시작!</Text>
            </TouchableOpacity>
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
