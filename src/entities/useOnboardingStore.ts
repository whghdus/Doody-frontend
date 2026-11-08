// src/store/useOnboardingStore.ts
import { create } from 'zustand';
import { userApi } from '@/shared/api/user';
import { authApi, SignupResponse } from '@/shared/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage } from '@/shared/lib/authStorage';

export interface OnboardingScores {
  rhythm: number;
  independence: number;
  connection: number;
}

export interface MoodAnswers {
  daily: string;      // 요즘 하루동안 기분
  spending: string;   // 돈/소비 내역 마주하기
  contact: string;    // 연락/문의 기분
}

interface OnboardingState {
  currentScreen: number;        // 0: login, 1~7: onboarding, 8+: home
  userEmail: string | null;          // User Email
  userNickname: string | null;       // User Nickname
  selectedCategory: string | null;   // Screen 1: 막히는 곳
  selectedGoal: string;              // Screen 2: 목표
  selectedDuration: string;          // Screen 3: 기간
  moodAnswers: MoodAnswers;          // Screen 4: 기분 질문
  mydataConsent: boolean;            // Screen 5: 마이데이터 연동 동의
  onboardingScores: OnboardingScores;
  onboardingResult: SignupResponse['result'] | null; // 백엔드 플랜 결과

  // Basic Setters
  setCurrentScreen: (screen: number) => void;
  setUserEmail: (email: string | null) => void;
  setUserNickname: (nickname: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedGoal: (goalId: string) => void;
  setSelectedDuration: (duration: string) => void;
  setMoodAnswers: (answers: MoodAnswers) => void;
  setMydataConsent: (consent: boolean) => void;
  setOnboardingScores: (scores: OnboardingScores) => void;

  // Step transitions
  nextScreen1: (selectedId: string) => void;   // 막히는 곳 → 목표
  nextGoal: (goalId: string) => void;          // 목표 → 기간
  nextDuration: (duration: string) => void;    // 기간 → 기분 질문
  nextQuestions: (answers: MoodAnswers) => void; // 기분 질문 → 마이데이터
  nextMyData: (consent: boolean) => void;      // 마이데이터 → 두디 플랜
  nextSummary: () => void;                     // 두디 플랜 → 두디 시작하기
  finishOnboarding: () => void;                // 두디 시작하기 → 홈
  laterSkip: () => void;                       // 나중에 → 두디 플랜
  restartOnboarding: () => void;
  goToLogin: () => void;                       // Landing → Login
  goToSignup: () => void;                      // Landing → Signup
  signup: (email: string, nickname: string) => void; // 회원가입 (온보딩으로 이동)
  login: (email: string, nickname: string) => void;  // 로그인 (홈으로 이동)
  logout: () => Promise<void>;
  submitOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentScreen: 0,
  userEmail: null,
  userNickname: null,
  selectedCategory: null,
  selectedGoal: 'g1',
  selectedDuration: '1w',
  moodAnswers: {
    daily: '',
    spending: '',
    contact: '',
  },
  mydataConsent: false,
  onboardingScores: {
    rhythm: 0,
    independence: 0,
    connection: 0,
  },
  onboardingResult: null,

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setUserEmail: (email) => set({ userEmail: email }),
  setUserNickname: (nickname) => set({ userNickname: nickname }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedGoal: (selectedGoal) => set({ selectedGoal }),
  setSelectedDuration: (selectedDuration) => set({ selectedDuration }),
  setMoodAnswers: (moodAnswers) => set({ moodAnswers }),
  setMydataConsent: (mydataConsent) => set({ mydataConsent }),
  setOnboardingScores: (onboardingScores) => set({ onboardingScores }),

  // Screen 1 → Screen 2
  nextScreen1: (selectedId) => {
    set({ selectedCategory: selectedId });
    requestAnimationFrame(() => {
      set({ currentScreen: 2 });
    });
  },

  // Screen 2 → Screen 3
  nextGoal: (goalId) => {
    set({ selectedGoal: goalId });
    requestAnimationFrame(() => {
      set({ currentScreen: 3 });
    });
  },

  // Screen 3 → Screen 4
  nextDuration: (duration) => {
    set({ selectedDuration: duration });
    requestAnimationFrame(() => {
      set({ currentScreen: 4 });
    });
  },

  // Screen 4 → Screen 5
  nextQuestions: (answers) => {
    // Simple score mapping: each answer maps to a score 0-3
    const dailyScore = ['꽤 괜찮고 편안해', '평소랑 비슷해', '기운이 없고 무기력해', '너무 지치고 힘들어'].indexOf(answers.daily);
    const spendingScore = ['잘 관리하고 있고 편안해', '크게 신경 쓰이지 않아', '마주하기 부담스럽고 걱정돼', '너무 막막하고 피하고 싶어'].indexOf(answers.spending);
    const contactScore = ['마음 편하게 연락할 수 있어', '별 생각 없이 할 수 있어', '왠지 불편하고 망설여져', '너무 긴장되고 피하고 싶어'].indexOf(answers.contact);

    set({
      moodAnswers: answers,
      onboardingScores: {
        rhythm: Math.max(0, 3 - dailyScore),
        independence: Math.max(0, 3 - spendingScore),
        connection: Math.max(0, 3 - contactScore),
      },
    });
    requestAnimationFrame(() => {
      set({ currentScreen: 5 });
    });
  },

  // Screen 5 → Screen 6
  nextMyData: (consent) => {
    set({ mydataConsent: consent });
    requestAnimationFrame(() => {
      set({ currentScreen: 6 });
    });
  },

  // Screen 6 → Screen 7
  nextSummary: () => {
    requestAnimationFrame(() => {
      set({ currentScreen: 7 });
    });
  },

  // Screen 7 → Home (Screen 8+)
  finishOnboarding: () => {
    requestAnimationFrame(() => {
      set({ currentScreen: 8 });
    });
  },

  // "나중에" → 두디 플랜 (Screen 6)
  laterSkip: () => {
    requestAnimationFrame(() => {
      set({ currentScreen: 6 });
    });
  },

  restartOnboarding: () => {
    set({
      selectedCategory: null,
      selectedGoal: 'g1',
      selectedDuration: '1w',
      moodAnswers: { daily: '', spending: '', contact: '' },
      mydataConsent: false,
      onboardingScores: { rhythm: 0, independence: 0, connection: 0 },
      onboardingResult: null,
    });
    requestAnimationFrame(() => {
      set({ currentScreen: 0 }); // 홈화면 두디 로고 클릭 시 LandingScreen(0)으로 이동
    });
  },

  goToLogin: () => set({ currentScreen: -2 }),
  
  goToSignup: () => set({ currentScreen: -1 }),

  signup: (email, nickname) => 
    set({
      userEmail: email,
      userNickname: nickname,
      currentScreen: 1, // 회원가입 후 온보딩 1번
    }),

  login: (email, nickname) => 
    set({
      userEmail: email,
      userNickname: nickname,
      currentScreen: 8, // 로그인 후 바로 홈(8)
    }),

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userNickname');
      await authStorage.setToken(''); // Clear token from secure store
    } catch (e) {
      console.error('Failed to clear storage on logout', e);
    }
    set({
      userEmail: null,
      userNickname: null,
      currentScreen: 0, // 랜딩으로 이동
    });
  },

