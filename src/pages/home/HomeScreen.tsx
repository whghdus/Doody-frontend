import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from '@/shared/lib/tailwind';
import { COLORS } from '@/shared/config/theme';

import Background from '@/shared/ui/Background';
import DoodyLogo from '@/shared/assets/logos/doodyLogo.png';
import DoodyLogoWhite from '@/shared/assets/logos/doodyLogoWhite.png';
import DoodySvg from '@/shared/assets/doody/Doody.webp';
import NightDoodySvg from '@/shared/assets/doody/nightDoody.webp';
import HappyDoodySvg from '@/shared/assets/doody/happyDoody.webp';
import PointSvg from '@/shared/assets/icons/point.svg';
import VectorSvg from '@/shared/assets/icons/vector.svg';

import { userApi } from '@/shared/api/user';
import { missionApi, Mission } from '@/shared/api/mission';
import { useOnboardingStore } from '@/entities/useOnboardingStore';
import { useCollectionStore } from '@/entities/useCollectionStore';

// Widgets
import HomeCheckInWidget from '@/widgets/home/ui/HomeCheckInWidget';
import HomeQuizWidget from '@/widgets/home/ui/HomeQuizWidget';
import ActiveMissionWidget from '@/widgets/mission/ui/ActiveMissionWidget';

interface HomeScreenProps {
  onRestartOnboarding: () => void;
  navigation?: any;
}

export default function HomeScreen({ onRestartOnboarding, navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  
  const [homeMode, setHomeMode] = useState<'default' | 'completed' | 'resting'>('default');
  const [points, setPoints] = useState<number>(0);
  const [missionCount, setMissionCount] = useState<number>(0);
  
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
      const today = new Date().toISOString().split('T')[0];
      const localCompletedDate = await AsyncStorage.getItem('daily_mission_completed_date');

      if (stateStr === 'completed' || stateStr === 'done' || localCompletedDate === today) {
        setHomeMode('completed');
      } else if (stateStr === 'gated') {
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
  }, [fetchHomeData]);

  const isResting = homeMode === 'resting';

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

            {/* Right side: Points & Profile */}
            <View style={tw`flex-row items-center gap-x-2`}>
              <View style={tw`bg-white/95 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm flex-row items-center`}>
                <PointSvg width={16} height={16} />
                <Text style={tw`text-[#008C75] font-bold text-sm ml-1.5`}>{points.toLocaleString()}</Text>
              </View>
              <View style={tw`bg-white/95 w-[34px] h-[34px] rounded-full border border-gray-100 shadow-sm items-center justify-center`}>
                <VectorSvg width={16} height={16} color="#008C75" />
              </View>
            </View>
          </View>

          {/* Doody Character Area */}
          <View style={tw`flex-1 items-center justify-center relative`}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={toggleResting} 
              style={tw`items-center justify-center`}
            >
              <Image 
                source={isResting ? NightDoodySvg : (homeMode === 'completed' ? HappyDoodySvg : DoodySvg)} 
                style={tw`w-64 h-64`}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Widgets */}
          <HomeCheckInWidget 
            homeMode={homeMode}
            onPointsEarned={fetchHomeData}
          />
          
          <HomeQuizWidget 
            onQuizCompleteAction={fetchHomeData}
          />

          <View style={[tw`absolute bottom-0 w-full px-5`, { paddingBottom: Platform.OS === 'ios' ? 110 : 100 }]}>
            <ActiveMissionWidget 
              currentMission={currentMission}
              missionData={missionData}
              homeMode={homeMode}
              points={points}
              missionCount={missionCount}
              onPointsEarned={(newPoints, currentStep) => {
                setPoints(newPoints);
                setMissionCount(currentStep);
                setHomeMode('completed');
              }}
              onNavigateTab={(tab) => {
                if (tab === 'report_collection' && navigation) {
                  // Need specific navigation logic for collection
                  navigation.navigate('Report', { screen: 'Collection' });
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
      </View>
    </Background>
  );
}