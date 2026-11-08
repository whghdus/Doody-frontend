import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import tw from '@/shared/lib/tailwind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import CloseButton from '@/shared/ui/CloseButton';
import Background from '@/shared/ui/Background';
import SmileDoodySvg from '@/shared/assets/doody/smileDoody.webp';

interface DoodyChatInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export default function DoodyChatInputModal({ visible, onClose, onSubmit }: DoodyChatInputModalProps) {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText('');
    }
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  React.useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1`}>
        <Background theme="day">
          <View style={[tw`absolute top-0 left-0 w-full`, { height: screenHeight }]}>
            {/* Close Button */}
            <View style={[tw`absolute left-6 z-20`, { top: Platform.OS === 'ios' ? insets.top : 20 }]}>
              <CloseButton onPress={onClose} />
            </View>

            <View style={[tw`flex-1 px-6`, { paddingTop: Platform.OS === 'ios' ? insets.top + 70 : 80 }]}>
              {/* Chat Bubble */}
              <View style={tw`bg-white rounded-[24px] p-6 border border-[#008C75]/20 shadow-sm relative mt-4`}>
                <View style={tw`flex-row items-center mb-3`}>
                  <View style={tw`bg-[#008C75] px-3 py-1 rounded-full`}>
                    <Text style={tw`text-white text-xs font-bold`}>두디</Text>
                  </View>
                </View>
                <Text style={tw`text-gray-800 text-base font-bold leading-7`}>
                  요새 리듬이 일정해졌네 {'\n'}최근에 관심 가지는 주제가 있어?
                </Text>

                {/* Speech bubble pointer */}
                <View style={[
                  tw`absolute w-4 h-4 bg-white border-b border-r border-[#008C75]/20 rotate-45`,
                  { bottom: -8, left: '50%', marginLeft: -8 },
                ]} />
              </View>

              {/* Doody Character (Fixed, won't crush) */}
              <View style={tw`flex-1 items-center justify-center`}>
                <View style={tw`w-64 h-64 items-center justify-center`}>
                  <Image source={SmileDoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                </View>
              </View>
            </View>
          </View>

          {/* Foreground layer for the input, uses KeyboardAvoidingView/viewport sizing */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={tw`absolute inset-0 z-10`}
            pointerEvents="box-none"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={tw`flex-1 justify-end`} pointerEvents="box-none">
                {/* Bottom Input Area */}
                <View style={[
                  tw`px-6 pt-2`,
                  { paddingBottom: isKeyboardVisible ? 10 : Math.max(insets.bottom + 10, 24) }
                ]}>
                  <View style={tw`bg-white rounded-full flex-row items-center px-2 py-1 shadow-md`}>
                    <TextInput
                      style={[tw`flex-1 h-12 px-4 text-base text-gray-800`, Platform.OS === 'web' && { outlineStyle: 'none' }]}
                      placeholder="두디에게 한마디를 건네봐..."
                      placeholderTextColor="#9CA3AF"
                      value={inputText}
                      onChangeText={setInputText}
                      onSubmitEditing={handleSubmit}
                      onBlur={() => {
                        if (Platform.OS === 'web') {
                          window.scrollTo(0, 0);
                        }
                      }}
                      returnKeyType="send"
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleSubmit}
                      style={tw`w-10 h-10 rounded-full bg-[#008C75] items-center justify-center ml-2`}
                    >
                      <Feather name="arrow-up" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Background>
      </View>
    </Modal>
  );
}
