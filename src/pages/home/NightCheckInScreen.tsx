import { Image } from 'expo-image';
// src/screens/NightCheckInScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert,
} from 'react-native';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import tw from '@/shared/lib/tailwind';
import { Feather } from '@expo/vector-icons';
import CloseButton from '@/shared/ui/CloseButton';
import Background from '@/shared/ui/Background';
import WriteDoodySvg from '@/shared/assets/doody/writeDoody.webp';
import MorningSuccessModal from '@/features/checkIn/ui/MorningSuccessModal';
import { checkInApi } from '@/shared/api/checkIn';

interface NightCheckInScreenProps {
  onClose: () => void;
}

export default function NightCheckInScreen({ onClose }: NightCheckInScreenProps) {
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [doodyResponse, setDoodyResponse] = useState<string | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(30);

  const handleSubmit = async () => {
    if (message.trim()) {
      const msg = message.trim();
      setSubmittedMessage(msg);
      setMessage('');
      try {
        const response = await checkInApi.night('night_mood_default', msg);

        if (response.greeting) {
          setDoodyResponse(response.greeting);
        } else {
          setDoodyResponse("오늘을 무사히 마무리한 것만으로도 충분히 잘했어. 푹 쉬자.");
        }
        if (response.pointsEarned) {
          setEarnedPoints(response.pointsEarned);
        }

        // 맞춤형 응답이 나오고 3초 뒤에 성공 모달 표시
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 3000);
      } catch (error: any) {
        console.error('Failed night check-in', error);
        Alert.alert(
          '체크인 실패',
          error.response?.data?.message || '저장에 실패했습니다. 이미 완료한 체크인일 수 있습니다.',
          [{ text: '확인', onPress: onClose }]
        );
      }
    }
  };

  return (
    <Background theme="night">
      <View style={[tw`absolute inset-x-0 top-0 z-0`, { height: SCREEN_HEIGHT }]} pointerEvents="none">
        {/* Doody's Speech Bubble */}
        <View style={[tw`absolute inset-0 items-center justify-center mb-70`]}>
          <View style={tw`bg-white rounded-[24px] p-6 shadow-md relative`}>
            <View style={tw`absolute -top-3 left-6 bg-[#008C75] px-3 py-1 rounded-full flex-row items-center`}>
              <Text style={tw`text-white text-xs font-bold`}>🌱 두디</Text>
            </View>
            <Text style={tw`text-gray-900 text-lg font-bold mt-2 leading-7`}>
              {doodyResponse ? doodyResponse : `오늘 하루를 한마디로 남겨볼까요?\n괜찮아도, 별로여도 그대로 적어도 돼.`}
            </Text>
            {/* Bubble Tail */}
            <View style={[
              tw`absolute w-6 h-6 bg-white rotate-45`,
              { bottom: -8, alignSelf: 'center' },
            ]} />
          </View>
        </View>

        {/* Doody Graphic */}
        <View style={tw`absolute inset-0 items-center justify-center mt-32`}>
          <View style={tw`w-64 h-64 items-center justify-center `}>
            <Image source={WriteDoodySvg} style={{ width: '100%', height: '100%', zIndex: 0 }} contentFit="contain" />
          </View>
        </View>
      </View>

      <SafeAreaView style={tw`flex-1`} pointerEvents="box-none">
        {/* Header Row (Fixed at top) */}
        <View style={tw`flex-row items-center px-6 pt-4 ${Platform.OS === 'android' ? 'mt-6' : ''} z-20`}>
          <CloseButton onPress={onClose} style={tw`absolute left-6 top-4 z-10`} />
          <View style={tw`flex-1 items-center justify-center`}>
            <View style={tw`bg-white/90 px-4 py-2 rounded-full border border-gray-100/50 shadow-sm flex-row items-center`}>
              <View style={tw`w-2 h-2 rounded-full bg-[#008C75] mr-2`} />
              <Text style={tw`text-gray-900 font-bold text-xs`}>두디와 대화 중</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={tw`absolute inset-0 z-10`}
          pointerEvents="box-none"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={tw`flex-1 justify-end`} pointerEvents="box-none">
              {/* User Message Bubble */}
              {submittedMessage && (
                <View style={tw`px-6 mb-4 items-start`}>
                  <View style={tw`bg-white rounded-2xl px-6 py-4 shadow-sm`}>
                    <Text style={tw`text-gray-900 text-base font-bold`}>{submittedMessage}</Text>
                  </View>
                </View>
              )}

              {/* Input Area */}
              <View style={tw`px-6 pb-6 pt-2`}>
                <View style={tw`bg-white rounded-[24px] flex-row items-end px-2 py-1 shadow-md`}>
                  <TextInput
                    style={[tw`flex-1 min-h-[48px] max-h-[120px] px-4 pt-3 pb-3 text-base text-gray-800`, { textAlignVertical: 'top' }]}
                    placeholder="두디에게 한마디를 건네봐..."
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                    multiline={true}
                    editable={!submittedMessage}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    disabled={!!submittedMessage}
                    style={tw`w-10 h-10 rounded-full ${submittedMessage ? 'bg-gray-300' : 'bg-[#008C75]'} items-center justify-center ml-2 mb-1`}
                  >
                    <Feather name="arrow-up" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <MorningSuccessModal
        visible={showSuccessModal}
        onConfirm={onClose}
        title="오늘 하루도 고생했어!"
        description={`오늘을 무사히 마무리한 것만으로도\n충분히 잘했어. 푹 쉬자.`}
        points={earnedPoints}
      />
    </Background>
  );
}
