// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import tw from '@/shared/lib/tailwind';
import Background from '@/shared/ui/Background';
import { COLORS } from '@/shared/config/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleBackButton from '@/shared/ui/SimpleBackButton';
import { authApi } from '@/shared/api/auth';

interface SignupScreenProps {
  onSignup: (email: string, nickname: string) => void;
  onBack: () => void;
}

export default function SignupScreen({ onSignup, onBack }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해줘.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('알림', '올바른 이메일 주소를 입력해줘.');
      return;
    }

    try {
      await AsyncStorage.setItem('userEmail', email.trim());
      await AsyncStorage.setItem('userNickname', nickname.trim());
      
      // Clear local caches from previous sessions/accounts
      await AsyncStorage.removeItem('daily_mission_completed_date');
      await AsyncStorage.removeItem('morning_checkin_date');
      await AsyncStorage.removeItem('night_checkin_date');
      await AsyncStorage.removeItem('mock_quiz_completed');

      onSignup(email.trim(), nickname.trim());
    } catch (error) {
      console.error('Failed to save email to AsyncStorage', error);
      Alert.alert('오류', '회원가입 처리 중 문제가 발생했어.');
    }
  };

  return (
    <Background theme="day">
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`flex-row items-center px-6 pt-4`}>
          <SimpleBackButton onPress={onBack} />
        </View>
        <KeyboardAwareScrollView 
          style={tw`flex-1`}
          contentContainerStyle={tw`flex-grow justify-center px-6 pb-20`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        >
          <View style={tw`mb-12 px-2 pt-8`}>
              <Text style={tw`text-gray-900 text-3xl font-black mb-3`}>
                반가워!{'\n'}이메일을 알려줘.
              </Text>
              <Text style={tw`text-gray-500 text-sm font-bold`}>
                입력하신 이메일로 두디의 기록이 저장돼.
              </Text>
            </View>

            <View style={tw`bg-white/80 p-6 rounded-3xl shadow-sm border border-gray-100 mb-8`}>
              <Text style={tw`text-gray-700 font-bold mb-2 ml-1`}>닉네임</Text>
              <TextInput
                style={tw`bg-white px-4 py-4 rounded-2xl border border-gray-200 text-base font-semibold text-gray-900 mb-4`}
                placeholder="두디"
                placeholderTextColor="#9CA3AF"
                value={nickname}
                onChangeText={setNickname}
              />

              <Text style={tw`text-gray-700 font-bold mb-2 ml-1`}>이메일 주소</Text>
              <TextInput
                style={tw`bg-white px-4 py-4 rounded-2xl border border-gray-200 text-base font-semibold text-gray-900 mb-6`}
                placeholder="doody@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignup}
                style={tw`w-full bg-[${COLORS.primary}] py-4 rounded-[20px] items-center justify-center shadow-md`}
              >
                <Text style={tw`text-white font-bold text-lg`}>시작하기</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
      </SafeAreaView>
    </Background>
  );
}
