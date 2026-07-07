import React from 'react';
import { View, Text } from 'react-native';

export default function MapView(props) {
  return (
    <View style={[{ backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }, props.style]}>
      <Text>지도 화면 (웹 지원 안됨)</Text>
      {props.children}
    </View>
  );
}

export const Marker = (props) => null;
export const Callout = (props) => null;
export const Polygon = (props) => null;
export const Polyline = (props) => null;
export const Circle = (props) => null;
