import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from '@/shared/lib/tailwind';
import { COLORS } from '@/shared/config/theme';

import Background from '@/shared/ui/Background';
import DoodyLogo from '@/shared/assets/logos/doodyLogo.png';
import DoodyLogoWhite from '@/shared/assets/logos/doodyLogoWhite.png';
import PointSvg from '@/shared/assets/icons/point.svg';
import VectorSvg from '@/shared/assets/icons/vector.svg';
import CollectionSvg from '@/shared/assets/icons/collection.svg';

import { userApi } from '@/shared/api/user';
import { missionApi, Mission } from '@/shared/api/mission';
import HomeCheckInWidget from '@/widgets/home/ui/HomeCheckInWidget';
import HomeQuizWidget from '@/widgets/home/ui/HomeQuizWidget';
import ActiveMissionWidget from '@/widgets/mission/ui/ActiveMissionWidget';
import NightCheckInScreen from '@/pages/home/NightCheckInScreen';

interface HomeScreenProps {
  onRestartOnboarding: () => void;
  navigation?: any;
}

export default function HomeScreen({ onRestartOnboarding, navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  const [homeMode, setHomeMode] = useState<'default' | 'completed' | 'resting' | 'connection_priority'>('default');
  const [points, setPoints] = useState<number>(0);
  const [missionCount, setMissionCount] = useState<number>(0);
  const [showManualNightCheckIn, setShowManualNightCheckIn] = useState<boolean>(false);

  const [currentMission, setCurrentMission] = useState<string>('미션을 불러오는 중...');
  const [missionData, setMissionData] = useState<Mission | null>(null);

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

      const stateStr = todayMission.missionState?.toLowerCase();
      
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const today = new Date(now.getTime() - offset).toISOString().split('T')[0];
      const localCompleted = await AsyncStorage.getItem('daily_mission_completed_date');
      
      if (localCompleted === today || stateStr === 'completed' || stateStr === 'done') {
        setHomeMode('completed');
      } else if (stateStr === 'gated' || stateStr === 'escape_hatch') {
        setHomeMode('resting');
      } else if (stateStr === 'connection_priority') {
        setHomeMode('connection_priority');
      } else {
        setHomeMode('default');
      }
    } catch (error) {
      console.error('Failed to fetch today mission', error);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const isResting = homeMode === 'resting';
  const isConnectionPriority = homeMode === 'connection_priority';

  const toggleResting = useCallback(() => {
    setHomeMode(prev => prev === 'resting' ? 'default' : 'resting');
  }, []);

  return (
    <Background theme={isResting ? 'night' : 'day'}>
      <View style={tw`flex-1 relative`}>
        <SafeAreaView style={tw`flex-1`}>
          {/* Top Header */}
          <View style={tw`flex-row justify-between items-center px-6 pt-4 z-10`}>
            {/* Logo */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (isResting) setHomeMode('default');
                else onRestartOnboarding();
              }}
              style={tw`w-[90px] h-[40px] items-center justify-center`}
            >
              <Image
                source={isResting ? DoodyLogoWhite : DoodyLogo}
                style={tw`w-full h-full`}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Right side: Points, Toggle Badge, Collection Icon */}
            <View style={tw`flex-row items-center gap-x-2`}>
              {/* Points Badge */}
              <View style={tw`bg-white/95 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm flex-row items-center`}>
                <PointSvg width={18} height={18} style={tw`mr-1.5`} />
                <Text style={tw`text-gray-800 text-xs font-bold`}>{points.toLocaleString()}</Text>
              </View>

              {/* Status Badge */}
              {isResting ? (
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => setShowManualNightCheckIn(true)}
                  style={tw`bg-white/95 px-4 py-2 rounded-full border border-gray-100 shadow-sm flex-row items-center`}
                >
                  <Text style={tw`text-[${COLORS.primary}] text-xs font-bold`}>쉬어가기</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => setHomeMode('resting')}
                  style={tw`bg-white/95 px-4 py-2 rounded-full border border-gray-100 shadow-sm flex-row items-center`}
                >
                  <Text style={tw`text-[${COLORS.primary}] text-xs font-bold`}>낮에 눈 떠보기</Text>
                </TouchableOpacity>
              )}

              {/* Collection Icon Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (navigation) navigation.navigate('Collection');
                }}
                style={tw`bg-white w-9 h-9 rounded-full items-center justify-center border border-gray-100 shadow-sm`}
              >
                <CollectionSvg width={18} height={18} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Widgets */}
          <HomeCheckInWidget
            homeMode={isConnectionPriority ? 'default' : homeMode}
            vRhythm={missionData?.vRhythm}
            onPointsEarned={fetchHomeData}
          />

          <View style={[tw`flex-1`, { paddingBottom: Platform.OS === 'ios' ? 240 : 220 }]}>
            <HomeQuizWidget
              isResting={isResting}
              homeMode={isConnectionPriority ? 'default' : homeMode}
              onQuizCompleteAction={fetchHomeData}
            />
          </View>

          <View style={[tw`absolute bottom-0 w-full px-5`, { paddingBottom: Platform.OS === 'ios' ? 140 : 130 }]}>
            <ActiveMissionWidget
              currentMission={currentMission}
              missionData={missionData}
              homeMode={homeMode}
              points={points}
              missionCount={missionCount}
              onPointsEarned={() => {
                fetchHomeData();
              }}
              onNavigateTab={(tab) => {
                if (tab === 'report_collection' && navigation) {
                  navigation.navigate('Collection');
                } else if (navigation) {
                  navigation.navigate(tab.charAt(0).toUpperCase() + tab.slice(1));
                }
              }}
              onRestToday={() => {
                setHomeMode('resting');
              }}
              onMissionTitleChange={(title) => setCurrentMission(title)}
              onRefreshData={fetchHomeData}
            />
          </View>
        </SafeAreaView>

        <Modal
          visible={showManualNightCheckIn}
          animationType="fade"
          transparent={false}
          onRequestClose={() => setShowManualNightCheckIn(false)}
        >
          <NightCheckInScreen onClose={() => setShowManualNightCheckIn(false)} />
        </Modal>
      </View>
    </Background>
  );
}