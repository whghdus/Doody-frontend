import { Image } from 'expo-image';
// src/screens/NextStageScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Background from '../../components/common/Background';
import CloseButton from '../../components/common/CloseButton';
import SalaryDoodySvg from '../../assets/doody/salaryDoodt.webp';
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import GreenDoodySvg from '../../assets/doody/greenDoody.webp';
import { useCollectionStore } from '../../store/useCollectionStore';
import { hanaFinanceApi } from '../../api/hanaFinance';

export type StageType = 'connection' | 'independence';

interface NextStageScreenProps {
  onClose: () => void;
  stageType?: StageType;
  onGoToStage?: () => void;
  onGoToCollection?: () => void;
}

export default function NextStageScreen({ onClose, stageType = 'connection', onGoToStage, onGoToCollection }: NextStageScreenProps) {
  const insets = useSafeAreaInsets();
  const { unlockDoody, fetchUnlockedDoodies } = useCollectionStore();
  const [showBenefitModal, setShowBenefitModal] = useState(false);

  React.useEffect(() => {
    if (stageType === 'connection') {
      unlockDoody(5);
    } else {
      unlockDoody(6);
    }
  }, [stageType, unlockDoody]);

  const isConnection = stageType === 'connection';

  const message = isConnection
    ? '연결 기록이 많이 쌓였구나!\n두디가 여기까지 온 너에게 주고싶은 게 있어!'
    : '자립 기록이 많이 쌓였구나!\n두디가 여기까지 온 너에게 주고싶은 게 있어!';

  const stageLabel = isConnection ? '🌱 연결 단계 열림' : '🌱 자립 단계 열림';
  const ctaLabel = isConnection ? '도감으로 가기' : '자립 혜택 바로가기';

  const DoodySvg = isConnection ? SalaryDoodySvg : HappyDoodySvg;

  const handlePrimaryPress = async () => {
    setShowBenefitModal(true);
  };

  const handleModalAction = async (claim: boolean) => {
    setShowBenefitModal(false);
    if (claim) {
      try {
        await hanaFinanceApi.unlockHanaFinance(isConnection ? 'CONNECTION' : 'AUTONOMY');
        // Optionally refresh collection
        await fetchUnlockedDoodies();
      } catch (err) {
        console.error('Failed to unlock stage', err);
      }
      
      // Route to correct URL based on stage type
      const url = isConnection 
        ? 'https://www.hanapoweron.com/' 
        : 'https://www.hanaw.com/main/main/index.cmd';
        
      Linking.openURL(url).catch(err => {
        console.error("Failed to open URL", err);
      });
    }
    onClose();
  };

  return (
    <View style={tw`flex-1`}>
      <Background theme="day">
        {/* Close Button */}
        <SafeAreaView style={[tw`absolute left-6 z-20`, { top: Platform.OS === 'ios' ? insets.top : 20 }]}>
          <CloseButton onPress={onClose} />
        </SafeAreaView>

        <View style={[tw`flex-1 px-6`, { paddingTop: Platform.OS === 'ios' ? insets.top + 70 : 80 }]}>
          {/* Card Bubble */}
          <View style={tw`bg-white rounded-[24px] p-6 border border-[#008C75]/20 shadow-sm relative`}>
            {/* Doody Badge */}
            <View style={tw`flex-row items-center mb-3`}>
              <View style={tw`bg-[#008C75] px-3 py-1 rounded-full`}>
                <Text style={tw`text-white text-xs font-bold`}>🌱 두디</Text>
              </View>
            </View>
            {/* Message */}
            <Text style={tw`text-gray-800 text-base font-bold leading-7`}>
              {message}
            </Text>

            {/* Speech bubble pointer */}
            <View style={[
              tw`absolute w-4 h-4 bg-white border-b border-r border-[#008C75]/20 rotate-45`,
              { bottom: -8, left: 40 },
            ]} />
          </View>

          {/* Doody Illustration */}
          <View style={tw`flex-1 items-center justify-center`}>
            <View style={tw`w-80 h-80 items-center justify-center`}>
              <Image source={DoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
            </View>
          </View>
        </View>

        {/* Bottom Action Card */}
        <View style={[tw`px-6`, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}>
          <View style={tw`bg-white rounded-[28px] px-6 pt-6 pb-6 shadow-md`}>
            {/* Title */}
            <Text style={tw`text-[#008C75] text-base font-black text-center mb-5`}>
              {stageLabel}
            </Text>

            {/* Primary CTA */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePrimaryPress}
              style={tw`bg-[#008C75] py-4 rounded-full items-center shadow-md`}
            >
              <Text style={tw`text-white text-base font-bold`}>
                {ctaLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Background>

      {/* Screen 2: Benefit Modal */}
      <Modal
        visible={showBenefitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBenefitModal(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-6`}>
          <View style={tw`w-full bg-white rounded-[32px] p-6 items-center shadow-2xl`}>
            {/* Modal Title */}
            <Text style={tw`text-[#008C75] text-2xl font-black text-center mb-4`}>
              {isConnection ? '직장 두디 획득!' : '하나 두디 획득!'}
            </Text>

            {/* Doody Illustration */}
            <View style={tw`w-48 h-48 justify-center items-center mb-4`}>
              <Image source={isConnection ? SalaryDoodySvg : GreenDoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
            </View>

            {/* Inner Info Container */}
            <View style={tw`bg-[#EEF7F5] rounded-2xl p-4 w-full items-center mb-6`}>
              <Text style={tw`text-[#008C75] font-black text-sm mb-2.5 text-center`}>
                {isConnection ? '🌱 하나 파워온 혜택' : '🌱 하나 증권 첫 시드'}
              </Text>
              
              {/* Seed Amount Pill */}
              <View style={tw`bg-[#FDF4D9] border border-[#F3C451] px-4 py-2 rounded-full flex-row items-center mb-2.5 shadow-sm`}>
                <View style={tw`w-4.5 h-4.5 rounded-full bg-[#F5B800] items-center justify-center mr-2`}>
                  <Text style={tw`text-white text-[10px] font-black`}>₩</Text>
                </View>
                <Text style={tw`text-[#7A5A00] text-xs font-black`}>
                  {isConnection ? '취업/창업 지원금 보러가기' : '투자 연습용 시드 100,000원'}
                </Text>
              </View>

              <Text style={tw`text-[#008C75] text-[11px] font-bold text-center leading-relaxed`}>
                {isConnection ? '청년을 위한 다양한 지원 프로그램 혜택을 알아봐!' : '언젠가 네가 첫 거래를 해보는 날, 이 돈은 진짜 너의 돈이 될거야!'}
              </Text>
            </View>

            {/* Claim Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleModalAction(true)}
              style={tw`w-full bg-[#008C75] py-4 rounded-full items-center justify-center shadow-md mb-3`}
            >
              <Text style={tw`text-white font-black text-base`}>
                지금 바로 받을래
              </Text>
            </TouchableOpacity>

            {/* Postpone Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleModalAction(false)}
              style={tw`w-full bg-[#EAEAEA] py-4 rounded-full items-center justify-center mb-4`}
            >
              <Text style={tw`text-gray-700 font-bold text-base`}>
                다음에 받을래
              </Text>
            </TouchableOpacity>

            {/* Modal Footer Description */}
            <Text style={tw`text-gray-400 text-[10px] text-center`}>
              {isConnection ? '자세한 혜택은 하나 파워온 홈페이지에서 확인할 수 있어!' : '받으려면 하나증권이랑 연결돼. 안 받아도 두디는 옆에 있어!'}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
