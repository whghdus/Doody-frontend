import React, { useRef, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, Text, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import tw from '@/shared/lib/tailwind';
import { AutonomyNode } from '@/shared/api/autonomy';

import CheckSvg from '@/shared/assets/icons/check.svg';
import CurrentLocationSvg from '@/shared/assets/icons/currentLocation.svg';
import LockSvg from '@/shared/assets/icons/lock.svg';

const { width, height } = Dimensions.get('window');
const NODE_SPACING = 130;

export interface RoadmapNode {
  id: number;
  step: number;
  missionId: string;
  status: string;
  title: string;
  top: number;
  left: number;
  originalIndex: number;
}

interface IndependenceMapWidgetProps {
  nodesToUse: AutonomyNode[];
  activeIndex: number;
  onOpenMission: () => void;
}

export default function IndependenceMapWidget({
  nodesToUse,
  activeIndex,
  onOpenMission,
}: IndependenceMapWidgetProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const totalNodes = nodesToUse.length;

  const ROADMAP_NODES: RoadmapNode[] = nodesToUse.map((node, i) => {
    let leftRatio = 0.5;
    if (i % 4 === 0) leftRatio = 0.35;
    else if (i % 4 === 1) leftRatio = 0.65;
    else if (i % 4 === 2) leftRatio = 0.8;
    else if (i % 4 === 3) leftRatio = 0.5;

    return {
      id: node.step - 1,
      step: node.step,
      missionId: node.missionId,
      status: node.status,
      title: node.title,
      top: (totalNodes - 1 - i) * NODE_SPACING + 150,
      left: width * leftRatio,
      originalIndex: i,
    };
  });

  const contentHeight = (totalNodes - 1) * NODE_SPACING + 300;
  const scrollToIndex = activeIndex >= 0 ? activeIndex : totalNodes - 1;

  useEffect(() => {
    if (scrollViewRef.current) {
      const currentTop = (totalNodes - 1 - scrollToIndex) * NODE_SPACING + 150;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: currentTop - height / 2 + 100, animated: false });
      }, 100);
    }
  }, [scrollToIndex, totalNodes, height]);

  return (
    <View style={tw`flex-1 relative`}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: contentHeight }}
      >
        <View style={[tw`absolute w-full items-center z-20`, { top: 100 }]}>
          <Text style={tw`text-[#008C75] font-bold text-sm bg-white/90 px-4 py-1.5 rounded-full shadow-sm`}>
            🗺️ 그 너머는 두디도 아직 안 보여줘
          </Text>
        </View>

        <View style={[tw`absolute inset-0`, { zIndex: 0 }]}>
          <Svg width={width} height={contentHeight}>
            <Path
              d={`
                M ${ROADMAP_NODES[ROADMAP_NODES.length - 1].left} ${ROADMAP_NODES[ROADMAP_NODES.length - 1].top + 37}
                ${[...ROADMAP_NODES].reverse().slice(1).map(n => `L ${n.left} ${n.top + 37}`).join(' ')}
                L ${ROADMAP_NODES[0].left + 40} ${ROADMAP_NODES[0].top + 120}
              `}
              stroke="#008C75"
              strokeWidth="6"
              strokeDasharray="15, 15"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {ROADMAP_NODES.map((node) => {
          let iconWidth = 20;
          let iconHeight = 20;
          let iconMarginBottom = 8;

          const isCurrent = node.status === 'CURRENT' || node.status === 'IN_PROGRESS' ||
                            (node.status === 'LOCKED' && node.originalIndex === activeIndex);

          const platformBg = isCurrent ? '#009278' : '#E6F5F2';
          const platformShadow = isCurrent ? '#017661' : '#DCEAE7';

          let InnerIcon = null;
          if (node.status === 'COMPLETED') {
            InnerIcon = <CheckSvg width="100%" height="100%" />;
          } else if (isCurrent) {
            InnerIcon = <CurrentLocationSvg width="100%" height="100%" />;
            iconWidth = 50;
            iconHeight = 50;
            iconMarginBottom = 50;
          } else {
            InnerIcon = <LockSvg width="100%" height="100%" />;
            iconMarginBottom = 18;
          }

          return (
            <TouchableOpacity
              key={node.id}
              activeOpacity={isCurrent ? 0.8 : 1}
              onPress={isCurrent ? onOpenMission : undefined}
              style={[
                tw`absolute items-center justify-center`,
                {
                  top: node.top,
                  left: node.left - (78 / 2),
                  zIndex: isCurrent ? 2 : 1,
                  width: 78,
                  height: 74,
                },
              ]}
            >
              <View style={{
                position: 'absolute',
                bottom: 0, left: 4, right: 4, height: 60,
                borderRadius: 30, backgroundColor: platformShadow, top: 6,
              }} />
              <View style={{
                position: 'absolute',
                top: 0, left: 4, right: 4, height: 60,
                borderRadius: 30, backgroundColor: platformBg,
              }} />
              <View style={{ width: iconWidth, height: iconHeight, marginBottom: iconMarginBottom, zIndex: 2 }}>
                {InnerIcon}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
