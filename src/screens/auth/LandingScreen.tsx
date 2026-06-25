// src/screens/LandingScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import tw from 'twrnc';
import Background from '../../components/common/Background';
import { COLORS } from '../../constants/theme';
import DoodyLogo from '../../assets/logos/doodyLogo.png';

interface LandingScreenProps {
  onSignupClick: () => void;
  onLoginClick: () => void;
}

export default function LandingScreen({ onSignupClick, onLoginClick }: LandingScreenProps) {
  return (
    <Background theme="day">
      <SafeAreaView style={tw`flex-1 justify-center px-6`}>
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-900 text-2xl font-black text-center mb-2`}>
            두디에 오신 것을 환영해요!
          </Text>
          <Text style={tw`text-gray-500 text-sm font-bold text-center`}>
            나만의 작은 걸음, 자립의 시작을 함께할게요.
          </Text>
        </View>

        <View style={tw`pb-12 items-center w-full`}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSignupClick}
            style={tw`w-[85%] bg-[${COLORS.primary}] py-4 rounded-[20px] items-center justify-center shadow-md mb-4`}
          >
            <Text style={tw`text-white font-bold text-lg`}>새로 시작하기 (회원가입)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onLoginClick}
            style={tw`w-[85%] bg-white border border-gray-200 py-4 rounded-[20px] items-center justify-center shadow-sm`}
          >
            <Text style={tw`text-gray-700 font-bold text-lg`}>기존 계정으로 로그인</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Background>
  );
}
