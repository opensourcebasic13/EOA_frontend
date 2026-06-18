# EOA (Ears of Ants) — 프론트엔드

X(트위터) 기반 실시간 주식 트렌드 분석 서비스의 프론트엔드입니다.

## 팀 구성

| 역할 | 담당 |
|------|------|
| 백엔드 | 석민 |
| AI | 김나연 |
| 프론트엔드 | 김지안 |

---

## 기술 스택

- **React 18** + **Vite**
- **Tailwind CSS**
- **React Router v6**
- 백엔드: Django REST Framework (`http://127.0.0.1:8000`)

---

## 실행 방법

```bash
npm install
npm run dev
```

백엔드 없이도 더미 데이터로 전체 UI가 동작합니다.  
백엔드 연동 시 프로젝트 루트에 `.env` 파일을 생성하세요.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 백엔드 연동

### hasBackend 플래그

`src/api/client.js`의 `hasBackend`는 `VITE_API_BASE_URL` 환경변수 유무로 결정됩니다.

- `hasBackend = false` → 더미 데이터 사용 (백엔드 없이 시연 가능)
- `hasBackend = true` → 실제 API 호출

### API 엔드포인트

| 기능 | 메서드 | URL |
|------|--------|-----|
| 회원가입 | POST | `/api/users/signup/` |
| 로그인 | POST | `/api/users/login/` |
| 로그아웃 | POST | `/api/users/logout/` |
| 내 정보 | GET | `/api/users/me/` |
| 트렌딩 종목 | GET | `/api/stocks/trending/` |
| 관심종목 조회 | GET | `/api/stocks/watchlist/` |
| 관심종목 추가 | POST | `/api/stocks/watchlist/` |
| 관심종목 삭제 | DELETE | `/api/stocks/watchlist/` |
| AI 분석 | GET | `/api/stocks/<ticker>/ai-analysis/` |
| 트윗 목록 | GET | `/api/stocks/<ticker>/tweets/hot/` |

### 인증

DRF Token Authentication 사용. 로그인 응답의 `token`을 이후 모든 요청 헤더에 포함합니다.

```
Authorization: Token <token>
```

---

## 주요 변경 사항

### 백엔드 (`EOA/backend/`)

**users 앱 신규 구현**
- `users/views.py`, `users/urls.py` 새로 작성
- 회원가입·로그인·로그아웃·내 정보 API 구현
- DRF TokenAuthentication 기반 인증
- 비밀번호 최소 6자, 숫자 전용 불가 조건

**관심종목 API 확장** (`stocks/views.py`)
- `watchlist_stocks` 뷰에 POST·DELETE 추가
- `@authentication_classes([TokenAuthentication])` 적용
- DELETE 요청 body의 `ticker` 필드로 종목 식별

**URL 라우팅 정비** (`config/urls.py`)
- `/api/users/` 경로 추가
- watchlist 경로 `/api/watchlist/` → `/api/stocks/watchlist/` 수정
- 중복 URL 패턴 제거

**settings.py**
- `rest_framework.authtoken` INSTALLED_APPS 추가
- 비밀번호 최소 길이 8 → 6으로 완화

> 백엔드 변경 후 반드시 마이그레이션 실행 필요
> ```bash
> python manage.py migrate
> ```

---

### 프론트엔드 (`src/`)

**인증 흐름**
- `signupApi`에 `password_confirm` 필드 추가 (백엔드 요구사항 반영)
- 로그인 성공 시 `eoa_user`(이름·이메일) localStorage 저장 → 새로고침 후에도 계정 정보 유지
- 로그아웃 시 `eoa_token`, `eoa_user`, `eoa_watchlist`, `eoa_alarms` 전부 삭제

**다중 계정 지원** (`src/context/AuthContext.jsx`)
- 로그인 시 이전 계정 데이터 초기화 후 서버 동기화
- `syncWatchlistFromServer()`: 서버 응답이 빈 배열이어도 반드시 덮어씀 (이전 계정 데이터 잔류 버그 수정)
- 서버 watchlist ↔ trending 병합으로 전체 종목 정보 복원

**알람 기능** (`src/hooks/useAlarmPoller.js` 신규)
- 브라우저 Notification API 기반
- 알람 켤 때 브라우저 알림 권한 요청
- 5분마다 주가·트윗량 체크, 임계값 초과 시 OS 알림 발송
- 동일 종목 30분 쿨다운으로 중복 알림 방지

**로그인 화면**
- 예시 주식 목록 클릭 시 페이지 이동 비활성화
- 아이디·비밀번호 필드 아이콘 SVG로 교체 (크기·위치 정렬)
- 비밀번호 조건 힌트 표시 및 숫자 전용 사전 차단

**프로필 화면**
- 기본 아바타: 이름 첫 글자 표시 (외부 이미지 의존 제거)
- 프로필 사진 변경 시 base64 변환 후 localStorage 영구 저장
- 전화번호·가입일 필드 제거

**기타**
- 헤더 필터(3줄) 아이콘 제거
- `HotStockCard` 하드코딩 제거 → `fetchTrending()` 실시간 연동
- AI 분석 `summary_model` mT5 → BART 전체 수정
- 종목 로고: Clearbit API 사용 (`https://logo.clearbit.com/도메인`)

---

## 더미 데이터 구조

`VITE_API_BASE_URL` 미설정 시 아래 파일의 더미 데이터로 동작합니다.

| 파일 | 내용 |
|------|------|
| `src/api/stocks.js` | 트렌딩 10개 종목 |
| `src/api/analysis.js` | AI 분석 결과 |
| `src/components/search/StockSummary.jsx` | 종목 상세 정보 |
| `src/data/watchStocks.js` | 초기 관심종목 |
