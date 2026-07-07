import React, { memo } from 'react';
import { View, Text } from 'react-native';
import tw from '../../utils/tailwind';
import { COLORS } from '../../constants/theme';

interface StepIndicatorProps {
  steps: string[];
  currentStepIndex: number;
  style?: any;
}

function StepIndicator({ steps, currentStepIndex, style }: StepIndicatorProps) {
  return (
    <View style={[tw`bg-white/90 px-4 py-1.5 rounded-full border border-gray-100/50 shadow-sm flex-row items-center gap-x-1.5`, style]}>
      {steps.map((step, idx) => {
        const isActive = idx === currentStepIndex;
        const isComplete = idx < currentStepIndex;
        
        return (
          <React.Fragment key={idx}>
            <Text style={tw`text-[10px] font-bold ${
              isActive ? `text-[${COLORS.primary}]` : isComplete ? `text-[${COLORS.primary}]` : 'text-gray-400'
            }`}>
              {step}
            </Text>
            {idx < steps.length - 1 && (
              <Text style={tw`text-gray-300 text-[10px] font-bold`}>➔</Text>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default memo(StepIndicator);
