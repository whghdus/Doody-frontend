// src/store/useOnboardingStore.ts
import { create } from 'zustand';
import { userApi } from '../api/user';
import { authApi } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage } from '../utils/authStorage';

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
  logout: () => void;
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
    // Calculate scores from mood answers
    const scoreMap: Record<string, number> = {
      // daily mood
      '나쁘지 않아': 0,
      '그냥 그래': 1,
      '잘 모르겠어': 2,
      '좀 지쳐 있어': 3,
      // spending
      '나쁘지 않아_spending': 0,
      '잘 모르겠어_spending': 1,
      '부담스러웠어': 2,
      '불만 했어': 3,
      // contact
      '나쁘지 않아_contact': 0,
      '잘 모르겠어_contact': 1,
      '부담스러웠어_contact': 2,
      '할만 했어': 0,
    };

    // Simple score mapping: each answer maps to a score 0-3
    const dailyScore = ['나쁘지 않아', '그냥 그래', '잘 모르겠어', '좀 지쳐 있어'].indexOf(answers.daily);
    const spendingScore = ['나쁘지 않아', '잘 모르겠어', '부담스러웠어', '불만 했어'].indexOf(answers.spending);
    const contactScore = ['할만 했어', '나쁘지 않아', '잘 모르겠어', '부담스러웠어'].indexOf(answers.contact);

    set({
      moodAnswers: answers,
      onboardingScores: {
        rhythm: Math.max(0, dailyScore),
        independence: Math.max(0, spendingScore),
        connection: Math.max(0, contactScore),
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

  logout: () =>
    set({
      userEmail: null,
      userNickname: null,
      currentScreen: 0, // 랜딩으로 이동
    }),

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
    let goalChoice: 'AUTONOMY' | 'RHYTHM' | 'CONNECTION' = 'RHYTHM';
    if (state.selectedGoal === 'g1') goalChoice = 'RHYTHM';
    else if (state.selectedGoal === 'g2') goalChoice = 'AUTONOMY';
    else if (state.selectedGoal === 'g3') goalChoice = 'CONNECTION';

    // 3. recommendedPeriod mapping
    let recommendedPeriod: 'today' | '1w' | '1m' | '3m' = '1w';
    if (state.selectedGoal === 'g1') recommendedPeriod = '1w';
    else if (state.selectedGoal === 'g2') recommendedPeriod = '1m';
    else if (state.selectedGoal === 'g3') recommendedPeriod = '3m';

    // 4. Choice mapping (1~5 scale based on mood answers)
    let rhythmChoice = 2;
    if (state.moodAnswers.daily === '나쁘지 않아') rhythmChoice = 5;
    else if (state.moodAnswers.daily === '그냥 그래') rhythmChoice = 4;
    else if (state.moodAnswers.daily === '잘 모르겠어') rhythmChoice = 3;
    else if (state.moodAnswers.daily === '좀 지쳐 있어') rhythmChoice = 2;

    let autonomyChoice = 2;
    if (state.moodAnswers.spending === '나쁘지 않아') autonomyChoice = 5;
    else if (state.moodAnswers.spending === '불만 했어') autonomyChoice = 4;
    else if (state.moodAnswers.spending === '잘 모르겠어') autonomyChoice = 3;
    else if (state.moodAnswers.spending === '부담스러웠어') autonomyChoice = 2;

    let connectionChoice = 2;
    if (state.moodAnswers.contact === '나쁘지 않아') connectionChoice = 5;
    else if (state.moodAnswers.contact === '할만 했어') connectionChoice = 4;
    else if (state.moodAnswers.contact === '잘 모르겠어') connectionChoice = 3;
    else if (state.moodAnswers.contact === '부담스러웠어') connectionChoice = 2;

    // 5. Goal strings mapping
    const autonomyGoal = "돈과 소비를 피하지 않고 편안하게 마주하기";
    const connectionGoal = "주변 관계를 가볍게 되찾기";

    // 6. firstStepMission mapping
    let firstStepMission = "오늘 하루 딱 5분만 햇볕 아래 걷고 오기";
    if (state.selectedGoal === 'g1') firstStepMission = "아침 알람 소리를 듣고 침대에 3분 동안 기지개 켜기";
    else if (state.selectedGoal === 'g2') firstStepMission = "통장 잔액 한 번만 슥 보고 닫기";
    else if (state.selectedGoal === 'g3') firstStepMission = "가까운 청년센터 사이트 즐겨찾기(북마크) 해두기";

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
      firstStepMission,
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
