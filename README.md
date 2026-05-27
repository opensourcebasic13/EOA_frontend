[26 05 28 프론트 더미 리드미 36d8adacea5680fab5d5c4fa7c1536f5.md](https://github.com/user-attachments/files/28317758/26.05.28.36d8adacea5680fab5d5c4fa7c1536f5.md)
# 26.05.28 프론트 더미 리드미

# 📊 EOA (EARS OF ANTS)

# 프론트엔드 현황

## 🗺️ 전체 페이지 구조

EOA_frontend/

├── src/

│   ├── pages/               ← 7개 페이지 완성

│   │   ├── Login.jsx           ✅ 로그인

│   │   ├── Signup.jsx          ✅ 회원가입

│   │   ├── Home.jsx            ✅ 홈 (메인)

│   │   ├── SearchResult.jsx    ✅ 종목 검색 결과

│   │   ├── Profile.jsx         ✅ 프로필

│   │   ├── WatchlistManager.jsx✅ 관심 종목 관리

│   │   └── HotStocks.jsx       ✅ 핫한 종목 발견 (신규)

│   │

│   ├── components/          ← 14개 컴포넌트

│   │   ├── layout/

│   │   │   ├── Header.jsx       검색창 + 유저 드롭다운

│   │   │   ├── Footer.jsx

│   │   │   ├── LeftSidebar.jsx

│   │   │   └── RightSidebar/

│   │   │       ├── HotStockCard.jsx  (더보기 → /hot 연결)

│   │   │       ├── TrendChart.jsx

│   │   │       └── AlertCard.jsx

│   │   ├── home/

│   │   │   └── MainTable.jsx    종목 테이블

│   │   ├── search/

│   │   │   ├── StockSummary.jsx

│   │   │   ├── SearchChart.jsx

│   │   │   ├── TweetCard.jsx

│   │   │   └── TweetList.jsx

│   │   ├── auth/

│   │   │   ├── LoginForm.jsx

│   │   │   └── SignupForm.jsx

│   │   └── common/

│   │       └── LogoImg.jsx      로고 이미지 + 오류시 이니셜 폴백

│   │

│   ├── context/

│   │   └── AuthContext.jsx  ← 전역 상태 관리

│   └── data/

│       └── watchStocks.js   ← 초기 관심 종목 더미 데이터


## 🛣️ 라우팅 맵

| URL	페이지 | page | 핵심 기능 |
| --- | --- | --- |
| / | → /login 리다이렉트	 |  |
| /login | 로그인 | 이메일 + 비밀번호 입력 |
| /signup | 회원가입 | 계정 생성 |
| /home | 홈 | 종목 테이블 + 우측 사이드바+검색창 |
| /search?q=종목명 | 검색 결과	 | 주가 차트 + 트윗 목록 |
| /profile | 프로필 | 사용자 정보 조회/수정 |
| /watchlist | 관심 종목 관리 | 추가 · 삭제 · 추천 종목 |
| /hot | 핫한 종목 발견 | 트윗↑ + 주가↑ 랭킹  |

## ⚙️ 전역 상태 : 공유 데이터

AuthContext 제공 값

├── isLoggedIn              로그인 여부

├── user { name, email, phone, avatar, joinDate }

├── login() / logout()

├── updateUser(updates)     프로필 수정

├── watchlist[]             관심 종목 배열

├── addToWatchlist(stock)   중복 방지 추가

└── removeFromWatchlist(name)

## 🔥 핫한 종목 발견 페이지

A. 정렬 기준 4가지

1. 🔥 종합점수  →  tweets × 주가상승률 (기본)
2. 💬 트윗량    →  트윗 수 많은 순
3. 📈 주가 상승률 →  상승% 높은 순
4. 🚀 트윗 급등률 →  트윗 변화율 높은 순

B. 카드 구성

🥇🥈🥉 순위 메달  |  로고  |  종목명/티커
주가 + 상승률     |  트윗수 + 변화율  |  종합점수
🔕/🔔 알람 버튼   |  + 관심종목 추가 버튼

C. 알람 기능

🔔 클릭 → 알람 ON  →  우상단 SMS 스타일 토스트 팝업
🔔 다시 클릭 → 알람 OFF
토스트 3.5초 후 자동 소멸

## 앞으로 구현 할 것:

백엔드 API와 연동
세부 디테일 구현(
1. 검색 결과 없는 화면 구현(Not Found)
2. 알림버튼 드롭다운 구현
   ** API 연동 후 추가적인 세부 디테일 구현 예정)
