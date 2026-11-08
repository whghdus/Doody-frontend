// src/screens/independence/IndependenceRestConfirmModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import tw from '@/shared/lib/tailwind';
import { Feather } from '@expo/vector-icons';

interface IndependenceRestConfirmModalProps {
  visible: boolean;
  onBack: () => void;
  onRestForToday: () => void;
}

export default function IndependenceRestConfirmModal({
  visible,
  onBack,
  onRestForToday,
}: IndependenceRestConfirmModalProps) {
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
          style={tw`w-full bg-white rounded-[32px] p-6 shadow-2xl`}
        >
          {/* Header */}
          <View style={tw`flex-row items-center mb-6 gap-x-3`}>
            <TouchableOpacity onPress={onBack}>
              <View style={tw`w-9 h-9 rounded-full bg-[#EEF7F5] items-center justify-center`}>
                <Feather name="chevron-left" size={22} color="#008C75" />
              </View>
            </TouchableOpacity>
            <Text style={tw`text-[#008C75] text-[17px] font-black`}>
              아예 쉬어갈까?
            </Text>
          </View>

          {/* Encouragement Box */}
          <View style={tw`bg-[#EEF7F5] rounded-[20px] py-5 px-4 items-center mb-6`}>
            <Text style={tw`text-[#008C75] font-bold text-[15px] text-center leading-relaxed`}>
              오늘은 이미 쉬운 미션이 준비되어 있어.{'\n'}그래도 오늘은 푹 쉬고 싶다면 언제든 괜찮아!
            </Text>
          </View>

          {/* Bottom Buttons */}
          <View style={tw`flex-row gap-x-3 mt-2`}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onRestForToday}
              style={tw`flex-1 bg-gray-50 py-4 rounded-[20px] items-center justify-center border border-gray-100`}
            >
              <Text style={tw`text-gray-500 font-bold text-[15px]`}>오늘은 쉴래</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onBack}
              style={tw`flex-1 bg-[#008C75] py-4 rounded-[20px] items-center justify-center shadow-md`}
            >
              <Text style={tw`text-white font-bold text-[15px]`}>그래도 해볼게!</Text>
            </TouchableOpacity>
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
