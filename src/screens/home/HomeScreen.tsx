import { Image } from 'expo-image';
// src/screens/HomeScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';
import Background from '../../components/common/Background';
import { COLORS } from '../../constants/theme';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useCollectionStore } from '../../store/useCollectionStore';
import { userApi } from '../../api/user';
import { missionApi, Mission } from '../../api/mission';
import { checkInApi } from '../../api/checkIn';

// Logos
import DoodyLogo from '../../assets/logos/doodyLogo.png';
import DoodyLogoWhite from '../../assets/logos/doodyLogoWhite.png';

// Illustrations
import DoodySvg from '../../assets/doody/Doody.webp';
import NightDoodySvg from '../../assets/doody/nightDoody.webp';
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';

import NavBar, { TabType } from '../../components/common/NavBar';
import MissionCard from '../../components/mission/MissionCard';
import MissionDetailModal from '../../components/mission/MissionDetailModal';
import MissionSwapModal from '../../components/mission/MissionSwapModal';
import MissionVerifyScreen from '../mission/MissionVerifyScreen';
import MissionSuccessScreen from '../mission/MissionSuccessScreen';
import NextStageScreen, { StageType } from '../mission/NextStageScreen';
import ReportContainer from '../report/ReportContainer';
import MorningCheckInScreen from './MorningCheckInScreen';
import NightCheckInScreen from './NightCheckInScreen';
import IndependenceScreen from '../independence/IndependenceScreen';
import ConnectionScreen from '../connection/ConnectionScreen';
import MorningSuccessModal from '../../components/home/MorningSuccessModal';
import DoodyCollectionScreen from '../report/DoodyCollectionScreen';
import DoodyDetailScreen from '../report/DoodyDetailScreen';
import CollectionSvg from '../../assets/icons/collection.svg';

const SMALLER_MISSIONS = [
  {
    emoji: '👀',
    title: '잔액 한 번만 보고 닫기',
    subtitle: '앱을 열고 숫자만 확인해요',
    badge: '쉬움',
    badgeBg: 'bg-[#E6F4F1]',
    badgeText: 'text-[#008C75]',
  },
  {
    emoji: '📝',
    title: '오늘 돈 쓴 게 있었는지 떠올리기',
    subtitle: '있었다면 하나만 기록해요',
    badge: '보통',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-600',
  },
  {
    emoji: '🗓️',
    title: '한 달 고정 지출 파악하기',
    subtitle: '월세·통신비·구독료 목록 작성',
    badge: '도전',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-600',
  },
];

interface HomeScreenProps {
  onRestartOnboarding: () => void;
}

