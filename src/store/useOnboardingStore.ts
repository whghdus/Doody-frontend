// src/store/useOnboardingStore.ts
import { create } from 'zustand';

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
    })
}));
