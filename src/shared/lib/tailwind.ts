import { create } from 'twrnc';
import { Dimensions, Platform, PixelRatio } from 'react-native';

const twrnc = create();

// Get the actual screen width
const screenWidth = Dimensions.get('window').width;

// On web, cap at 480 (our mobile container max-width). On native, use device width.
const effectiveWidth = Platform.OS === 'web' ? Math.min(screenWidth, 480) : screenWidth;

// Design draft base dimensions — match to the device type
// Android: 360dp base, iOS: 390pt base
const BASE_WIDTH = Platform.OS === 'ios' ? 390 : 360;

// Calculate the scale factor based on the effective width
const baseScale = effectiveWidth / BASE_WIDTH;
// Scale down by 20% on web environment to prevent components from looking excessively large
const scale = Platform.OS === 'web' ? baseScale * 0.9 : baseScale;

// A helper to scale numeric style values
const scaleStyle = (style: any) => {
  if (!style) return style;
  const scaled: any = {};
  for (const key in style) {
    if (typeof style[key] === 'number') {
      // Exclude properties that should not be scaled
      if (
        [
          'flex',
          'flexGrow',
          'flexShrink',
          'opacity',
          'zIndex',
          'elevation',
          'aspectRatio',
          'borderWidth',
          'borderTopWidth',
          'borderRightWidth',
          'borderBottomWidth',
          'borderLeftWidth',
        ].includes(key)
      ) {
        scaled[key] = style[key];
      } else {
        // Round to nearest pixel to avoid fractional pixel rendering issues
        scaled[key] = PixelRatio.roundToNearestPixel(style[key] * scale);
      }
    } else {
      scaled[key] = style[key];
    }
  }
  return scaled;
};

// Create a Proxy over twrnc function to scale the output
const tw = (strings: TemplateStringsArray, ...values: any[]) => {
  return scaleStyle(twrnc(strings, ...values));
};

// Also wrap the style method if used
tw.style = (...args: any[]) => {
  return scaleStyle(twrnc.style(...args));
};

// Expose other methods directly
tw.color = twrnc.color;
tw.prefixMatch = twrnc.prefixMatch;
tw.memoBuster = twrnc.memoBuster;

export default tw;
