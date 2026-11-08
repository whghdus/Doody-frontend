import type { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  HomeMain: undefined;
  Collection: undefined;
  DoodyDetail: { doodyId: string };
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Independence: undefined;
  Connection: undefined;
  Report: undefined;
};

export type RootStackParamList = {
  Landing: undefined;
  Signup: undefined;
  Login: undefined;
  Onboarding1: undefined;
  OnboardingGoal: undefined;
  OnboardingDuration: undefined;
  OnboardingQuestions: undefined;
  OnboardingMyData: undefined;
  OnboardingSummary: undefined;
  OnboardingHatch: undefined;
  Home: NavigatorScreenParams<MainTabParamList> | undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
