// src/components/common/NavBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '@/shared/lib/tailwind';

// Navbar SVG icons
import HomeIcon from '@/shared/assets/navbar/home.svg';
import FolderIcon from '@/shared/assets/navbar/folder.svg';
import LocationIcon from '@/shared/assets/navbar/location.svg';
import ReportIcon from '@/shared/assets/navbar/report.svg';

export type TabType = 'home' | 'independence' | 'connection' | 'report';

interface NavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NAV_BAR_HEIGHT = Platform.OS === 'web' ? 60 : 64;

export default function NavBar({ activeTab, onTabChange }: NavBarProps) {
  const insets = useSafeAreaInsets();
  // On web, insets.bottom is 0 — use a sensible default safe area for iPhone notch/home-indicator
  const safeBottom = Platform.OS === 'web' ? 0 : insets.bottom;

  const tabs = [
    { id: 'home' as TabType, label: '홈', icon: HomeIcon },
    { id: 'independence' as TabType, label: '자립ON', icon: FolderIcon },
    { id: 'connection' as TabType, label: '연결ON', icon: LocationIcon },
    { id: 'report' as TabType, label: '리포트', icon: ReportIcon },
  ];

  return (
    <View 
      style={[
        tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex-row justify-around z-50`,
        {
          paddingTop: Platform.OS === 'web' ? 8 : 8,
          paddingBottom: Platform.OS === 'ios' ? Math.max(safeBottom, 20) : Platform.OS === 'web' ? 8 : safeBottom + 12,
          height: Platform.OS === 'web' ? 60 : undefined,
        }
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.8}
            onPress={() => onTabChange(tab.id)}
            style={tw`items-center justify-center flex-1 py-1`}
          >
            <View 
              style={tw`items-center justify-center py-1.5 px-3 rounded-2xl ${
                isActive ? 'bg-[#E6F4F1]' : 'bg-transparent'
              }`}
            >
              <View style={tw`w-5 h-5`}>
                <IconComponent 
                  width="100%" 
                  height="100%" 
                  fill={isActive ? '#008C75' : '#9CA3AF'} 
                />
              </View>
              <Text 
                numberOfLines={1}
                style={tw`text-[10px] font-bold mt-1 ${
                  isActive ? 'text-[#008C75]' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
