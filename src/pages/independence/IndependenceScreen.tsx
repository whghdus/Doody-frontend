import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import tw from '@/shared/lib/tailwind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

import MorningSuccessModal from '@/features/checkIn/ui/MorningSuccessModal';
import GuideSvg from '@/shared/assets/icons/guide.svg';
import DoodyLogo from '@/shared/assets/logos/doodyLogo.png';

import { missionApi } from '@/shared/api/mission';
import { autonomyApi, AutonomyNode, AutonomyMissionDetailResponse } from '@/shared/api/autonomy';
import { hanaFinanceApi } from '@/shared/api/hanaFinance';
import { userApi } from '@/shared/api/user';
import { useCollectionStore } from '@/entities/useCollectionStore';
import Background from '@/shared/ui/Background';

// Widgets
import IndependenceMapWidget from '@/widgets/independence/ui/IndependenceMapWidget';
import IndependenceMissionWidget from '@/widgets/independence/ui/IndependenceMissionWidget';

interface IndependenceScreenProps {
  onBackToHome?: () => void;
  onToggleNavBar?: (visible: boolean) => void;
  onRestForToday?: () => void;
  onGoToCollection?: () => void;
}

export default function IndependenceScreen({
  onBackToHome, onToggleNavBar, onRestForToday, onGoToCollection
}: IndependenceScreenProps) {
  const insets = useSafeAreaInsets();

  // Widget States
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showRestConfirmModal, setShowRestConfirmModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);
  const [rejectCandidate, setRejectCandidate] = useState<import('@/shared/api/mission').BackendMission | null>(null);
  const [rejectMessage, setRejectMessage] = useState<string>('');
  const [showUnlock, setShowUnlock] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);

  // Data States
  const [currentStep, setCurrentStep] = useState(1);
  const [nodes, setNodes] = useState<AutonomyNode[]>([]);
  const [pathTitle, setPathTitle] = useState<string>('');
  const [currentMissionDetail, setCurrentMissionDetail] = useState<AutonomyMissionDetailResponse | null>(null);
  const [completedReward, setCompletedReward] = useState<number | undefined>(undefined);
  const [todayAvailable, setTodayAvailable] = useState<boolean>(true);
  const [isResting, setIsResting] = useState<boolean>(false);

  const fetchStepData = useCallback(async () => {
    try {
      // 1. Fetch user profile to get completed mission count
      const profile = await userApi.getProfile();
      const actualCurrentStep = profile.missionCount + 1;

      // 2. Fetch today's mission (to act as the CURRENT node)
      const todayMission = await missionApi.getTodayMission();

      setCurrentStep(actualCurrentStep);
      setPathTitle('오늘의 미션 로드맵');

      // Store the today mission as the CURRENT node
      setNodes([{
        step: actualCurrentStep,
        status: 'CURRENT',
        missionId: 'a06_future_capture_1', // HARDCODED for test
        title: '마음에 드는 공고 이미지 찍어서 올리기' // HARDCODED for test
      }]);

      const today = new Date().toISOString().split('T')[0];
      const localCompletedDate = await AsyncStorage.getItem('daily_mission_completed_date');
      setTodayAvailable(localCompletedDate !== today);

      if (todayMission.missionState?.toLowerCase() === 'gated') {
        setIsResting(true);
      } else {
        setIsResting(false);
      }
    } catch (e) {
      console.error('Failed to fetch today mission for background', e);
    }
  }, []);

  useEffect(() => {
    fetchStepData();
  }, [fetchStepData]);

  useEffect(() => {
    if (onToggleNavBar) {
      onToggleNavBar(!showUnlock && !showRoadmapModal && !showVerifyScreen);
    }
  }, [showUnlock, showRoadmapModal, showVerifyScreen, onToggleNavBar]);

  // Use hardcoded mock data for testing (Stage 1 to 6)
  const MOCK_ROADMAP = [
    { step: 1, missionId: 'a01_feeling_word', title: '마음에 드는 공고 이미지 찍어서 올리기' },
    { step: 2, missionId: 'a02_positive_memory', title: '마음에 드는 공고 이미지 찍어서 올리기' },
    { step: 3, missionId: 'a03_finance_touch', title: '마음에 드는 공고 이미지 찍어서 올리기' },
    { step: 4, missionId: 'a04_balance_glance', title: '마음에 드는 공고 이미지 찍어서 올리기' },
    { step: 5, missionId: 'a05_spend_observe', title: '마음에 드는 공고 이미지 찍어서 올리기' },
    { step: 6, missionId: 'a06_future_capture_3', title: '마음에 드는 공고 이미지 찍어서 올리기' },
  ];

  const nodesToUse: AutonomyNode[] = MOCK_ROADMAP.map((item) => {
    let status: 'COMPLETED' | 'CURRENT' | 'LOCKED' = 'LOCKED';
    if (item.step < currentStep) status = 'COMPLETED';
    else if (item.step === currentStep) status = 'CURRENT';
    return {
      step: item.step,
      missionId: item.missionId,
      title: item.title,
      status,
    };
  });

  const activeIndex = nodesToUse.findIndex(n => n.status !== 'COMPLETED');

  const handleOpenMission = async () => {
    if (!todayAvailable) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('미션 완료', '오늘의 미션을 이미 완료했어요! 내일 다시 와주세요.');
      });
      return;
    }
    const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
    const missionId = currentNode?.missionId;

    if (!missionId) return; // Removed startsWith('mock-id') block so mock missions can open too

    try {
      // Mocking the backend for test - ALWAYS SHOW THIS MISSION
      const detail: AutonomyMissionDetailResponse = {
        missionId: 'a06_future_capture_1',
        axis: 'autonomy',
        stage: 1,
        title: '마음에 드는 공고 이미지 찍어서 올리기',
        description: '관심 있는 기업의 공고를 미리 확인해보면, 앞으로 어떤 준비를 해야 할지 감을 잡을 수 있어요.',
        reason: '어떤 직무들이 있는지 가볍게 구경해봐요!',
        howTo: [
          '채용 사이트(사람인, 잡코리아 등)에 접속해요.',
          '관심 있는 직무나 기업의 공고를 찾아요.',
          '마음에 드는 공고를 캡처해서 올려주세요.',
        ],
        missionType: 'NORMAL',
        reward: { hanaMoney: 30 },
        isFallback: false,
      };
      
      setCurrentMissionDetail(detail);
      setShowMissionModal(true);
    } catch (error) {
      console.error('Failed to fetch autonomy mission details', error);
    }
  };

  const handleRest = async () => {
    setShowMissionModal(false);
    const isEasy = currentMissionDetail?.isFallback === true || currentMissionDetail?.missionType === 'EASY';

    if (isEasy) {
      setTimeout(() => setShowRestConfirmModal(true), 150);
    } else {
      try {
        const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
        const originalMissionId = currentNode?.missionId;
        if (originalMissionId) {
          // Bypassing API for mock test
          // const rejectRes = await autonomyApi.rejectMission(originalMissionId, '쉬운 미션으로 변경');
          const rejectRes = {
            candidates: [{
               missionId: 'a06_future_capture_1',
               axis: 'autonomy',
               stage: 1,
               title: '마음에 드는 공고 이미지 찍어서 올리기',
               description: '관심 있는 기업의 공고를 미리 확인해보면...',
               reason: '어떤 직무들이 있는지 가볍게 구경해봐요!',
               howTo: [
                 '채용 사이트(사람인, 잡코리아 등)에 접속해요.',
                 '관심 있는 직무나 기업의 공고를 찾아요.',
                 '마음에 드는 공고를 캡처해서 올려주세요.',
               ],
               missionType: 'NORMAL',
               requiredCount: 1,
               reward: { hanaMoney: 30 },
               fallbackMissionId: null,
               isFallback: false
            }],
            message: '조금 더 쉬운 걸음으로 바꿔볼게 (Mock)'
          };
          if (rejectRes.candidates && rejectRes.candidates.length > 0) {
            setRejectCandidate(rejectRes.candidates[0] as any);
            setRejectMessage(rejectRes.message || '조금 더 쉬운 걸음으로 바꿔볼게');
          }
        }
      } catch (error) {
        console.error('Failed to reject mission', error);
      }
      setTimeout(() => setShowSwapModal(true), 150);
    }
  };

  const handleCompleteMissionProcess = async (missionId: string, photoUri?: string) => {
    if (photoUri) {
      try {
        await autonomyApi.submitEvidence(missionId, { photoUri });
      } catch (error) {
        console.error('Failed to submit evidence', error);
      }
    }
    try {
      const res = await autonomyApi.completeMission(missionId);
      setCompletedReward(res?.reward?.hanaMoney);

      if (res && res.collectedDudy && res.collectedDudy.length > 0) {
        const { unlockDoody } = useCollectionStore.getState();
        res.collectedDudy.forEach((dudy: any) => {
          if (dudy.id === 'd_rhythm_common' || dudy.axis === 'rhythm') unlockDoody(4);
          else if (dudy.axis === 'autonomy') unlockDoody(6);
          else if (dudy.axis === 'connection') unlockDoody(5);
        });
      }

      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('daily_mission_completed_date', today);

      await fetchStepData();
      setTimeout(() => setShowMissionComplete(true), 300);
    } catch (error) {
      console.error('Failed to complete autonomy mission', error);
    }
  };

  const handleStartMission = async () => {
    setShowMissionModal(false);
    const currentNode = activeIndex >= 0 ? nodesToUse[activeIndex] : undefined;
    const missionId = currentMissionDetail?.missionId || currentNode?.missionId;

    if (!missionId || missionId.startsWith('mock-id')) return;

    try {
      await autonomyApi.startMission(missionId);
    } catch (error) {
      console.error('Failed to start autonomy mission', error);
    }

    if (missionId === 'a06_future_capture_1') {
      setTimeout(() => setShowVerifyScreen(true), 150);
    } else {
      await handleCompleteMissionProcess(missionId);
    }
  };

  const handleStartSmaller = async () => {
    setShowSwapModal(false);
    try {
      if (rejectCandidate) {
        setCurrentMissionDetail({
          missionId: rejectCandidate.missionId,
          axis: rejectCandidate.axis,
          stage: rejectCandidate.stage,
          title: rejectCandidate.title,
          description: rejectCandidate.description,
          reason: rejectCandidate.reason,
          howTo: rejectCandidate.howTo || [],
          goalTags: rejectCandidate.goalTags || [],
          missionType: rejectCandidate.missionType,
          requiredEvidenceCount: rejectCandidate.requiredCount,
          reward: rejectCandidate.reward ?? { hanaMoney: 0 },
          externalUrl: null,
          fallbackMissionId: rejectCandidate.fallbackMissionId,
          isFallback: rejectCandidate.isFallback
        });
        setTimeout(() => setShowMissionModal(true), 150);
      } else if (currentMissionDetail?.fallbackMissionId) {
        // Bypassing API for mock test
        // const detail = await autonomyApi.getMission(currentMissionDetail.fallbackMissionId);
        const detail: AutonomyMissionDetailResponse = {
          missionId: 'a06_future_capture_1',
          axis: 'autonomy',
          stage: 1,
          title: '마음에 드는 공고 이미지 찍어서 올리기',
          description: '관심 있는 기업의 공고를 미리 확인해보면...',
          reason: '어떤 직무들이 있는지 가볍게 구경해봐요!',
          howTo: [
            '채용 사이트(사람인, 잡코리아 등)에 접속해요.',
            '관심 있는 직무나 기업의 공고를 찾아요.',
            '마음에 드는 공고를 캡처해서 올려주세요.',
          ],
          missionType: 'NORMAL',
          reward: { hanaMoney: 30 },
          isFallback: false,
        };
        setCurrentMissionDetail(detail);
        setTimeout(() => setShowMissionModal(true), 150);
      } else {
        await fetchStepData();
      }
    } catch (error) {
      console.error('Failed to start smaller mission', error);
    }
  };

  const handleRestForToday = async () => {
    try {
      await missionApi.restToday();
    } catch (error) {
      console.error('Failed to rest today', error);
    }
    onRestForToday?.();
  };

  return (
    <Background theme={isResting ? 'night' : 'day'}>
      <View style={tw`flex-1 relative`}>
        {/* Header */}
        <View style={[tw`absolute w-full z-10 px-5 flex-row justify-between items-center`, { top: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={onBackToHome}
            style={tw`w-[80px] h-[36px]`}
          >
            <Image source={DoodyLogo} style={tw`w-full h-full`} contentFit="contain" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowRoadmapModal(true)} style={tw`w-11 h-11 rounded-full bg-white items-center justify-center shadow-md border border-gray-100/50`}>
            <GuideSvg width={20} height={20} />
          </TouchableOpacity>
        </View>

        <IndependenceMapWidget
          nodesToUse={nodesToUse}
          activeIndex={activeIndex}
          onOpenMission={handleOpenMission}
        />

        {/* Bottom Panel */}
        <View style={[tw`bg-white px-6 pt-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20`, { paddingBottom: insets.bottom + 90 }]}>
          <Text style={tw`text-xl font-black text-gray-900 mb-6`}>
            오늘의 <Text style={tw`text-[#008C75]`}>한 칸</Text>을 같이 열어볼까?
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenMission}
            style={tw`w-full ${todayAvailable ? 'bg-[#008C75]' : 'bg-gray-400'} py-4 rounded-full items-center justify-center shadow-md`}
            disabled={!todayAvailable}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {todayAvailable ? '오늘의 한 칸 열기' : '오늘은 이미 다 했어요'}
            </Text>
          </TouchableOpacity>
        </View>

        <IndependenceMissionWidget
          showMissionModal={showMissionModal}
          setShowMissionModal={setShowMissionModal}
          showSwapModal={showSwapModal}
          setShowSwapModal={setShowSwapModal}
          showRestConfirmModal={showRestConfirmModal}
          setShowRestConfirmModal={setShowRestConfirmModal}
          showRoadmapModal={showRoadmapModal}
          setShowRoadmapModal={setShowRoadmapModal}
          showVerifyScreen={showVerifyScreen}
          setShowVerifyScreen={setShowVerifyScreen}
          showUnlock={showUnlock}
          setShowUnlock={setShowUnlock}
          currentStep={currentStep}
          nodes={nodesToUse}
          pathTitle={pathTitle}
          currentMissionDetail={currentMissionDetail}
          onRest={handleRest}
          onStartMission={handleStartMission}
          onStartSmaller={handleStartSmaller}
          candidate={rejectCandidate}
          message={rejectMessage}
          onRestForToday={handleRestForToday}
          onVerifyComplete={async (photoUri) => {
            const missionId = currentMissionDetail?.missionId;
            if (missionId) await handleCompleteMissionProcess(missionId, photoUri);
          }}
          onGoToCollection={onGoToCollection}
        />

        <MorningSuccessModal
          visible={showMissionComplete}
          onConfirm={async () => {
            setShowMissionComplete(false);
            try {
              const status = await hanaFinanceApi.getUnlockStatus('AUTONOMY');
              if (status.unlockable && !status.unlocked) {
                setTimeout(() => setShowUnlock(true), 200);
              } else {
                onBackToHome?.();
              }
            } catch (e) {
              onBackToHome?.();
            }
          }}
          title="오늘의 한 칸 완료!"
          description={"자립에 한 발짝 다가갔어.\n두디가 널 응원하고 있어!"}
          points={completedReward}
        />
      </View>
    </Background>
  );
}