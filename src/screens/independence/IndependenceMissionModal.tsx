// src/screens/IndependenceMissionModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';

interface IndependenceMissionModalProps {
  visible: boolean;
  onRest: () => void;
  onStart: () => void;
  onClose: () => void;
}

export default function IndependenceMissionModal({
  visible,
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
      <View style={tw`flex-1 bg-black/40 justify-center items-center px-6 pb-20`}>
        <View style={tw`w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative`}>
          
          {/* Top Teal Header */}
          <View style={tw`bg-[#008C75] px-6 pt-8 pb-6 rounded-t-3xl`}>
            <View style={tw`bg-white/20 px-3 py-1.5 rounded-full self-start mb-4`}>
              <Text style={tw`text-white text-xs font-bold`}>하나머니 +50</Text>
            </View>
            <Text style={tw`text-white text-2xl font-black mb-1`}>
              나에게 맞는 지원금 보기
            </Text>
          </View>

          <View style={tw`px-6 pt-6 pb-8`}>
            {/* Reason Section */}
            <View style={tw`mb-8`}>
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-2`}>
                  <Text style={tw`text-[#008C75] text-[10px]`}>🌱</Text>
                </View>
                <Text style={tw`text-[#008C75] text-sm font-bold`}>두디가 권하는 이유</Text>
              </View>
              <Text style={tw`text-gray-700 text-sm font-bold leading-relaxed`}>
                돈 생각만 하면 머리 아프지. 알아. 딱 한 곳만 구경하는 거야. 안 골라도, 길만 봐둬도 오늘 몫은 끝이야.
              </Text>
            </View>

            {/* Steps Section */}
            <View style={tw`mb-8`}>
              <Text style={tw`text-gray-500 text-xs font-bold mb-4`}>이렇게 하면 돼</Text>
              <View style={tw`gap-y-4`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                    <Text style={tw`text-[#008C75] text-xs font-bold`}>1</Text>
                  </View>
                  <Text style={tw`text-gray-900 text-sm font-bold`}>두디가 데려온 곳, 딱 한 곳만 열어봐</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                    <Text style={tw`text-[#008C75] text-xs font-bold`}>2</Text>
                  </View>
                  <Text style={tw`text-gray-900 text-sm font-bold`}>마음 가는 데 없으면 그냥 닫아도 돼</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-6 h-6 rounded-full bg-[#EEF7F5] items-center justify-center mr-3`}>
                    <Text style={tw`text-[#008C75] text-xs font-bold`}>3</Text>
                  </View>
                  <Text style={tw`text-gray-900 text-sm font-bold`}>구경만 해도 자립 기록 한 칸이 쌓여</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row gap-x-3`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onRest}
                style={tw`flex-1 bg-[#EEF7F5] py-4 rounded-full items-center justify-center`}
              >
                <Text style={tw`text-[#008C75] font-bold text-base`}>쉬러 가기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onStart}
                style={tw`flex-1 bg-[#008C75] py-4 rounded-full items-center justify-center`}
              >
                <Text style={tw`text-white font-bold text-base`}>보러 가기</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
}
