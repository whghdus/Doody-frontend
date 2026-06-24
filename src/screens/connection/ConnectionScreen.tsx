import { Image } from 'expo-image';
// src/screens/connection/ConnectionScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import tw from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { UrlTile, Marker, Region } from 'react-native-maps';

import CatchScreen from './CatchScreen';
import DoodySvg from '../../assets/doody/Doody.webp';
import BrushDoodySvg from '../../assets/doody/brushDoody.webp';
import HappyDoodySvg from '../../assets/doody/happyDoody.webp';
import SadDoodySvg from '../../assets/doody/sadDoody.webp';
import SmileDoodySvg from '../../assets/doody/smileDoody.webp';
import ConnectionSuccessScreen from './ConnectionSuccessScreen';
import NextStageScreen from '../mission/NextStageScreen';

const { width, height } = Dimensions.get('window');

const DOODY_SVGS = [DoodySvg, BrushDoodySvg, HappyDoodySvg, SadDoodySvg, SmileDoodySvg];

interface ConnectionScreenProps {
  onBackToHome?: () => void;
  onToggleNavBar?: (visible: boolean) => void;
  onGoToCollection?: () => void;
}

export default function ConnectionScreen({ onBackToHome, onToggleNavBar, onGoToCollection }: ConnectionScreenProps) {
  const insets = useSafeAreaInsets();
  const [viewState, setViewState] = useState<'map' | 'catch' | 'success' | 'unlock'>('map');
  const [selectedDoodyIndex, setSelectedDoodyIndex] = useState<number>(0);
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    if (viewState === 'catch' || viewState === 'success' || viewState === 'unlock') {
      onToggleNavBar?.(false);
    } else {
      onToggleNavBar?.(true);
    }
  }, [viewState, onToggleNavBar]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한 필요', '지도 기능을 사용하려면 위치 권한이 필요합니다.');
        const fallbackLat = 37.5665;
        const fallbackLon = 126.9780;
        setRegion({
          latitude: fallbackLat,
          longitude: fallbackLon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        fetchInstitutions(fallbackLat, fallbackLon);
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        fetchInstitutions(loc.coords.latitude, loc.coords.longitude);
      } catch (error) {
        console.error("Location error:", error);
        const fallbackLat = 37.5665;
        const fallbackLon = 126.9780;
        setRegion({
          latitude: fallbackLat,
          longitude: fallbackLon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        fetchInstitutions(fallbackLat, fallbackLon);
      }
    })();
  }, []);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchInstitutions = async (lat: number, lon: number) => {
    try {
      const query = `[out:json];(node["amenity"="townhall"](around:5000,${lat},${lon});node["amenity"="public_building"](around:5000,${lat},${lon});node["amenity"="library"](around:5000,${lat},${lon}););out body;`;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Overpass API Error: ${response.status}`);
      }
      const data = await response.json();
      
      let elements = data.elements || [];
      if (elements.length === 0) {
        elements = [
          { id: 1, lat: lat + 0.005, lon: lon + 0.005, tags: { name: '가상 주민센터' } },
          { id: 2, lat: lat - 0.003, lon: lon + 0.006, tags: { name: '가상 구청' } },
          { id: 3, lat: lat + 0.002, lon: lon - 0.004, tags: { name: '가상 도서관' } },
        ];
      }

      const mapped = elements.map((el: any) => ({
        ...el,
        doodyIndex: Math.floor(Math.random() * DOODY_SVGS.length)
      }));
      setInstitutions(mapped);

    } catch (e) {
      console.error('Overpass API error:', e);
      setInstitutions([
        { id: 1, lat: lat + 0.005, lon: lon + 0.005, tags: { name: '가상 주민센터' }, doodyIndex: 0 },
        { id: 2, lat: lat - 0.003, lon: lon + 0.006, tags: { name: '가상 구청' }, doodyIndex: 1 },
        { id: 3, lat: lat + 0.002, lon: lon - 0.004, tags: { name: '가상 도서관' }, doodyIndex: 2 },
      ]);
    }
  };

  const handleCatchDoody = (doodyIndex: number) => {
    setSelectedDoodyIndex(doodyIndex);
    setViewState('catch');
  };

  const handleCatchSuccess = () => {
    setViewState('success');
  };

  const handleGoHome = () => {
    if (onBackToHome) {
      onBackToHome();
    }
  };

  const handleGoBackToMap = () => {
    setViewState('map');
  };

  const handleGoToPokedex = () => {
    onGoToCollection?.();
    setViewState('map');
  };

  if (viewState === 'catch') {
    return <CatchScreen onSuccess={handleCatchSuccess} onGoToMap={handleGoBackToMap} onGoHome={handleGoHome} doodyIndex={selectedDoodyIndex} />;
  }

  if (viewState === 'success') {
    return (
      <ConnectionSuccessScreen 
        onGoHome={() => setViewState('unlock')} 
        onGoToPokedex={handleGoToPokedex}
        doodyIndex={selectedDoodyIndex}
      />
    );
  }

  if (viewState === 'unlock') {
    return (
      <NextStageScreen
        stageType="connection"
        onClose={() => setViewState('map')}
        onGoToStage={() => {
          setViewState('map');
        }}
      />
    );
  }

  // MAP VIEW
  return (
    <View style={[tw`flex-1 bg-[#E1EDE4]`]}>
      {/* Map Layer */}
      {region ? (
        <MapView
          style={tw`flex-1 absolute inset-0`}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        >
          <UrlTile
            urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />

          {institutions.map((inst) => {
            const SvgComponent = DOODY_SVGS[inst.doodyIndex];
            const dist = location ? getDistance(location.coords.latitude, location.coords.longitude, inst.lat, inst.lon) : 0;
            const isFar = dist > 1000;

            return (
              <Marker
                key={inst.id}
                coordinate={{ latitude: inst.lat, longitude: inst.lon }}
                onPress={isFar ? undefined : () => handleCatchDoody(inst.doodyIndex)}
                opacity={isFar ? 0.4 : 1}
              >
                <View style={tw`items-center`}>
                  <View style={tw`bg-[#222] px-3 py-1 rounded-full mb-1 shadow-sm`}>
                    <Text style={tw`text-white font-bold text-[10px]`}>{inst.tags?.name || '공공기관'}</Text>
                  </View>
                  <View style={tw`w-14 h-14 bg-[#E1EDE4] rounded-full border-2 border-[#008C75] items-center justify-center shadow-md`}>
                    <View style={tw`w-10 h-10`}>
                      <Image source={SvgComponent} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                    </View>
                  </View>
                  <View style={tw`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#008C75] -mt-[1px]`} />
                </View>
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-[#008C75] font-bold`}>지도를 불러오는 중...</Text>
        </View>
      )}

      {/* Dynamic Island background hiding */}
      <View style={[tw`absolute top-0 left-0 right-0 bg-[#E1EDE4]/90 z-50`, { height: insets.top }]} />

      {/* --- Right Floating Controls --- */}
      <View style={[tw`absolute z-20`, { right: 20, top: insets.top + 20 }]}>
        <View style={tw`bg-white/90 rounded-2xl shadow-sm mb-4 overflow-hidden`}>
          <TouchableOpacity style={tw`p-3 border-b border-gray-100 items-center`}>
            <Feather name="plus" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-3 items-center`}>
            <Feather name="minus" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={tw`bg-white/90 rounded-full p-3 shadow-sm items-center`}
          onPress={() => {
            if (location) {
              setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              });
            }
          }}
        >
          <Feather name="crosshair" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* --- Bottom Card --- */}
      <View style={[tw`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pt-8 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40`, { paddingBottom: insets.bottom + 90 }]}>
        <Text style={tw`text-gray-900 font-black text-lg mb-1`}>
          가까운 공공기관 핀을 누르면 <Text style={tw`text-[#008C75]`}>나가보기</Text>.
        </Text>
        <Text style={tw`text-gray-900 font-black text-lg mb-6`}>
          도착하면 카메라로
        </Text>
        
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={onBackToHome}
          style={tw`bg-[#F2F5F3] rounded-2xl py-4 flex-row items-center justify-center`}
        >
          <Text style={tw`text-gray-700 font-bold text-base`}>🏚️ 집에서 구경만 할래</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
