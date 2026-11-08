// src/App.tsx
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from '@/shared/lib/tailwind';
import { useOnboardingStore } from '@/entities/useOnboardingStore';
import Background from '@/shared/ui/Background';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth screens
import LandingScreen from '@/pages/auth/LandingScreen';
import SignupScreen from '@/pages/auth/SignupScreen';
import LoginScreen from '@/pages/auth/LoginScreen';

// Onboarding screens
import OnboardingScreen1 from '@/pages/onboarding/OnboardingScreen1';
import OnboardingGoal from '@/pages/onboarding/OnboardingGoal';
import OnboardingDuration from '@/pages/onboarding/OnboardingDuration';
import OnboardingQuestions from '@/pages/onboarding/OnboardingQuestions';
import OnboardingMyData from '@/pages/onboarding/OnboardingMyData';
import OnboardingSummary from '@/pages/onboarding/OnboardingSummary';
import OnboardingHatch from '@/pages/onboarding/OnboardingHatch';

// Main Tab Navigator
import BottomTabNavigator from './app/navigation/BottomTabNavigator';

const Stack = createNativeStackNavigator();

// A wrapper to maintain the Background on all Onboarding/Auth screens
const ScreenWrapper = ({ children, theme = "day" }: { children: React.ReactNode, theme?: "day"|"night" }) => (
  <Background theme={theme}>
    {children}
  </Background>
);

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Landing');

  useEffect(() => {
    const initApp = async () => {
      try {
        // Here you can check async storage for auto login
        // const email = await AsyncStorage.getItem('userEmail');
        // if (email) setInitialRoute('Home');
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };
    initApp();
  }, []);

  if (isInitializing) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={tw`flex-1 bg-white`}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
              headerShown: false,
              animation: 'fade', // Smooth fade animation between screens
              contentStyle: { backgroundColor: 'transparent' }
            }}
          >
            <Stack.Screen name="Landing">
              {(props: any) => (
                <ScreenWrapper>
                  <LandingScreen 
                    onSignupClick={() => props.navigation.navigate('Signup')} 
                    onLoginClick={() => props.navigation.navigate('Login')} 
                  />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="Signup">
              {(props: any) => (
                <ScreenWrapper>
                  <SignupScreen 
                    onSignup={(email, nickname) => {
                      useOnboardingStore.getState().setUserEmail(email);
                      useOnboardingStore.getState().setUserNickname(nickname);
                      props.navigation.navigate('Onboarding1');
                    }} 
                    onBack={() => props.navigation.goBack()} 
                  />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="Login">
              {(props: any) => (
                <ScreenWrapper>
                  <LoginScreen 
                    onLogin={(email, nickname) => {
                      useOnboardingStore.getState().setUserEmail(email);
                      useOnboardingStore.getState().setUserNickname(nickname);
                      props.navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                    }} 
                    onBack={() => props.navigation.goBack()} 
                  />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="Onboarding1">
              {(props: any) => (
                <ScreenWrapper>
                  <OnboardingScreen1 onNext={(selectedId) => {
                    useOnboardingStore.getState().setSelectedCategory(selectedId);
                    props.navigation.navigate('OnboardingGoal');
                  }} />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingGoal">
              {(props: any) => (
                <ScreenWrapper>
                  <OnboardingGoal
                    onNext={(goalId) => {
                      useOnboardingStore.getState().setSelectedGoal(goalId);
                      props.navigation.navigate('OnboardingDuration');
                    }}
                    onLater={() => props.navigation.navigate('OnboardingSummary')}
                  />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingDuration">
              {(props: any) => (
                <ScreenWrapper>
                  <OnboardingDuration
                    goalId={useOnboardingStore.getState().selectedGoal}
                    onNext={() => {
                      props.navigation.navigate('OnboardingQuestions');
                    }}
                    onBack={() => props.navigation.goBack()}
                    onLater={() => props.navigation.navigate('OnboardingSummary')}
                  />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingQuestions">
              {(props: any) => (
                <ScreenWrapper>
                  <OnboardingQuestions
                    onNext={(answers) => {
                      const dailyScore = ['나쁘지 않아', '그냥 그래', '잘 모르겠어', '좀 지쳐 있어'].indexOf(answers.daily);
                      const spendingScore = ['나쁘지 않아', '잘 모르겠어', '부담스러웠어', '불만 했어'].indexOf(answers.spending);
                      const contactScore = ['할만 했어', '나쁘지 않아', '잘 모르겠어', '부담스러웠어'].indexOf(answers.contact);
                      useOnboardingStore.getState().setMoodAnswers(answers);
                      useOnboardingStore.getState().setOnboardingScores({
                        rhythm: Math.max(0, dailyScore),
                        independence: Math.max(0, spendingScore),
                        connection: Math.max(0, contactScore),
                      });
                      props.navigation.navigate('OnboardingMyData');
                    }}
                    onBack={() => props.navigation.goBack()}
                  />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingMyData">
              {(props: any) => (
                <ScreenWrapper>
                  <OnboardingMyData onConsent={async (consent) => {
                    try {
                      useOnboardingStore.getState().setMydataConsent(consent);
                      await useOnboardingStore.getState().submitOnboarding();
                      props.navigation.navigate('OnboardingSummary');
                    } catch (error: any) {
                      console.error('Failed to submit onboarding', error);
                      const { Alert } = require('react-native');
                      Alert.alert(
                        '회원가입 실패',
                        error.response?.data?.message || '회원가입 중 에러가 발생했어.'
                      );
                      throw error; // Re-throw to reset loading state in MyData
                    }
                  }} />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingSummary">
              {(props: any) => (
                <ScreenWrapper>
                  <OnboardingSummary onNext={() => props.navigation.navigate('OnboardingHatch')} />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingHatch">
              {(props: any) => (
                <ScreenWrapper>
                  <OnboardingHatch onFinish={() => {
                    props.navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                  }} />
                </ScreenWrapper>
              )}
            </Stack.Screen>

            <Stack.Screen name="Home" options={{ animation: 'fade' }}>
              {(props: any) => (
                <BottomTabNavigator />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}