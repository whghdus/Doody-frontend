import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import tw from '@/shared/lib/tailwind';
import { COLORS } from '@/shared/config/theme';

import DoodyChatInputModal from '@/features/checkIn/ui/DoodyChatInputModal';
import DoodyQuizModal from '@/features/checkIn/ui/DoodyQuizModal';

import DoodySvg from '@/shared/assets/doody/Doody.webp';
import NightDoodySvg from '@/shared/assets/doody/nightDoody.webp';
import HappyDoodySvg from '@/shared/assets/doody/happyDoody.webp';

interface HomeQuizWidgetProps {
  isResting: boolean;
  homeMode: 'default' | 'completed' | 'resting';
  onQuizCompleteAction: () => void;
}

export default function HomeQuizWidget({ isResting, homeMode, onQuizCompleteAction }: HomeQuizWidgetProps) {
  const [showQuizChat, setShowQuizChat] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean>(false);

  const handleQuizChatNext = (inputText: string) => {
    setShowQuizChat(false);
    setTimeout(() => setShowQuiz(true), 300);
  };

  const handleQuizComplete = (correct: boolean) => {
    setQuizIsCorrect(correct);
    setShowQuiz(false);
    onQuizCompleteAction();
  };

  return (
    <>
      <View style={tw`flex-1 justify-center items-center mt-2 mb-20`}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (!isResting) setShowQuizChat(true);
          }}
          style={tw`flex-1 items-center justify-center w-full`}
        >
          {/* Touch!! label (Only show when not resting and not completed) */}
          {!isResting && homeMode === 'default' && (
            <View style={tw`items-center mb-3 mt-auto`}>
              <Text style={tw`text-[${COLORS.primary}] text-sm font-black`}>Touch!!</Text>
              <Svg width={10} height={6} viewBox="0 0 10 5" fill="none">
                <Path
                  d="M1 1L5 5L9 1"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          )}

          {/* Doody Character */}
          <View style={tw`w-full flex-1 max-w-[320px] max-h-[256px] min-h-[140px] items-center justify-center ${(!isResting && homeMode === 'default') ? 'mb-auto' : ''} ${isResting ? 'mt-32' : ''}`}>
            <Image 
              source={isResting ? NightDoodySvg : (homeMode === 'completed' ? HappyDoodySvg : DoodySvg)} 
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      {showQuizChat && (
        <DoodyChatInputModal
          visible={showQuizChat}
          onClose={() => setShowQuizChat(false)}
          onSubmit={handleQuizChatNext}
        />
      )}

      {showQuiz && (
        <DoodyQuizModal
          visible={showQuiz}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </>
  );
}
