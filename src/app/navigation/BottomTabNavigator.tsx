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
import ReportScreen from '@/pages/report/ReportScreen';
import DoodyCollectionScreen from '@/pages/report/DoodyCollectionScreen';
import DoodyDetailScreen from '@/pages/report/DoodyDetailScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <HomeStack.Screen name="HomeMain">
        {(props) => <HomeScreen {...props} onRestartOnboarding={() => { }} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="Collection">
        {(props) => (
          <DoodyCollectionScreen 
            onBack={() => props.navigation.goBack()}
            onDoodyClick={(id) => props.navigation.navigate('DoodyDetail', { doodyId: id })}
          />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="DoodyDetail">
        {(props) => (
          <DoodyDetailScreen
            doodyId={props.route.params.doodyId}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const NAV_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 72; // Fallback constant

export default function BottomTabNavigator() {
  const [isNavBarVisible, setIsNavBarVisible] = React.useState(true);
  const insets = useSafeAreaInsets();

  // Base height of 70 + bottom inset (minimum 12px for devices without bottom inset)
  const dynamicNavBarHeight = 75 + Math.max(insets.bottom, 12);
  // Calculate dynamic padding bottom
  const dynamicPaddingBottom = Math.max(insets.bottom, 12) + 10;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: isNavBarVisible
          ? [tw`absolute bottom-0 w-full bg-white/90 border-t border-gray-100`, { height: 80 + Math.max(insets.bottom, 10), paddingBottom: Math.max(insets.bottom, 10) }]
          : { display: 'none' },
        tabBarActiveTintColor: '#008C75',
        tabBarInactiveTintColor: '#D1D5DB',
        tabBarIcon: ({ focused }) => {
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
        tabBarLabelStyle: tw`text-[10px] font-bold mb-2`,
        tabBarItemStyle: tw`pt-3`,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen
        name="Independence"
        children={(props) => <IndependenceScreen {...props} onBackToHome={() => props.navigation.navigate('Home')} onToggleNavBar={setIsNavBarVisible} onRestForToday={() => { }} onGoToCollection={() => props.navigation.navigate('Home', { screen: 'Collection' })} />}
        options={{ tabBarLabel: '자립ON' }}
      />
      <Tab.Screen
        name="Connection"
        children={(props) => <ConnectionScreen {...props} onBackToHome={() => props.navigation.navigate('Home')} onToggleNavBar={setIsNavBarVisible} onGoToCollection={() => props.navigation.navigate('Home', { screen: 'Collection' })} />}
        options={{ tabBarLabel: '연결ON' }}
      />
      <Tab.Screen
        name="Report"
        children={(props) => <ReportScreen {...props} onBack={() => props.navigation.navigate('Home')} onDoodyClick={() => {}} />}
        options={{ tabBarLabel: '리포트' }}
      />
    </Tab.Navigator>
  );
}
