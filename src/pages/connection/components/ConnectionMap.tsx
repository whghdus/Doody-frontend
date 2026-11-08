import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, Platform, Image as RNImage } from 'react-native';
import tw from '@/shared/lib/tailwind';
import { Image } from 'expo-image';
import MapView, { UrlTile, Marker, Region } from 'react-native-maps';
import CheongnaMapImg from '@/shared/assets/cheongna_map.png';

import DoodySvg from '@/shared/assets/doody/Doody.webp';
import BrushDoodySvg from '@/shared/assets/doody/brushDoody.webp';
import HappyDoodySvg from '@/shared/assets/doody/happyDoody.webp';
import SadDoodySvg from '@/shared/assets/doody/sadDoody.webp';
import SmileDoodySvg from '@/shared/assets/doody/smileDoody.webp';
import ExplorationDoodySvg from '@/shared/assets/doody/explorationDoody.webp';
import SalaryDoodySvg from '@/shared/assets/doody/salaryDoodt.webp';
import GreenDoodySvg from '@/shared/assets/doody/greenDoody.webp';

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg, ExplorationDoodySvg, SalaryDoodySvg, GreenDoodySvg];

interface ConnectionMapProps {
  region: Region | null;
  institutions: any[];
  onCatchDoody: (id: string, index: number) => void;
  onRegionChangeComplete: (region: Region) => void;
}

export default function ConnectionMap({
  region,
  institutions,
  onCatchDoody,
  onRegionChangeComplete,
}: ConnectionMapProps) {
  const mapRef = useRef<MapView>(null);

  if (Platform.OS === 'web') {
    return (
      <>
        <Image source={CheongnaMapImg} style={tw`absolute w-full h-full`} contentFit="cover" />

        {institutions.map((inst, index) => {
          const SvgComponent = DOODY_SVGS[inst.doodyIndex];
          const isFar = inst.captureAvailable !== undefined ? !inst.captureAvailable : true;
          
          const topPos = 20 + ((index * 37) % 60);
          const leftPos = 10 + ((index * 53) % 80);

          return (
            <TouchableOpacity
              key={inst.id}
              style={[tw`absolute items-center z-20`, { top: `${topPos}%`, left: `${leftPos}%`, opacity: isFar ? 0.4 : 1 }]}
              onPress={isFar ? undefined : () => onCatchDoody(inst.id, inst.doodyIndex)}
            >
              <View style={tw`bg-[#222] px-3 py-1 rounded-full mb-1 shadow-sm`}>
                <Text style={tw`text-white font-bold text-[10px]`}>{inst.tags?.name || '하나은행'}</Text>
              </View>
              <View style={tw`items-center`}>
                <View style={tw`w-14 h-14 bg-[#E1EDE4] rounded-full border-4 border-[#008C75] items-center justify-center shadow-md z-10`}>
                  <View style={tw`w-9 h-9`}>
                    <Image source={SvgComponent} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                  </View>
                </View>
                <View style={[tw`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#008C75]`, { marginTop: -2 }]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    );
  }

  if (!region) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-[#008C75] font-bold`}>지도를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={tw`absolute inset-0`}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={false}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      <UrlTile
        urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        flipY={false}
      />

      {institutions.map((inst) => {
        const isFar = inst.captureAvailable !== undefined ? !inst.captureAvailable : true;

        return (
          <Marker
            key={inst.id}
            coordinate={{ latitude: inst.lat, longitude: inst.lon }}
            onPress={isFar ? undefined : () => onCatchDoody(inst.id, inst.doodyIndex)}
            opacity={isFar ? 0.4 : 1}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={tw`items-center`}>
              {/* Tooltip / Label */}
              <View style={tw`bg-[#222] px-3 py-1 rounded-full mb-1 shadow-sm`}>
                <Text style={tw`text-white font-bold text-[10px]`}>{inst.tags?.name || '하나은행'}</Text>
              </View>
              {/* Marker Icon */}
              <View style={tw`w-14 h-14 bg-[#E1EDE4] rounded-full border-4 border-[#008C75] items-center justify-center shadow-md z-10`}>
                <View style={tw`w-9 h-9`}>
                  <RNImage source={DOODY_SVGS[inst.doodyIndex]} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              </View>
              {/* Marker Triangle Pointer */}
              <View style={[tw`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#008C75]`, { marginTop: -2 }]} />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
