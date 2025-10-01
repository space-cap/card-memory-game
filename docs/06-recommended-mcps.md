# 추천 MCP 서버 목록

## 현재 설정된 MCP

✅ **superclaude** - SuperClaude 프레임워크 통합
✅ **postgres** - PostgreSQL 데이터베이스 연결 (memorygamedb)

---

## 프로젝트에 필요한 추가 MCP 서버

### 1. 🎨 **Magic MCP** (우선순위: 높음)
**용도**: UI 컴포넌트 생성 및 디자인 시스템 통합

**필요한 이유**:
- React 19 기반 현대적 UI 컴포넌트 자동 생성
- Card, Modal, Button 등 게임 UI 컴포넌트 구현
- Tailwind CSS v4와 통합된 반응형 컴포넌트
- 21st.dev 패턴 기반 접근성 준수 컴포넌트

**활용 시나리오**:
```
/ui card-component → 카드 뒤집기 애니메이션 포함 Card 컴포넌트 생성
/ui game-board → 그리드 레이아웃 GameBoard 컴포넌트
/ui modal → 게임 결과 모달, 결제 모달
/ui scoreboard → 대전 모드 점수판
```

**설치 방법**:
```json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"]
    }
  }
}
```

---

### 2. 🔍 **Context7 MCP** (우선순위: 높음)
**용도**: React, Vite, Tailwind 공식 문서 및 패턴 참조

**필요한 이유**:
- React 19의 최신 기능 (Server Components, Actions) 공식 문서
- Vite 7.x 최신 설정 패턴
- Tailwind CSS v4 마이그레이션 가이드
- TypeScript 5.8 타입 패턴

**활용 시나리오**:
```
"React 19 useTransition 사용법" → 공식 문서 참조
"Tailwind CSS v4 커스텀 설정" → v4 마이그레이션 가이드
"Vite HMR 최적화" → Vite 공식 성능 가이드
```

**설치 방법**:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-context7"]
    }
  }
}
```

---

### 3. 🎭 **Playwright MCP** (우선순위: 중간)
**용도**: E2E 테스트 및 브라우저 자동화

**필요한 이유**:
- 전체 게임 플레이 시나리오 자동 테스트
- 카드 클릭, 매칭, 점수 계산 검증
- 대전 모드 턴 전환 테스트
- 반응형 디자인 스크린샷 비교
- 접근성(WCAG) 자동 검증

**활용 시나리오**:
```typescript
// 게임 플레이 E2E 테스트
test('single mode game flow', async () => {
  await page.goto('/game');
  await page.click('[data-testid="card-1"]');
  await page.click('[data-testid="card-2"]');
  // 매칭 확인, 점수 검증
});

// 대전 모드 테스트
test('versus mode turn switching', async () => {
  // 플레이어 1, 2 턴 전환 검증
});
```

**설치 방법**:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

---

### 4. 🧠 **Sequential Thinking MCP** (우선순위: 중간)
**용도**: 복잡한 게임 로직 분석 및 디버깅

**필요한 이유**:
- 카드 매칭 알고리즘 단계별 분석
- 상태 관리 로직 검증 (Context + useReducer)
- 게임 엔진 State Machine 디버깅
- 점수 계산 로직 최적화 분석

**활용 시나리오**:
```
"카드 매칭 실패 시 왜 state가 업데이트 안되는지 분석"
"대전 모드에서 턴 전환 타이밍 문제 디버깅"
"점수 계산 로직의 보너스 계산 검증"
```

**설치 방법**:
```json
{
  "mcpServers": {
    "sequential": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

---

### 5. 🔄 **Morphllm MCP** (우선순위: 낮음)
**용도**: 대규모 코드 리팩토링 및 패턴 적용

**필요한 이유**:
- 여러 파일에 걸친 타입 정의 일괄 수정
- 컴포넌트 prop 타입 일괄 업데이트
- 코드 스타일 일괄 적용
- 마이그레이션 작업 (예: class component → function component)

**활용 시나리오**:
```
"모든 컴포넌트에 React.memo 적용"
"Card 인터페이스 변경 시 모든 사용처 업데이트"
"ESLint 룰 변경에 따른 코드 일괄 수정"
```

**설치 방법**:
```json
{
  "mcpServers": {
    "morphllm": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-morphllm"]
    }
  }
}
```

---

### 6. 🗄️ **Filesystem MCP** (우선순위: 낮음)
**용도**: 파일 시스템 탐색 및 관리

**필요한 이유**:
- 이미지 에셋 관리 (decks/historical, decks/celebrity)
- 사운드 파일 관리 (flip.mp3, match.mp3, win.mp3)
- 빌드 결과물 검증
- 디렉토리 구조 자동 생성

**활용 시나리오**:
```
"decks 디렉토리에 새로운 카테고리 추가"
"빌드 결과물 dist/ 검증"
"이미지 파일 일괄 이름 변경"
```

**설치 방법**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    }
  }
}
```

---

## 우선순위별 설치 권장사항

### 즉시 설치 권장 (Phase 1)
```json
{
  "mcpServers": {
    "superclaude": { /* 이미 설정됨 */ },
    "postgres": { /* 이미 설정됨 */ },

    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"]
    },

    "context7": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-context7"]
    }
  }
}
```

### 개발 진행 후 추가 (Phase 2)
```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-playwright"]
  },

  "sequential": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  }
}
```

### 필요시 선택적 설치 (Phase 3)
```json
{
  "morphllm": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-morphllm"]
  },

  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem"]
  }
}
```

---

## MCP 활용 워크플로우 예시

### 1. 새로운 UI 컴포넌트 개발
```bash
# Context7로 React 19 패턴 확인
/sc:analyze "React 19 best practices for Card component"

# Magic으로 컴포넌트 생성
/ui card --tailwind --animated

# Sequential로 로직 검증
/sc:analyze --think "카드 뒤집기 로직 검증"

# Playwright로 E2E 테스트
test('card flip animation works correctly')
```

### 2. 게임 엔진 디버깅
```bash
# Sequential로 상태 흐름 분석
/sc:troubleshoot "매칭 후 점수 업데이트 안됨" --trace

# Context7로 useReducer 패턴 확인
"React useReducer with complex state updates"

# Postgres로 게임 기록 확인
SELECT * FROM game_history WHERE user_id = 1;
```

### 3. 대규모 리팩토링
```bash
# Morphllm으로 타입 정의 일괄 수정
"Update all Card interface to include animation property"

# Context7로 마이그레이션 가이드 참조
"Tailwind CSS v3 to v4 migration guide"

# Playwright로 회귀 테스트
npm run test:e2e
```

---

## 성능 및 비용 고려사항

### MCP 서버 리소스 사용
| MCP | 메모리 사용 | 응답 속도 | 비용 |
|-----|------------|----------|------|
| Magic | 중간 | 빠름 | 무료 |
| Context7 | 낮음 | 매우 빠름 | 무료 |
| Playwright | 높음 | 느림 | 무료 |
| Sequential | 중간 | 중간 | 무료 |
| Morphllm | 중간 | 빠름 | 무료 |

### 권장 설정
- **개발 중**: Magic + Context7 + Sequential 활성화
- **테스트 중**: Playwright 추가 활성화
- **프로덕션 빌드**: 모든 MCP 비활성화 (불필요)

---

## 결론

**최소 필수 MCP**: Magic + Context7
**권장 전체 구성**: 위 Phase 1 + Phase 2

이 구성으로 React 19 기반 현대적 UI 개발, 공식 문서 참조, E2E 테스트, 복잡한 로직 분석이 모두 가능합니다.
