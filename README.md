# DOODY (두디) - Frontend

**하나 청년 금융인재 양성 프로젝트**

DOODY는 공백청년이 다시 일상과 자립, 사회적 연결을 회복할 수 있도록 돕는 **AI 보조형 디지털 동행 서비스**입니다. 
"빨리 취업해야 한다"거나 "목표를 세워야 한다"고 요구하지 않고, 지금 당장 가능한 아주 작은 행동부터 시작하여 생활 리듬을 되찾고 자립을 준비할 수 있도록 설계되었습니다.

## 🌟 서비스 핵심 가치 (Core Philosophy)

DOODY는 공백청년의 회복을 **리듬, 자립, 연결**이라는 세 가지 축으로 바라보며, 현재 위치와 목표 사이의 간격을 '작은 미션'으로 줄여갑니다.

- **리듬 (Rhythm):** 하루를 열고 닫는 기본적인 생활감 형성 (아침/저녁 닻)
- **자립 (Independence):** 막막한 결정 대신 정보 구경하기, 확인하기부터 시작
- **연결 (Connection):** 기관, 상담과의 거리감을 줄이는 작은 시도 (위치 확인 등)

특히 **무처벌 설계(No-Punishment Design)**를 적용하여, 점수나 실패 표시 없이 사용자가 자책감 없이 안전하게 시작할 수 있도록 돕습니다.

---

## 🎯 주요 기능 (Key Features)

### 1. 하루를 여닫는 2개의 닻 (Morning & Night Check-in)
- **아침 닻:** 사용자가 스스로 정한 시간에 앱에 접속하여 하루를 시작하는 작은 약속
- **저녁 닻:** 오늘 하루를 한 단어, 짧은 문장, 이모지 등으로 가볍게 기록하며 자책을 줄이고 하루를 정리

### 2. 자립과 연결을 위한 아주 작은 미션
완벽한 이력서 쓰기나 대면 상담 신청 대신, 시작의 마찰을 줄인 미션을 제공합니다.
- **자립 미션:** 취업/금융 지원 정보 구경하기, 콘텐츠 보기
- **연결 미션:** 상담 정보 보기, 지도에서 가까운 **청년센터** 및 **하나은행** 위치 확인하기 (Overpass API 기반)

### 3. 회복 패스포트와 두디 도감
단순한 출석이나 점수가 아닌, 사용자의 작은 회복 행동들을 돌아볼 수 있는 흔적입니다. 의미 있는 행동(아침 닻 완료, 기관 정보 저장 등)을 할 때마다 다양한 모습의 귀여운 '두디' 캐릭터가 모이게 됩니다.

### 4. 하나금융 및 기관과의 유기적 연결
사용자의 일상 회복이 어느 정도 이루어진 시점에, 자연스럽게 금융교육 콘텐츠, 청년 자립 지원 정보, 하나머니 보상 등으로 연결되는 중간 다리 역할을 합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework:** React Native, Expo, TypeScript
- **State Management:** Zustand, AsyncStorage
- **Navigation:** React Navigation (Native Stack)
- **UI / Styling:** Tailwind CSS (`twrnc`), Expo Image
- **Map / Location:** `react-native-maps`, `expo-location`, Overpass API (주변 청년센터/하나은행 탐색)
- **Device Sensors:** `expo-camera` (두디 포획용)

## 📦 설치 및 실행 방법 (Getting Started)

1. **저장소 클론 및 패키지 설치**
```bash
git clone <repository_url>
cd doody-frontend
pnpm install
```

2. **로컬 개발 서버 실행 (캐시 초기화 및 터널링 적용)**
- 모바일 기기 테스트 시 터널링(`--tunnel`)과 캐시 삭제(`-c`)를 적용하여 실행합니다.
```bash
pnpm expo start -c --tunnel
```

## 📁 프로젝트 구조 (Project Structure)
```text
src/
├── App.tsx             # 앱 진입점 및 전체 네비게이션 라우팅 설정
├── assets/             # 정적 파일 (다양한 표정의 두디 캐릭터 이미지 등)
├── constants/          # 컬러 테마(COLORS), 폰트 크기 등 앱 전역 상수
├── store/              # Zustand 상태 관리 스토어
├── hooks/              # 재사용 가능한 커스텀 훅 (Custom Hooks)
├── components/         # 도메인/기능별 분리된 UI 컴포넌트 모음
│   ├── common/         # 버튼, 배경, 모달 등 공통 사용 컴포넌트
│   ├── home/           # 홈 화면 전용 컴포넌트
│   ├── mission/        # 미션 관련 카드, 배너 등
│   ├── onboarding/     # 온보딩 화면 전용 카드/요소
│   └── report/         # 도감, 패스포트 등 기록 관련 컴포넌트
└── screens/            # 라우팅 단위의 개별 화면 컴포넌트
    ├── auth/           # 로그인/인증 화면
    ├── connection/     # 연결 축: 지도 기반 기관 찾기 및 포획 뷰 (ConnectionScreen 등)
    ├── home/           # 리듬 축: 아침/저녁 닻 체크인 화면 (NightCheckInScreen 등)
    ├── independence/   # 자립 축: 일자리/지원 정보 등 자립 미션 화면
    ├── mission/        # 미션 상세 정보 및 수행 화면
    ├── onboarding/     # 초기 상태 진단 및 앱 시작 플로우 (OnboardingHatch 등)
    └── report/         # 두디 도감 및 회복 패스포트 상세 뷰
```