export default function HomeScreen({ onRestartOnboarding }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const selectedCategory = useOnboardingStore((state) => state.selectedCategory);
  const goalId = useOnboardingStore((state) => state.selectedGoal);

  // Home mode: default (with mission), completed (no mission), resting (night)
  const [homeMode, setHomeMode] = useState<'default' | 'completed' | 'resting'>('default');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Mission states
  const [currentMission, setCurrentMission] = useState<string>('미션을 불러오는 중...');
  const [missionData, setMissionData] = useState<Mission | null>(null);
  const [homeViewState, setHomeViewState] = useState<'main' | 'detail' | 'smaller' | 'verify' | 'success_speak' | 'success_modal' | 'next_stage'>('main');
  const [selectedSmallerIdx, setSelectedSmallerIdx] = useState<number>(0);
  const [isNavBarVisible, setIsNavBarVisible] = useState<boolean>(true);
  const [initialReportView, setInitialReportView] = useState<'main' | 'collection' | 'detail'>('main');
  const [nextStageType, setNextStageType] = useState<StageType>('connection');
  const [missionCount, setMissionCount] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);

  // Morning Check-In States
  const [hasCheckedInMorning, setHasCheckedInMorning] = useState<boolean>(true);
  const [showMorningSuccess, setShowMorningSuccess] = useState<boolean>(false);
  const [morningPoints, setMorningPoints] = useState<number>(20);
  const [morningGreeting, setMorningGreeting] = useState<string>("와준 게 오늘 제일 큰 일이야.\n그것만으로 오늘 첫 단추는 끼웠어.");

  // Night Check-In State (Demo)
  const [showNightCheckIn, setShowNightCheckIn] = useState<boolean>(false);

  // Collection States
  const [showCollection, setShowCollection] = useState<boolean>(false);
  const [selectedCollectionDoodyId, setSelectedCollectionDoodyId] = useState<string | null>(null);

  // Always show NavBar when switching tabs
  useEffect(() => {
    setIsNavBarVisible(true);
  }, [activeTab]);

  const fetchHomeData = useCallback(async () => {
    try {
      const profile = await userApi.getProfile();
      setPoints(profile.points);
      setMissionCount(profile.missionCount);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }

    try {
      const todayMission = await missionApi.getTodayMission();
      setMissionData(todayMission);
      setCurrentMission(todayMission.title);
      if (todayMission.missionState === 'gated') {
        setHomeMode('resting');
      } else {
        setHomeMode('default');
      }
    } catch (error) {
      console.error('Failed to fetch today mission', error);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData, activeTab]);

  useEffect(() => {
    const checkMorningStatus = async () => {
      try {
        // 데모 시연을 위해 하루 한 번 제한을 풀고 항상 보이도록 설정합니다.
        // const today = new Date().toISOString().split('T')[0];
        // const lastCheckIn = await AsyncStorage.getItem('lastMorningCheckIn');
        // if (lastCheckIn !== today) {
        //   setHasCheckedInMorning(false);
        // }
        // setHasCheckedInMorning(false);
      } catch (error) {
        console.error('Failed to read async storage', error);
        setHasCheckedInMorning(false);
      }
    };
    checkMorningStatus();
  }, []);

  const handleCompleteMorning = async (mood: number) => {
    try {
      const res = await checkInApi.morning(mood);
      setMorningPoints(res.pointsEarned);
      if (res.greeting) {
        setMorningGreeting(res.greeting);
      }
      
      // Auto-unlock Doodies inside Collection Book
      if (res.collectedDudy && res.collectedDudy.length > 0) {
        const { unlockDoody } = useCollectionStore.getState();
        res.collectedDudy.forEach((dudy) => {
          if (dudy.id === 'd_rhythm_common' || dudy.axis === 'rhythm') {
            unlockDoody(4); // SmileDoody
          } else if (dudy.axis === 'autonomy') {
            unlockDoody(6); // GreenDoody
          } else if (dudy.axis === 'connection') {
            unlockDoody(5); // SalaryDoody
          }
        });
      }

      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastMorningCheckIn', today);
    } catch (error) {
      console.error('Failed morning check-in', error);
    }
    setHasCheckedInMorning(true);
    setShowMorningSuccess(true);
    fetchHomeData();
  };

  const handleCloseMorning = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastMorningCheckIn', today);
    } catch (error) { }
    setHasCheckedInMorning(true);
  };

  const isResting = homeMode === 'resting';
  const isCompleted = homeMode === 'completed';

  const handleStartMission = useCallback(() => {
    // Navigate to appropriate tab based on nextPath from API
    if (missionData && missionData.nextPath) {
      if (missionData.nextPath === '/autonomy') {
        setActiveTab('independence');
      } else if (missionData.nextPath === '/connection') {
        setActiveTab('connection');
      }
    } else {
      if (currentMission.includes('자립')) {
        setActiveTab('independence');
      } else {
        setActiveTab('connection');
      }
    }
  }, [missionData, currentMission]);

  const handleCompleteMission = useCallback(() => {
    setHomeViewState('verify');
  }, []);

  const handleRestForToday = useCallback(async () => {
    try {
      await missionApi.restToday();
    } catch (error) {
      console.error('Failed to rest today', error);
    }
    setHomeMode('resting');
    setHomeViewState('main');
  }, []);

  const handleStartSmallerMission = useCallback(async () => {
    try {
      const mission = await missionApi.swapMission('easy');
      setCurrentMission(mission.title);
    } catch (error) {
      console.error('Failed to swap mission', error);
      setCurrentMission(SMALLER_MISSIONS[selectedSmallerIdx].title);
    }
    setHomeViewState('main');
  }, [selectedSmallerIdx]);

  const toggleResting = useCallback(() => {
    if (isResting) {
      setHomeMode('default');
    } else {
      setHomeMode('resting');
    }
  }, [isResting]);

  if (!hasCheckedInMorning) {
    return <MorningCheckInScreen onClose={handleCloseMorning} onComplete={handleCompleteMorning} />;
  }

  if (showNightCheckIn) {
    return <NightCheckInScreen onClose={() => setShowNightCheckIn(false)} />;
  }

  if (selectedCollectionDoodyId) {
    return (
      <DoodyDetailScreen
        doodyId={selectedCollectionDoodyId}
        onBack={() => setSelectedCollectionDoodyId(null)}
      />
    );
  }

  if (showCollection) {
    return (
      <DoodyCollectionScreen
        onBack={() => setShowCollection(false)}
        onDoodyClick={(id) => setSelectedCollectionDoodyId(id)}
      />
    );
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsNavBarVisible(true);
    if (tab === 'report') {
      setInitialReportView('main');
    }
  };

  const goToReportCollection = () => {
    setShowCollection(true);
  };

  // Sub-screens (verify, success, next_stage)
  if (homeViewState === 'verify') {
    return (
      <MissionVerifyScreen
        onCancel={() => setHomeViewState('main')}
        onVerifyComplete={async (photoUri) => {
          try {
            const res = await missionApi.completeMission(photoUri);
            setPoints(res.newTotalPoints);
            setMissionCount(res.currentStep);
            setHomeMode('completed');
            setHomeViewState('success_speak');
          } catch (error) {
            console.error('Failed to complete mission', error);
            Alert.alert('오류', '미션 완료 처리 중 문제가 발생했습니다.');
          }
        }}
      />
    );
  }

  if (homeViewState === 'success_speak' || homeViewState === 'success_modal') {
    return (
      <MissionSuccessScreen
        visibleModal={homeViewState === 'success_modal'}
        currentMission={currentMission}
        onNext={() => setHomeViewState('success_modal')}
        onGoHome={() => {
          setHomeViewState('main');
        }}
        onViewNextMission={() => {
          setCurrentMission('오늘 돈 쓴 게 있었는지 떠올리기');
          setHomeMode('default');
          setHomeViewState('detail');
        }}
      />
    );
  }

  if (homeViewState === 'next_stage') {
    return (
      <NextStageScreen
        stageType={nextStageType}
        onClose={() => setHomeViewState('main')}
        onGoToStage={() => {
          if (nextStageType === 'connection') {
            setActiveTab('connection');
          } else {
            setActiveTab('independence');
          }
        }}
        onGoToCollection={() => setShowCollection(true)}
      />
    );
  }

  return (
    <Background theme={isResting ? 'night' : 'day'}>
      <View style={tw`flex-1 relative`}>
        {/* ==================== HOME TAB ==================== */}
        {activeTab === 'home' ? (
          <SafeAreaView style={tw`flex-1`}>
            {/* Top Header */}
            <View style={tw`flex-row justify-between items-center px-6 pt-4 z-10`}>
              {/* Logo */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (isResting) {
                    setHomeMode('default');
                  } else {
                    onRestartOnboarding();
                  }
                }}
                style={tw`w-[90px] h-[40px] items-center justify-center`}
              >
                <Image
                  source={isResting ? DoodyLogoWhite : DoodyLogo}
                  style={tw`w-full h-full`}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Right side: Points, Toggle Badge, Collection Icon in order */}
              <View style={tw`flex-row items-center gap-x-2`}>
                {/* Points Badge */}
                <View
                  style={tw`bg-white/95 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm flex-row items-center`}
                >
                  <View style={tw`w-4.5 h-4.5 rounded-full bg-[#F5B800] items-center justify-center mr-1.5`}>
                    <Text style={tw`text-white text-[10px] font-black`}>₩</Text>
                  </View>
                  <Text style={tw`text-gray-800 text-xs font-bold`}>
                    {points.toLocaleString()}
                  </Text>
                </View>

                {/* "자러 가기" or "낮에 눈 떠보기" toggle button */}
                {isResting ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowNightCheckIn(true)}
                    style={tw`bg-white/95 px-4 py-2 rounded-full border border-gray-100 shadow-sm flex-row items-center`}
                  >
                    <Text style={tw`text-[${COLORS.primary}] text-xs font-bold`}>
                      🌙 자러 가기
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setHasCheckedInMorning(false)}
                    style={tw`bg-white/95 px-4 py-2 rounded-full border border-gray-100 shadow-sm flex-row items-center`}
                  >
                    <Text style={tw`text-[${COLORS.primary}] text-xs font-bold`}>
                      ✨ 낮에 눈 떠보기
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Collection Icon Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowCollection(true)}
                  style={tw`bg-white w-9 h-9 rounded-full items-center justify-center border border-gray-100 shadow-sm`}
                >
                  <CollectionSvg width={18} height={18} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Scroll Container */}
            <View style={[tw`flex-grow px-6`, { paddingBottom: Platform.OS === 'ios' ? 80 : 80 + insets.bottom }]}>
              <ScrollView
                contentContainerStyle={tw`flex-grow justify-between pt-4 pb-4`}
                showsVerticalScrollIndicator={false}
              >
                {!isResting ? (
                  <>
                    {/* Touch Indicator & Doody Character */}
                    <View style={tw`flex-grow justify-center items-center mt-8`}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={tw`items-center justify-center`}
                      >
                        {/* Touch!! label */}
                        <View style={tw`items-center mb-3`}>
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

                        {/* Doody Character */}
                        <View style={tw`w-80 h-64 items-center justify-center`}>
                          {isCompleted ? (
                            <Image source={HappyDoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                          ) : (
                            <Image source={DoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Mission Card - only show in default mode */}
                    {!isCompleted && (
                      <MissionCard
                        currentMission={currentMission}
                        onRest={toggleResting}
                        onStartMission={handleStartMission}
                      />
                    )}
                  </>
                ) : (
                  /* Night/Rest state - Sleeping Doody */
                  <View style={tw`flex-1 justify-center items-center my-12`}>
                    <View style={tw`w-80 h-80 items-center justify-center mt-8`}>
                      <Image source={NightDoodySvg} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                    </View>
                    <Text style={tw`text-white/80 text-base font-bold mt-4 text-center leading-6 px-6`}>
                      {missionData?.restMessage || `오늘은 아무 생각 없이 푹 쉬어보자.\n내일은 더 가벼운 발걸음일 거야.`}
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Mission Detail Modal */}
              <MissionDetailModal
                visible={homeViewState === 'detail'}
                currentMission={currentMission}
                onClose={() => setHomeViewState('main')}
                onComplete={handleCompleteMission}
                onChangeToSmaller={() => setHomeViewState('smaller')}
              />

              {/* Mission Swap Modal */}
              <MissionSwapModal
                visible={homeViewState === 'smaller'}
                selectedSmallerIdx={selectedSmallerIdx}
                setSelectedSmallerIdx={setSelectedSmallerIdx}
                onBack={() => setHomeViewState('detail')}
                onRest={handleRestForToday}
                onStartSmaller={handleStartSmallerMission}
                onClose={() => setHomeViewState('main')}
              />
            </View>

            <MorningSuccessModal
              visible={showMorningSuccess}
              onConfirm={() => setShowMorningSuccess(false)}
              description={morningGreeting}
              points={morningPoints}
            />
          </SafeAreaView>
        ) : activeTab === 'report' ? (
          /* ==================== REPORT TAB ==================== */
          <ReportContainer
            onBackToHome={() => setActiveTab('home')}
            initialView={initialReportView}
          />
        ) : activeTab === 'independence' ? (
          /* ==================== INDEPENDENCE TAB ==================== */
          <IndependenceScreen
            onBackToHome={() => setActiveTab('home')}
            onToggleNavBar={setIsNavBarVisible}
            onRestForToday={() => {
              setHomeMode('resting');
              setHomeViewState('main');
              setActiveTab('home');
            }}
            onGoToCollection={() => setShowCollection(true)}
          />
        ) : activeTab === 'connection' ? (
          /* ==================== CONNECTION TAB ==================== */
          <ConnectionScreen
            onBackToHome={() => setActiveTab('home')}
            onToggleNavBar={setIsNavBarVisible}
            onGoToCollection={goToReportCollection}
          />
        ) : (
          /* ==================== OTHER TABS (Placeholder) ==================== */
          <SafeAreaView style={tw`flex-1`}>
            <View style={[tw`flex-1 justify-center items-center px-6`, { paddingBottom: Platform.OS === 'ios' ? 80 : 80 + insets.bottom }]}>
              <Text style={tw`text-[${COLORS.primary}] text-2xl font-bold mb-2`}>
                준비 중
              </Text>
              <Text style={tw`text-gray-400 text-sm text-center`}>
                준비 중인 화면이에요.{'\n'}곧 만나볼 수 있어요!
              </Text>
            </View>
          </SafeAreaView>
        )}

        {/* Bottom Navigation Bar */}
        {isNavBarVisible && <NavBar activeTab={activeTab} onTabChange={handleTabChange} />}
      </View>
    </Background>
  );
}