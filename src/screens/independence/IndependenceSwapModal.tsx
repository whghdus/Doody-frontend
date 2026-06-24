// src/screens/IndependenceSwapModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
const { width } = Dimensions.get('window');
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleBackButton from '../../components/common/SimpleBackButton';

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
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const insets = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(width)).current;
  const [internalVisible, setInternalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      // Ensure the value starts at width
      slideAnim.setValue(width);
      // Small delay to allow the view to mount before animating
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }, 50);
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false);
      });
    }
  }, [visible, slideAnim, width]);

  const MISSIONS = [
    {
      title: '잔액 한 번만 보고 닫기',
      subtitle: '앱을 열고 숫자만 확인해요',
      badge: '쉬움',
      badgeBg: 'bg-[#ECFDF5]',
      badgeText: 'text-[#10B981]',
      icon: '👀',
    },
    {
      title: '오늘 돈 쓴 게 있었는지 떠올리기',
      subtitle: '있었다면 하나만 기록해요',
      badge: '보통',
      badgeBg: 'bg-[#FFFBEB]',
      badgeText: 'text-[#F59E0B]',
      icon: '📝',
    },
    {
      title: '한 달 고정 지출 파악하기',
      subtitle: '월세·통신비·구독료 목록 작성',
      badge: '도전',
      badgeBg: 'bg-[#FFF1F2]',
      badgeText: 'text-[#E11D48]',
      icon: '🗓️',
    },
  ];

  if (!internalVisible && !visible) return null;

  return (
    <Animated.View 
      style={[
        tw`absolute inset-0 bg-white z-50`, 
        { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 24 }
      ]}
    >
        {/* Header */}
        <View style={tw`flex-row items-center justify-center px-6 mb-6 relative`}>
          <TouchableOpacity onPress={onBack} style={tw`absolute left-6 z-10`}>
            <View style={tw`w-10 h-10 rounded-full bg-[#EEF7F5] items-center justify-center`}>
              <Feather name="chevron-left" size={24} color="#008C75" />
            </View>
          </TouchableOpacity>
          <Text style={tw`text-[#008C75] text-lg font-black text-center`}>
            조금 더 작은 걸음으로 바꿔볼게요
          </Text>
        </View>

        <ScrollView contentContainerStyle={tw`px-6 pb-32`} showsVerticalScrollIndicator={false}>
          {/* Encouragement Box */}
          <View style={tw`bg-[#E6F4EA] rounded-2xl py-6 px-4 items-center mb-8`}>
            <Text style={tw`text-[#008C75] font-bold text-base text-center`}>
              괜찮아요. 지금 가능한 만큼만 해도 충분해요.
            </Text>
          </View>

          {/* Subtitle */}
          <View style={tw`flex-row justify-center items-center mb-6`}>
            <Text style={tw`text-[#008C75] font-black text-base`}>
              💳 자립 미션을 작게 나눴어요
            </Text>
          </View>

          {/* Mission List */}
          <View style={tw`gap-y-6 relative`}>
            {MISSIONS.map((mission, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <View key={idx}>
                  {idx > 0 && (
                    <View style={tw`absolute -top-4 left-1/2 w-[1px] h-3 bg-[#D1ECE6]`} />
                  )}
                  {idx > 0 && (
                    <Text style={tw`absolute -top-3 left-[49.5%] text-[#D1ECE6] text-[10px]`}>↓</Text>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setSelectedIdx(idx)}
                    style={[
                      tw`flex-row items-center p-5 rounded-2xl border bg-white`,
                      isSelected
                        ? tw`border-[#008C75] bg-[#EEF7F5]`
                        : tw`border-gray-100`,
                    ]}
                  >
                    <View style={tw`w-8 h-8 rounded-full bg-gray-50 items-center justify-center mr-4`}>
                      <Text style={tw`text-lg`}>{mission.icon}</Text>
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={[
                        tw`text-base font-bold mb-0.5`,
                        isSelected ? tw`text-[#008C75]` : tw`text-[#9CA3AF]`
                      ]}>
                        {mission.title}
                      </Text>
                      <Text style={[
                        tw`text-xs font-bold`,
                        isSelected ? tw`text-[#8C9C98]` : tw`text-[#D1D5DB]`
                      ]}>
                        {mission.subtitle}
                      </Text>
                    </View>
                    {/* Badge */}
                    <View style={tw`${mission.badgeBg} px-3 py-1.5 rounded-full`}>
                      <Text style={tw`${mission.badgeText} text-[10px] font-black`}>
                        {mission.badge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 pb-10 flex-row gap-x-3`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onRest}
            style={tw`flex-1 bg-[#F9FAFB] py-4 rounded-2xl items-center justify-center border border-gray-100`}
          >
            <Text style={tw`text-[#008C75] font-bold text-base`}>오늘은 쉬어가기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onStartSmaller}
            style={tw`flex-1 bg-[#008C75] py-4 rounded-2xl items-center justify-center shadow-md`}
          >
            <Text style={tw`text-white font-bold text-base`}>쉬운 미션으로 시작!</Text>
          </TouchableOpacity>
        </View>
    </Animated.View>
  );
}
