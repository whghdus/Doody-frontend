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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc';
import Background from '../../components/common/Background';
import { COLORS } from '../../constants/theme';
import { useOnboardingStore } from '../../store/useOnboardingStore';

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
  const [currentMission, setCurrentMission] = useState<string>('자립 한칸 가볼래? (자연어 설명)');
  const [homeViewState, setHomeViewState] = useState<'main' | 'detail' | 'smaller' | 'verify' | 'success_speak' | 'success_modal' | 'next_stage'>('main');
  const [selectedSmallerIdx, setSelectedSmallerIdx] = useState<number>(0);
  const [isNavBarVisible, setIsNavBarVisible] = useState<boolean>(true);
  const [initialReportView, setInitialReportView] = useState<'main' | 'collection' | 'detail'>('main');
  const [nextStageType, setNextStageType] = useState<StageType>('connection');
  const [missionCount, setMissionCount] = useState<number>(0);
  const [points, setPoints] = useState<number>(1220);

  // Morning Check-In States
  const [hasCheckedInMorning, setHasCheckedInMorning] = useState<boolean>(true);
  const [showMorningSuccess, setShowMorningSuccess] = useState<boolean>(false);
  
  // Night Check-In State (Demo)
  const [showNightCheckIn, setShowNightCheckIn] = useState<boolean>(false);

  // Always show NavBar when switching tabs
  useEffect(() => {
    setIsNavBarVisible(true);
  }, [activeTab]);

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
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastMorningCheckIn', today);
    } catch (error) {}
    setHasCheckedInMorning(true);
    setShowMorningSuccess(true);
  };

  const handleCloseMorning = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('lastMorningCheckIn', today);
    } catch (error) {}
    setHasCheckedInMorning(true);
  };

  const isResting = homeMode === 'resting';
  const isCompleted = homeMode === 'completed';

  const handleStartMission = useCallback(() => {
    // Navigate to appropriate tab based on mission context
    if (currentMission.includes('자립')) {
      setActiveTab('independence');
    } else {
      setActiveTab('connection');
    }
  }, [currentMission]);

  const handleCompleteMission = useCallback(() => {
    setHomeViewState('verify');
  }, []);

  const handleRestForToday = useCallback(() => {
    setHomeMode('resting');
    setHomeViewState('main');
  }, []);

  const handleStartSmallerMission = useCallback(() => {
    setCurrentMission(SMALLER_MISSIONS[selectedSmallerIdx].title);
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsNavBarVisible(true);
    if (tab === 'report') {
      setInitialReportView('main');
    }
  };

  const goToReportCollection = () => {
    setInitialReportView('collection');
    setActiveTab('report');
  };

  // Sub-screens (verify, success, next_stage)
  if (homeViewState === 'verify') {
    return (
      <MissionVerifyScreen
        onCancel={() => setHomeViewState('main')}
        onVerifyComplete={() => {
          setHomeMode('completed');
          setPoints((prev) => prev + 50);
          setMissionCount((prev) => prev + 1);
          setHomeViewState('success_speak');
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
                onPress={onRestartOnboarding}
                style={tw`w-[90px] h-[40px] items-center justify-center`}
              >
                <Image
                  source={isResting ? DoodyLogoWhite : DoodyLogo}
                  style={tw`w-full h-full`}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Right side: Points badge (completed) + Toggle button */}
              <View style={tw`flex-row items-center gap-x-2`}>
                {/* Points Badge - only show when completed */}
                {isCompleted && (
                  <View
                    style={tw`bg-white/90 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm flex-row items-center`}
                  >
                    <View style={tw`w-4 h-4 rounded-full bg-[${COLORS.gold}] items-center justify-center mr-1.5`}>
                      <Text style={tw`text-white text-[9px] font-black`}>W</Text>
                    </View>
                    <Text style={tw`text-gray-800 text-xs font-bold`}>
                      {points.toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* "낮에 눈 떠보기" toggle button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setHasCheckedInMorning(false)}
                  style={tw`bg-white/95 px-4 py-2 rounded-full border border-gray-100 shadow-sm flex-row items-center`}
                >
                  <Text style={tw`text-[${COLORS.primary}] text-xs font-bold`}>
                    ✨ 낮에 눈 떠보기
                  </Text>
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
                    <Text style={tw`text-white/80 text-base font-bold mt-4 text-center leading-6`}>
                      오늘은 아무 생각 없이 푹 쉬어보자.{'\n'}내일은 더 가벼운 발걸음일 거야.
                    </Text>

                    <View style={tw`flex-row gap-x-3 mt-8`}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowNightCheckIn(true)}
                        style={tw`bg-white/20 px-6 py-3 rounded-full border border-white/30`}
                      >
                        <Text style={tw`text-white font-bold`}>저녁 회고</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setHomeMode('default')}
                        style={tw`bg-[#008C75] px-6 py-3 rounded-full shadow-md`}
                      >
                        <Text style={tw`text-white text-base font-bold`}>
                          미션하러가기
                        </Text>
                      </TouchableOpacity>
                    </View>
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
