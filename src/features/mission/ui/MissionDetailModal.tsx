// src/components/MissionDetailModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import SimpleBackButton from '@/shared/ui/SimpleBackButton';
import { formatLongTitle } from '@/shared/lib/textUtils';

interface MissionDetails {
  recommendation: string;
  steps: string[];
  tags: string[];
  badge: string;
}

const missionDataMap: Record<string, MissionDetails> = {
  '0원 소비 기록하기': {
    recommendation: '0원도 중요한 기록이야. 돈을 쓰지 않은 날을 남기면, 내 소비를 부담 없이 바라보는 연습이 돼.',
    steps: [
      '오늘 돈을 쓴 게 있었는지 떠올려요',
      "없었다면 '0원 소비'로 남겨요",
      '완료하면 자립 기록과 하나머니가 쌓여',
    ],
    tags: ['일상', '소비', '매일'],
    badge: '격일',
  },
  '잔액 한 번만 보고 닫기': {
    recommendation: '돈을 마주하는 가장 첫걸음은 현재 잔액을 확인하는 것이야. 작은 숫자를 보는 연습부터 시작해봐.',
    steps: [
      '주거래 은행 앱을 열고 계좌에 접속해요',
      '계좌 잔액 숫자를 눈으로 1초간 바라봐',
      '앱을 끄고 홀가분한 마음으로 오늘 미션을 마쳐',
    ],
    tags: ['일상', '소비', '쉬움'],
    badge: '매일',
  },
  '오늘 돈 쓴 게 있었는지 떠올리기': {
    recommendation: '하루 동안의 소비 흐름을 가볍게 인지하는 것은 건강한 소비 습관의 기초가 돼.',
    steps: [
      '오늘 구매했던 영수증이나 결제 내역을 떠올려요',
      '가장 기억에 남는 소비를 하나 골라요',
      '가계부나 메모장에 간단히 기록해',
    ],
    tags: ['일상', '소비', '보통'],
    badge: '매일',
  },
  '한 달 고정 지출 파악하기': {
    recommendation: '매달 나가는 고정 비용을 정리해두면 소비 계획을 세울 때 불안감이 크게 줄어들어.',
    steps: [
      '월세, 통신비, 구독료 등 고정 지출 목록을 나열해요',
      '각 항목의 출금일과 금액을 메모해요',
      '전체 합계를 구해 한 달 고정 비용을 확인해',
    ],
    tags: ['일상', '소비', '도전'],
    badge: '격일',
  },
  '동네 5분만 걸어보기': {
    recommendation: '밖으로 나가 신선한 공기를 마시고 가볍게 걸으며 응어리진 마음을 환기시키는 미션이야. 부담 갖지 말고 딱 5분만 다녀와봐!',
    steps: [
      '외출복으로 갈아입고 편안한 운동화를 신어',
      '집 주변을 가볍게 5분간 목적지 없이 산책해',
      '돌아와서 물을 한 잔 마시며 스스로에게 칭찬해줘',
    ],
    tags: ['일상', '산책', '매일'],
    badge: '매일',
  },
  '오늘 한 번, 커튼만 열어보기': {
    recommendation: '방 안에 햇빛을 들이는 것은 하루의 에너지를 깨우고 우울감을 완화하는 데 큰 도움이 돼.',
    steps: [
      '아침에 일어나 창가로 가볍게 다가가',
      '방 안의 커튼을 끝까지 활짝 열어 햇빛을 맞이해',
      '창문을 잠시 열어 신선한 바람으로 환기시켜',
    ],
    tags: ['일상', '루틴', '매일'],
    badge: '매일',
  },
};

