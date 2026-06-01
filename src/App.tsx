// src/App.tsx
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import tw from 'twrnc';

// 1. SVG 파일을 컴포넌트처럼 import 합니다.
import DoodyLogo from '../assets/LOGO.svg';

export default function App() {
  return (
    <View style={tw`flex-1 bg-gray-100 items-center justify-center p-4`}>
      <StatusBar style="auto" />
      <View style={tw`bg-white p-6 rounded-2xl shadow-md border border-gray-200 items-center`}>
        
        {/* 2. import한 SVG 컴포넌트를 사용하고 크기와 색상을 조절합니다. */}
        <View style={tw`w-16 h-16 mb-4`}>
          <DoodyLogo width="100%" height="100%" fill={tw.color('blue-600')} />
        </View>

        <Text style={tw`text-2xl font-bold text-blue-600 text-center`}>
          Doody 세팅 완료!
        </Text>
        <Text style={tw`text-gray-500 mt-2 text-center`}>
          React Native + Expo 54 + twrnc
        </Text>
      </View>
    </View>
  );
}