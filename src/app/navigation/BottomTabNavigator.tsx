import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import tw from '@/shared/lib/tailwind';

// SVG Icons from shared assets
import HomeIcon from '@/shared/assets/navbar/home.svg';
import FolderIcon from '@/shared/assets/navbar/folder.svg';
import LocationIcon from '@/shared/assets/navbar/location.svg';
import ReportIcon from '@/shared/assets/navbar/report.svg';

// Import Screens (Temporarily using screens/, will move to pages/ later)
import HomeScreen from '@/pages/home/HomeScreen';
import IndependenceScreen from '@/pages/independence/IndependenceScreen';
import ConnectionScreen from '@/pages/connection/ConnectionScreen';
import ReportContainer from '@/pages/report/ReportContainer';

const Tab = createBottomTabNavigator();
export const NAV_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 72;

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: tw`absolute bottom-0 w-full bg-white/90 border-t border-gray-100 flex-row px-2 items-center justify-between pb-6 pt-2 h-[${NAV_BAR_HEIGHT}px]`,
        tabBarActiveTintColor: '#008C75',
        tabBarInactiveTintColor: '#D1D5DB',
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <HomeIcon width={24} height={24} color={focused ? '#008C75' : '#D1D5DB'} />;
          } else if (route.name === 'Independence') {
            return <FolderIcon width={24} height={24} color={focused ? '#008C75' : '#D1D5DB'} />;
          } else if (route.name === 'Connection') {
            return <LocationIcon width={24} height={24} color={focused ? '#008C75' : '#D1D5DB'} />;
          } else if (route.name === 'Report') {
            return <ReportIcon width={24} height={24} color={focused ? '#008C75' : '#D1D5DB'} />;
          }
        },
        tabBarLabelStyle: tw`text-[10px] font-bold mt-1`,
        tabBarItemStyle: tw`items-center justify-center h-12`,
      })}
    >
      <Tab.Screen 
        name="Home" 
        children={(props) => <HomeScreen {...props} onRestartOnboarding={() => {}} />} 
        options={{ tabBarLabel: '홈' }} 
      />
      <Tab.Screen 
        name="Independence" 
        children={(props) => <IndependenceScreen {...props} onBackToHome={() => props.navigation.navigate('Home')} onToggleNavBar={() => {}} onRestForToday={() => {}} onGoToCollection={() => props.navigation.navigate('Report')} />} 
        options={{ tabBarLabel: '자립ON' }} 
      />
      <Tab.Screen 
        name="Connection" 
        children={(props) => <ConnectionScreen {...props} onBackToHome={() => props.navigation.navigate('Home')} onToggleNavBar={() => {}} onGoToCollection={() => props.navigation.navigate('Report')} />} 
        options={{ tabBarLabel: '연결ON' }} 
      />
      <Tab.Screen 
        name="Report" 
        children={(props) => <ReportContainer {...props} onBackToHome={() => props.navigation.navigate('Home')} initialView="main" />} 
        options={{ tabBarLabel: '리포트' }} 
      />
    </Tab.Navigator>
  );
}