const getMissionDetails = (title: string): MissionDetails => {
  return missionDataMap[title] || {
    recommendation: '하루의 작은 목표를 완수하며 나만의 긍정적인 루틴을 쌓아가고 자립 에너지를 충전하는 미션이야.',
    steps: [
      '오늘 미션 내용을 다시 한번 확인해',
      '미션 행동을 천천히 차근차근 실행해',
      '수행을 완료하고 미션 완료 버튼을 눌러 점수를 받아',
    ],
    tags: ['일상', '자립', '매일'],
    badge: '매일',
  };
};

interface MissionDetailModalProps {
  visible: boolean;
  currentMission: string;
  hasFallback?: boolean;
  onClose: () => void;
  onComplete: () => void;
  onChangeToSmaller: () => void;
}

export default function MissionDetailModal({
  visible,
  currentMission,
  hasFallback = true,
  onClose,
  onComplete,
  onChangeToSmaller,
}: MissionDetailModalProps) {
  const details = getMissionDetails(currentMission);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Dimmed Background Overlay */}
      <View style={tw`flex-1 bg-black/35 justify-center items-center px-4 py-8`}>
        {/* Modal Container Card */}
        <View style={tw`w-full bg-white rounded-[32px] p-6 border border-gray-100 shadow-2xl flex-1 max-h-[85%] justify-between`}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`flex-grow justify-between`}>
            <View>
              {/* Header (Back button with no background circle, left-aligned title, right-aligned badge) */}
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <View style={tw`flex-row items-center`}>
                  <SimpleBackButton onPress={onClose} style={tw`mr-1`} />
                  <Text style={tw`text-gray-900 text-xl font-bold`}>미션 상세</Text>
                </View>
                <View style={tw`bg-[#E6F4F1] px-3 py-1 rounded-full`}>
                  <Text style={tw`text-[#008C75] text-xs font-bold`}>{details.badge}</Text>
                </View>
              </View>

              {/* Banner Card (Teal container with rounded-square icon and tags) */}
              <View style={tw`bg-[#008C75] rounded-[24px] p-5 flex-row items-center mb-4 shadow-sm`}>
                {/* Rounded Square Icon Container */}
                <View style={tw`w-14 h-14 rounded-[16px] bg-white/20 items-center justify-center mr-4`}>
                  {/* High-quality White Thumbs-Up SVG */}
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3v11z"
                      fill="#FFFFFF"
                    />
                  </Svg>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-lg font-bold`}>
                    {formatLongTitle(currentMission)}
                  </Text>
                </View>
              </View>

              {/* Recommendation Card */}
              <View style={tw`bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm mb-4`}>
                <Text style={tw`text-gray-400 text-xs font-bold mb-2`}>추천 이유</Text>
                <Text style={tw`text-gray-800 text-sm leading-relaxed font-semibold`}>
                  {details.recommendation}
                </Text>
              </View>

              {/* Steps Card */}
              <View style={tw`bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm mb-6`}>
                <Text style={tw`text-gray-400 text-xs font-bold mb-4`}>하는 방법</Text>
                <View style={tw`gap-y-3.5`}>
                  {details.steps.map((step, idx) => (
                    <View key={idx} style={tw`flex-row items-start`}>
                      <View style={tw`w-5 h-5 rounded-full bg-[#008C75] items-center justify-center mr-3 mt-0.5`}>
                        <Text style={tw`text-white text-xs font-bold`}>{idx + 1}</Text>
                      </View>
                      <Text style={tw`text-gray-800 text-sm flex-1 leading-relaxed font-semibold`}>
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Bottom Buttons */}
            <View style={tw`gap-y-3 mt-4`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onComplete}
                style={tw`bg-[#008C75] py-4 rounded-[20px] w-full items-center justify-center shadow-md`}
              >
                <Text style={tw`text-white font-bold text-base`}>미션 완료하기</Text>
              </TouchableOpacity>

              {hasFallback && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onChangeToSmaller}
                  style={tw`bg-gray-100 py-4 rounded-[20px] w-full items-center justify-center`}
                >
                  <Text style={tw`text-gray-800 font-bold text-base`}>더 작은 미션으로 바꾸기</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
