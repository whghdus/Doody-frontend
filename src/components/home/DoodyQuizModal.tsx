import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import tw from '../../utils/tailwind';

interface DoodyQuizModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (isCorrect: boolean) => void;
}

export default function DoodyQuizModal({
  visible,
  onClose,
  onComplete,
}: DoodyQuizModalProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when modal becomes visible
  useEffect(() => {
    if (visible) {
      setSelectedIdx(null);
      setIsSubmitted(false);
    }
  }, [visible]);

  const question = "Q. 아버지인 광개토대왕의 업적을 기리기 위해 광개토대왕릉비를 건립한 고구려의 왕은\n누구일까?";
  const options = ["태조왕", "근초고왕", "장수왕", "소수림왕"];
  const correctIdx = 2; // "장수왕"

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    
    if (!isSubmitted) {
      // First click: Submit answer and show explanation
      setIsSubmitted(true);
    } else {
      // Second click: Confirm and proceed to reward
      const isCorrect = selectedIdx === correctIdx;
      onComplete(isCorrect);
    }
  };

  const isCorrect = selectedIdx === correctIdx;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50 justify-center items-center px-6`}>
        <View style={tw`w-full bg-white rounded-[32px] shadow-2xl p-6`}>
          <View style={tw`w-full items-center mb-6`}>
            <Text style={tw`text-xl font-black text-gray-900 mb-2`}>
              두디의 깜짝 퀴즈
            </Text>
            <Text style={tw`text-xs text-gray-500 font-bold text-center`}>
              두디가 너가 관심있어하는 거에{'\n'}대해 한 번 물어봐볼게!
            </Text>
          </View>

          <View style={tw`w-full border-t border-gray-900 mb-6`} />

          {/* Question */}
          <Text style={tw`text-base font-bold text-gray-900 mb-6 px-2 text-center leading-6`}>
            {question}
          </Text>

          {/* Options */}
          <View style={tw`w-full gap-y-3 mb-6`}>
            {options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              let bgColor = isSelected ? 'bg-[#EEF7F5]' : 'bg-[#F5F8FA]';
              let borderColor = isSelected ? 'border-[#008C75]' : 'border-transparent';
              let dotColor = isSelected ? 'bg-[#008C75]' : 'bg-[#008C75]'; // dot inside circle
              let circleBorder = isSelected ? 'border-[#008C75]' : 'border-gray-300';
              let textColor = isSelected ? 'text-[#008C75]' : 'text-gray-800';

              if (isSubmitted) {
                if (idx === correctIdx) {
                  bgColor = 'bg-[#EEF7F5]';
                  borderColor = 'border-[#008C75]';
                  textColor = 'text-[#008C75]';
                  dotColor = 'bg-[#008C75]';
                  circleBorder = 'border-[#008C75]';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-[#FFF0F0]';
                  borderColor = 'border-[#FF4D4F]';
                  textColor = 'text-[#FF4D4F]';
                  dotColor = 'bg-[#FF4D4F]';
                  circleBorder = 'border-[#FF4D4F]';
                }
              }

              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => !isSubmitted && setSelectedIdx(idx)}
                  style={tw`w-full ${bgColor} border ${borderColor} rounded-2xl py-4 px-4 flex-row items-center`}
                >
                  <View style={tw`w-5 h-5 rounded-full border-2 ${circleBorder} items-center justify-center mr-3 bg-white`}>
                    {(isSelected || (isSubmitted && idx === correctIdx)) && (
                      <View style={tw`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                    )}
                  </View>
                  <Text style={tw`text-sm font-bold ${textColor}`}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation if wrong */}
          {isSubmitted && !isCorrect && (
            <View style={tw`w-full bg-gray-100 rounded-xl p-4 mb-6`}>
              <Text style={tw`text-gray-700 text-xs font-bold leading-relaxed`}>
                평양 천도, 한강 유역 장악, 광개토대왕릉비 건립은 5세기 고구려의 전성기를 이끈 장수왕의 업적입니다.
              </Text>
            </View>
          )}
          {isSubmitted && isCorrect && (
            <View style={tw`w-full bg-[#EEF7F5] rounded-xl p-4 mb-6`}>
              <Text style={tw`text-[#008C75] text-xs font-bold text-center`}>
                정답이야! 넌 정말 대단해!
              </Text>
            </View>
          )}

          {/* Submit/Confirm Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            style={tw`w-full bg-[#008C75] py-4 rounded-full items-center shadow-md`}
          >
            <Text style={tw`text-white font-black text-base`}>
              {isSubmitted ? '확인' : '제출'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