  submitOnboarding: async () => {
    const state = useOnboardingStore.getState();

    // 1. gapAxis mapping
    let gapAxis: 'RHYTHM' | 'AUTONOMY' | 'CONNECTION' | 'COMPOSITE' | 'UNKNOWN' = 'UNKNOWN';
    if (state.selectedCategory === 'start') gapAxis = 'RHYTHM';
    else if (state.selectedCategory === 'money') gapAxis = 'AUTONOMY';
    else if (state.selectedCategory === 'contact') gapAxis = 'CONNECTION';
    else if (state.selectedCategory === 'multiple') gapAxis = 'COMPOSITE';
    else if (state.selectedCategory === 'unknown') gapAxis = 'UNKNOWN';

    // 2. goalChoice mapping
    let goalChoice: 'AUTONOMY' | 'RHYTHM' | 'CONNECTION' = 'AUTONOMY';
    if (state.selectedGoal === 'g1') goalChoice = 'AUTONOMY';
    else if (state.selectedGoal === 'g2') goalChoice = 'AUTONOMY';
    else if (state.selectedGoal === 'g3') goalChoice = 'CONNECTION';

    // 3. recommendedPeriod mapping
    let recommendedPeriod: 'today' | '1w' | '1m' | '3m' = '1w';
    if (state.selectedGoal === 'g1') recommendedPeriod = '1w';
    else if (state.selectedGoal === 'g2') recommendedPeriod = '1m';
    else if (state.selectedGoal === 'g3') recommendedPeriod = '3m';

    // 4. Choice mapping (1~4 scale based on mood answers)
    let rhythmChoice = 3;
    if (state.moodAnswers.daily === '너무 지치고 힘들어') rhythmChoice = 1;
    else if (state.moodAnswers.daily === '기운이 없고 무기력해') rhythmChoice = 2;
    else if (state.moodAnswers.daily === '평소랑 비슷해') rhythmChoice = 3;
    else if (state.moodAnswers.daily === '꽤 괜찮고 편안해') rhythmChoice = 4;

    let autonomyChoice = 3;
    if (state.moodAnswers.spending === '너무 막막하고 피하고 싶어') autonomyChoice = 1;
    else if (state.moodAnswers.spending === '마주하기 부담스럽고 걱정돼') autonomyChoice = 2;
    else if (state.moodAnswers.spending === '크게 신경 쓰이지 않아') autonomyChoice = 3;
    else if (state.moodAnswers.spending === '잘 관리하고 있고 편안해') autonomyChoice = 4;

    let connectionChoice = 3;
    if (state.moodAnswers.contact === '너무 긴장되고 피하고 싶어') connectionChoice = 1;
    else if (state.moodAnswers.contact === '왠지 불편하고 망설여져') connectionChoice = 2;
    else if (state.moodAnswers.contact === '별 생각 없이 할 수 있어') connectionChoice = 3;
    else if (state.moodAnswers.contact === '마음 편하게 연락할 수 있어') connectionChoice = 4;

    // 5. Goal strings mapping
    const autonomyGoal = "돈과 소비를 피하지 않고 편안하게 마주하기";
    const connectionGoal = "주변 관계를 가볍게 되찾기";

    const signupData = {
      email: state.userEmail || '',
      nickname: state.userNickname || '',
      gapAxis,
      goalChoice,
      recommendedPeriod,
      rhythmChoice,
      autonomyChoice,
      connectionChoice,
      isMydataLinked: state.mydataConsent,
      autonomyGoal,
      connectionGoal,
    };

    try {
      const response = await authApi.signup(signupData);
      if (response.isSuccess && response.result) {
        await authStorage.setToken(response.result.userId);
        await AsyncStorage.setItem('userEmail', response.result.email);
        await AsyncStorage.setItem('userNickname', response.result.nickname);
        
        set({
          userEmail: response.result.email,
          userNickname: response.result.nickname,
          onboardingResult: response.result,
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        // Email already exists! Fallback to automatic login.
        try {
          const loginResponse = await authApi.login(signupData.email, signupData.nickname);
          if (loginResponse.isSuccess && loginResponse.result) {
            await authStorage.setToken(loginResponse.result.userId);
            await AsyncStorage.setItem('userEmail', loginResponse.result.email);
            await AsyncStorage.setItem('userNickname', loginResponse.result.nickname);
            
            set({
              userEmail: loginResponse.result.email,
              userNickname: loginResponse.result.nickname,
            });
            return;
          }
        } catch (loginError) {
          console.error('Failed auto-login on signup conflict:', loginError);
        }
      }
      throw error;
    }
  }
}));
