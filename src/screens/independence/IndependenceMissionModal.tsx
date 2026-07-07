// src/screens/IndependenceMissionModal.tsx
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
import { formatLongTitle } from '../../utils/textUtils';

interface IndependenceMissionModalProps {
  visible: boolean;
  title?: string;
  reason?: string;
  steps?: string[];
  reward?: number;
  onRest: () => void;
  onStart: () => void;
  onClose: () => void;
}

export default function IndependenceMissionModal({
  visible,
  title,
  reason,
  steps,
  reward,
  onRest,
  onStart,
  onClose,
}: IndependenceMissionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={tw`flex-1 bg-black/40 justify-center items-center px-6`}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { }} // Prevent clicks inside the card from closing the modal
          style={tw`w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative max-h-[85%] flex-shrink`}
        >

          {/* Top Teal Header */}
          <View style={tw`bg-[#008C75] px-6 pt-6 pb-6 relative`}>
            {/* Back Button & Badge Row */}
            <View style={tw`flex-row items-center gap-x-3 mb-4`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={tw`w-8 h-8 rounded-full bg-white/20 items-center justify-center`}
              >
                <Feather name="chevron-left" size={22} color="white" />
              </TouchableOpacity>

              <View style={tw`bg-white/20 px-3 py-1 rounded-full`}>
                <Text style={tw`text-white text-xs font-bold`}>금 RWA 토큰 +{reward ?? 50}</Text>
              </View>
            </View>

            <Text style={tw`text-white text-2xl font-black mb-1`}>
              {formatLongTitle(title ?? '나에게 맞는 지원금 보기')}
            </Text>
          </View>

          <ScrollView style={tw`px-6`} contentContainerStyle={tw`pt-6 pb-8`} showsVerticalScrollIndicator={false} bounces={false}>
            {/* Reason Section */}
            <View style={tw`mb-8`}>
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-2`}>
                  <Text style={tw`text-[#008C75] text-[10px]`}>🌱</Text>
                </View>
                <Text style={tw`text-[#008C75] text-sm font-bold`}>두디가 권하는 이유</Text>
              </View>
              <Text style={tw`text-gray-700 text-[13px] font-bold leading-relaxed`}>
                {reason ?? '돈 생각만 하면 머리 아프지. 알아. 딱 한 곳만 구경하는 거야. 안 골라도, 길만 봐둬도 오늘 몫은 끝이야.'}
              </Text>
            </View>

            {/* Steps Section */}
            <View style={tw`mb-8`}>
              <Text style={tw`text-gray-500 text-xs font-bold mb-4`}>이렇게 하면 돼</Text>
              <View style={tw`gap-y-4`}>
                {steps && steps.length > 0 ? (
                  steps.map((step, index) => (
                    <View key={index} style={tw`flex-row items-center`}>
                      <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                        <Text style={tw`text-[#008C75] text-xs font-bold`}>{index + 1}</Text>
                      </View>
                      <Text style={tw`text-gray-900 text-[13px] font-bold flex-1`}>{step}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                        <Text style={tw`text-[#008C75] text-xs font-bold`}>1</Text>
                      </View>
                      <Text style={tw`text-gray-900 text-[13px] font-bold`}>두디가 데려온 곳, 딱 한 곳만 열어봐</Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                        <Text style={tw`text-[#008C75] text-xs font-bold`}>2</Text>
                      </View>
                      <Text style={tw`text-gray-900 text-[13px] font-bold`}>마음 가는 데 없으면 그냥 닫아도 돼</Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                        <Text style={tw`text-[#008C75] text-xs font-bold`}>3</Text>
                      </View>
                      <Text style={tw`text-gray-900 text-[13px] font-bold`}>구경만 해도 자립 기록 한 칸이 쌓여</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row gap-x-3`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onRest}
                style={tw`flex-1 bg-[#EEF7F5] py-4 rounded-[20px] items-center justify-center`}
              >
                <Text style={tw`text-[#008C75] font-bold text-[15px]`}>쉬러 가기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onStart}
                style={tw`flex-1 bg-[#008C75] py-4 rounded-[20px] items-center justify-center`}
              >
                <Text style={tw`text-white font-bold text-[15px]`}>하러 가기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

