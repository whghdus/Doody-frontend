# Doody (두디) - 자립과 성장을 돕는 나만의 메이트 🐣

## 📖 기획 의도 및 ESG 임팩트 (Social Impact)
**Doody(두디)**는 진로 탐색, 취업 준비 등으로 인해 사회적 소속감을 잃고 고립되기 쉬운 **'공백청년(NEET 청년)'들의 주도적인 삶과 자립을 응원**하기 위해 기획된 **게이미피케이션 기반의 웰니스 & 습관 형성 플랫폼**입니다.

- **🌱 소셜 임팩트 (ESG - Social):** 공백청년들이 무기력증을 극복하고 다시 사회와 연결될 수 있도록 돕는 따뜻한 디지털 메이트 역할을 수행합니다. 금융 지식 부족과 경제적 어려움을 겪는 청년들에게 하나금융그룹 등과 연계된 퀘스트를 통해 실질적인 금융 자립을 지원하며 기업의 사회적 책임(CSR/ESG)을 실현합니다.
- **🎮 게이미피케이션 접근:** 딱딱하고 어려운 금융/자립 목표를 가상의 귀여운 캐릭터 '두디'와 함께 달성해 나가면서, 일상 속 작은 성공 경험을 누적시키고 긍정적인 루틴을 회복하도록 돕습니다.

## ✨ 주요 기능 및 핵심 탭 (Core Features)

### 1. 홈 (Home) - 일상 루틴과 두디와의 교감
- **아침/저녁 체크인 (Morning & Night Check-in):** 하루를 시작할 때와 마무리할 때 오늘의 기분을 기록하고, 두디와 짧은 한마디를 나눕니다. (루틴 중복 방지 적용)
- **일일 미션 & 보상:** 홈 화면에 할당된 미션을 수행하면 보상(금 RWA 토큰, W 포인트)을 획득합니다.
- **다이내믹한 팝업:** 미션이나 체크인을 완료할 때마다 두디가 등장하는 부드러운 모달과 함께 리워드 카드가 제공됩니다.

### 2. 자립 ON (Independence ON) - 목표 달성 로드맵
- 사용자가 설정한 목표(예: 종잣돈 모으기, 금융 지식 쌓기 등)에 맞춘 **자립 로드맵**을 제공합니다.
- 각 단계별 미션을 수행하며, 자신에게 맞지 않는 미션은 '교체(Swap)'할 수도 있습니다.
- 하나금융그룹 등과 연계된 금융/자립 관련 퀘스트를 수행하며 실질적인 도움을 받습니다.

### 3. 연결 ON (Connection ON) - 현실과 가상을 잇는 탐험
- 위치 기반(LBS) 지도 서비스를 활용하여 **현실 세계의 특정 장소(청년센터, 하나은행 본사 등)를 탐색**합니다.
- 지도 위에 표시된 '초록색 뾰족한 두디 핀' 근처로 이동해 두디를 "포획(Catch)"하는 재미 요소(포켓몬 GO 스타일)를 담았습니다.
- 웹 환경에서는 정적 지도(Static Map)를 제공하여 접근성을 높였습니다.

### 4. 리포트 & 도감 (Report & Collection)
- **두디 도감 (Pokedex):** 활동 내역에 따라 탐험하는 두디, 월급 두디, 양치하는 두디 등 다양한 모습의 두디를 수집할 수 있습니다.
- **타임라인 기록:** 사용자가 아침/저녁으로 남겼던 '하루 한 마디'와 기분 상태, 달성한 미션들이 리포트 형태로 차곡차곡 누적되어 자신의 성장을 한눈에 돌아볼 수 있습니다.

## 🎨 UI/UX 디자인 특징
- **따뜻하고 부드러운 테마:** `#008C75` (자연스러운 딥 그린)와 `#E1EDE4` (부드러운 민트/그린 배경)를 메인 컬러로 사용하여 편안하고 안정감 있는 웰니스 느낌을 줍니다.
- **일관된 모바일 경험:** iOS 키보드 애니메이션(`KeyboardAvoidingView`), 통일된 입력바 UI, 유려한 바텀시트/모달 애니메이션을 통해 네이티브 앱 수준의 쾌적한 사용성을 제공합니다.
- **반응형 핀 & 아이콘:** 웹과 앱 플랫폼 환경의 차이를 극복하기 위해 순수 React Native `View` 컴포넌트를 활용하여 어디서나 완벽한 형태의 마커와 말풍선을 렌더링합니다.

## 🛠 기술 스택 (Tech Stack)

### 프론트엔드 (Frontend)
- **Framework & Library:** React Native (v0.81), Expo (v54), React (v19)
- **Language:** TypeScript
- **State Management:** Zustand
- **Routing/Navigation:** React Navigation (v7)
- **Styling:** Tailwind CSS (via `twrnc`)

### 주요 라이브러리 (Key Libraries)
- **Map & LBS:** `react-native-maps`, `expo-location`
- **Networking:** Axios
- **Storage:** `@react-native-async-storage/async-storage`, `expo-secure-store`
- **UI & Assets:** `expo-image`, `@expo/vector-icons`, `react-native-svg`

## 📁 폴더 및 파일 구조 (Folder Structure)

```text
src/
├── api/             # 서버와 통신하는 Axios API 모듈 (auth, mission, report 등)
├── assets/          # 이미지, 아이콘(SVG), 폰트 등 정적 리소스 모음
│   ├── buttons/     # 각종 버튼 그래픽
│   ├── doody/       # 두디 캐릭터 에셋 (웹피, PNG 등)
│   ├── icons/       # UI 아이콘 리소스
│   └── backgrounds/ # 배경 이미지 리소스
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── common/      # 공통 컴포넌트 (NavBar, BackButton, SpeechBubble 등)
│   ├── home/        # 홈 화면 전용 모달 및 UI
│   ├── mission/     # 미션 관련 카드 및 모달
│   ├── onboarding/  # 온보딩 흐름에 사용되는 UI
│   └── report/      # 리포트 및 타임라인 관련 UI
├── constants/       # 앱 전체에서 사용되는 상수 및 테마 컬러 설정 (theme.ts 등)
├── screens/         # 화면(Page) 레벨 컴포넌트
│   ├── auth/        # 로그인/회원가입 화면
│   ├── connection/  # 연결ON (지도 탐색, 두디 포획 화면)
│   ├── home/        # 메인 홈, 아침/저녁 체크인 화면
│   ├── independence/# 자립ON (로드맵, 미션 목록 등)
│   ├── mission/     # 미션 상세, 미션 성공/교체 화면
│   ├── onboarding/  # 초기 온보딩 플로우 화면
│   └── report/      # 리포트, 두디 도감 화면
├── store/           # Zustand를 이용한 전역 상태 관리 (useCollectionStore, useOnboardingStore 등)
└── utils/           # 유틸리티 함수 (tailwind 설정, 문자열 포맷팅, 토큰 관리 등)
```

---

> 이 문서는 현재 구현된 코드와 프론트엔드 구조를 바탕으로 파악한 Doody의 핵심 기획과 컨셉을 정리한 내용입니다.
