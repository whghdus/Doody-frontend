import { Image } from 'expo-image';
// src/components/MorningSuccessModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import tw from '@/shared/lib/tailwind';
import HappyDoodySvg from '@/shared/assets/doody/happyDoody.webp';
import PointSvg from '@/shared/assets/icons/point.svg';

interface MorningSuccessModalProps {
  visible: boolean;
  onConfirm: () => void;
  title?: string;
  description?: string;
  points?: number;
}

export default function MorningSuccessModal({
  visible,
  onConfirm,
  title = "오늘 하루도 화이팅!",
  description = "와준 게 오늘 제일 큰 일이야.\n그것만으로 오늘 첫 단추는 끼웠어.",
  points = 20
}: MorningSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={tw`flex-1 bg-black/35 justify-center items-center px-6 py-8`}>
        <View style={tw`w-full bg-white rounded-[32px] px-6 pt-10 pb-8 items-center shadow-2xl border border-gray-100 relative`}>
          {/* Top Illustration */}
          <View style={tw`w-32 h-32 mb-6`}>
            <Image source={HappyDoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>

          <Text style={tw`text-gray-900 text-2xl font-black mb-2 text-center`}>
            {title}
          </Text>
          <Text style={tw`text-gray-500 text-sm font-bold text-center mb-6 leading-relaxed`}>
            {description}
          </Text>

          {points !== undefined && points > 0 && (
            <View style={tw`bg-[#FFF9E6] rounded-full px-5 py-3 mb-6 flex-row items-center border border-[#FFE8A1]`}>
              <View style={tw`mr-2 shadow-sm`}>
                <PointSvg width={20} height={20} />
              </View>
              <Text style={tw`text-[#D48C00] font-black text-sm`}>하나머니 +{points}</Text>
            </View>
          )}

          {/* Confirm Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onConfirm}
            style={tw`w-full bg-[#008C75] py-4 rounded-[20px] items-center justify-center shadow-md`}
          >
            <Text style={tw`text-white font-bold text-lg`}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
