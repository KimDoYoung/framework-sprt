#!/usr/bin/env bash
#============================================================================
# init-sprt.sh - AssetERP 차세대 테스트 프로젝트 초기화 스크립트
#
# 위치: ~/bin/init-sprt.sh
# 실행: cd ~/work/framework1 && init-sprt.sh
#============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }
header(){ echo -e "\n${CYAN}${BOLD}══ $* ══${NC}\n"; }

TARGET_DIR="$(pwd)"
DEFAULT_APP_NAME="$(basename "$TARGET_DIR")"

header "AssetERP 차세대 초기 프로젝트 생성기"
echo -e "작업 대상 경로: ${BOLD}${TARGET_DIR}${NC}\n"

# ── 사전 개발 환경(Prerequisites) 점검 ─────────────────────────────────────────
check_prerequisites() {
    header "사전 개발 환경(Prerequisites) 점검"

    local has_error=0
    local has_warning=0

    # 1. Java 점검 (Java 21 LTS 필수)
    if command -v java &>/dev/null; then
        local raw_ver
        raw_ver=$(java -version 2>&1 | head -n 1)
        local ver_str
        ver_str=$(echo "$raw_ver" | sed -E 's/.*version "([^"]+)".*/\1/')
        local major_ver
        major_ver=$(echo "$ver_str" | cut -d'.' -f1)
        if [[ "$major_ver" -eq 1 ]]; then
            major_ver=$(echo "$ver_str" | cut -d'.' -f2)
        fi

        if [[ "$major_ver" -eq 21 ]]; then
            echo -e "  ${GREEN}[✓]${NC} Java       : ${BOLD}${ver_str}${NC} (Java 21 LTS 확정 버전)"
        elif [[ "$major_ver" -ge 17 ]]; then
            echo -e "  ${YELLOW}[!]${NC} Java       : ${BOLD}${ver_str}${NC} (Spring Boot 3.4 구동 가능, 프로젝트 표준: Java 21 LTS 권장)"
            has_warning=1
        else
            echo -e "  ${RED}[✗]${NC} Java       : ${BOLD}${ver_str}${NC} (Spring Boot 3.4는 Java 17 이상 필수, 본 프로젝트는 Java 21 LTS 필요)"
            has_error=1
        fi
    else
        echo -e "  ${RED}[✗]${NC} Java       : ${BOLD}미설치${NC} (Java 21 LTS 설치 필요)"
        has_error=1
    fi

    # 2. Node.js 점검 (>= v18.0.0 필수)
    if command -v node &>/dev/null; then
        local node_raw
        node_raw=$(node -v 2>/dev/null || true)
        local node_ver="${node_raw#v}"
        local node_major
        node_major=$(echo "$node_ver" | cut -d'.' -f1)

        if [[ "$node_major" -ge 18 ]]; then
            echo -e "  ${GREEN}[✓]${NC} Node.js    : ${BOLD}${node_raw}${NC} (>= v18.0.0 충족)"
        else
            echo -e "  ${RED}[✗]${NC} Node.js    : ${BOLD}${node_raw}${NC} (Vite 6 / React 19 구동을 위해 v18.0.0 이상 필요)"
            has_error=1
        fi
    else
        echo -e "  ${RED}[✗]${NC} Node.js    : ${BOLD}미설치${NC} (Node.js >= v18 설치 필요)"
        has_error=1
    fi

    # 3. NPM 점검 (프론트엔드 패키지 매니저)
    if command -v npm &>/dev/null; then
        local npm_ver
        npm_ver=$(npm -v 2>/dev/null || true)
        echo -e "  ${GREEN}[✓]${NC} NPM        : ${BOLD}v${npm_ver}${NC}"
    else
        echo -e "  ${RED}[✗]${NC} NPM        : ${BOLD}미설치${NC} (프론트엔드 패키지 매니저 필요)"
        has_error=1
    fi

    # 4. Gradle 점검 (백엔드 빌드 도구)
    if command -v gradle &>/dev/null; then
        local gradle_ver
        gradle_ver=$(gradle -v 2>&1 | grep '^Gradle ' | awk '{print $2}' || true)
        echo -e "  ${GREEN}[✓]${NC} Gradle     : ${BOLD}${gradle_ver}${NC}"
    else
        echo -e "  ${YELLOW}[!]${NC} Gradle     : ${BOLD}미설치${NC} (백엔드 빌드 시 gradle 또는 gradlew 필요)"
        has_warning=1
    fi

    # 5. Git 점검 (형상 관리 도구)
    if command -v git &>/dev/null; then
        local git_ver
        git_ver=$(git --version 2>/dev/null | awk '{print $3}' || true)
        echo -e "  ${GREEN}[✓]${NC} Git        : ${BOLD}${git_ver}${NC}"
    else
        echo -e "  ${YELLOW}[!]${NC} Git        : ${BOLD}미설치${NC} (형상 관리를 위해 설치 권장)"
        has_warning=1
    fi

    echo ""

    if [[ "$has_error" -ne 0 ]]; then
        error "필수 개발 환경이 충족되지 않아 프로젝트 초기화를 중단합니다."
        echo -e "위의 ${RED}[✗]${NC} 항목을 해결한 후 다시 실행해 주세요.\n"
        exit 1
    elif [[ "$has_warning" -ne 0 ]]; then
        warn "일부 권장 도구가 설치되어 있지 않습니다. 계속 진행합니다.\n"
    else
        info "모든 필수 개발 환경이 정상적으로 확인되었습니다.\n"
    fi
}

check_prerequisites

# ── 대화형 설정 질문 ──────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/4]${NC} 프로젝트 명칭을 입력하세요 [기본값: ${BOLD}${DEFAULT_APP_NAME}${NC}]:"
read -r INPUT_NAME
APP_NAME="${INPUT_NAME:-$DEFAULT_APP_NAME}"

echo -e "\n${YELLOW}[2/4]${NC} 사용할 UI 라이브러리를 선택하세요:"
echo "  1) Ant Design (기본값 - 엔터프라이즈 특화 고기능 컴포넌트)"
echo "  2) shadcn/ui   (Tailwind CSS + Radix UI 기반 모던 디자인 시스템)"
read -rp "선택 [1/2, 기본 1]: " UI_OPT
UI_OPT="${UI_OPT:-1}"

case "$UI_OPT" in
    2|shadcn|shadcn/ui|Shadcn)
        UI_FRAMEWORK="shadcn"
        UI_NAME="shadcn/ui"
        ;;
    *)
        UI_FRAMEWORK="antd"
        UI_NAME="Ant Design"
        ;;
esac

echo -e "\n${YELLOW}[3/4]${NC} 패키지 설치(npm install)를 지금 진행할까요?"
echo "  1) 예 (권장)"
echo "  2) 아니오 (나중에 ./fm.sh로 수동 설치)"
read -rp "선택 [1/2, 기본 1]: " INSTALL_OPT
INSTALL_OPT="${INSTALL_OPT:-1}"

echo -e "\n${YELLOW}[4/4]${NC} 프로젝트 [${BOLD}${APP_NAME}${NC}] (UI: ${BOLD}${UI_NAME}${NC}) 생성을 진행하시겠습니까? (y/n) [기본: y]:"
read -rp "확인: " CONFIRM
CONFIRM="${CONFIRM:-y}"
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    warn "초기화 작업이 취소되었습니다."
    exit 0
fi

# ── 1. 디렉토리 구조 생성 ──────────────────────────────────────────────────
header "1. 프로젝트 디렉토리 트리 생성"

mkdir -p "$TARGET_DIR/docs"
mkdir -p "$TARGET_DIR/backend/src/main/java/com/asseterp/test"
mkdir -p "$TARGET_DIR/backend/src/main/resources/static"
touch "$TARGET_DIR/backend/src/main/resources/static/.gitkeep"
mkdir -p "$TARGET_DIR/frontend/src/assets"
mkdir -p "$TARGET_DIR/frontend/public"

if [[ "$UI_FRAMEWORK" == "antd" ]]; then
    mkdir -p "$TARGET_DIR/frontend/src/components"
    mkdir -p "$TARGET_DIR/frontend/src/types"
    mkdir -p "$TARGET_DIR/frontend/src/mock"
elif [[ "$UI_FRAMEWORK" == "shadcn" ]]; then
    mkdir -p "$TARGET_DIR/frontend/src/components/ui"
    mkdir -p "$TARGET_DIR/frontend/src/lib"
fi

info "docs/, backend/, frontend/ 기본 디렉토리 생성 완료 (${UI_NAME})"

# ── 2. .gitignore 파일 생성 ────────────────────────────────────────────────
header "2. .gitignore 파일 생성"

cat << 'EOF' > "$TARGET_DIR/.gitignore"
# ==========================================
# Root .gitignore for AssetERP Project
# ==========================================

# ── Dependencies ──
node_modules/
.pnp
.pnp.js

# ── Build Outputs ──
dist/
dist-ssr/
*.local
build/
out/
bin/
/backend/src/main/resources/static/*
!/backend/src/main/resources/static/.gitkeep

# ── Environment Variables ──
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# ── Logs ──
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# ── Gradle ──
.gradle/
!gradle/wrapper/gradle-wrapper.jar

# ── IDE & Editor ──
.idea/
*.iml
*.iws
*.ipr
.vscode/
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.sublime-workspace
*.sublime-project

# ── OS & Temp Files ──
.DS_Store
Thumbs.db
*.swp
*.kate-swp
*~
EOF

info ".gitignore 파일 생성 완료"

# ── 3. 루트 README.md 생성 (프로젝트명 헤더 + 기술스택 명세 작성) ───────────
header "3. README.md 파일 생성"

if [[ "$UI_FRAMEWORK" == "antd" ]]; then
cat << EOF > "$TARGET_DIR/README.md"
# ${APP_NAME}

## 기술 스택 (TOBE — AssetERP 차세대 [Ant Design])

### Backend

| 구분 | 기술 | 확정 버전 | 라이센스 | 역할 |
|------|------|-----------|----------|------|
| **1** | **Java** | \`21 (LTS)\` | Oracle / GPLv2 (Eclipse Temurin) | 서버 사이드 언어. GXT가 요구하던 Java 1.8 제약에서 완전히 탈피, 최신 언어 기능(Records, Pattern Matching, Virtual Threads 등) 활용 가능 |
| **2** | **Spring Boot** | \`3.4.x\` | Apache-2.0 | 백엔드 프레임워크. Java 21 지원, \`jakarta.*\` 네임스페이스 전환. WAR 배포 또는 내장 톰캣 선택 가능 |
| **3** | **Spring Security** | \`6.x\` (내장형) | Apache-2.0 | 인증/인가 프레임워크. JWT 기반 토큰 인증, 메뉴별 RBAC 권한 제어. Spring Security 6 API (Lambda DSL, \`SecurityFilterChain\` Bean 방식) |
| **4** | **MyBatis** | \`mybatis-spring-boot-starter 3.0.x\` | Apache-2.0 | **기존 AssetERP SQL 매핑 자산 그대로 활용.** XML Mapper 기반 쿼리 관리, 동적 SQL, Map/DTO 자동 매핑 |
| **5** | **PostgreSQL** | \`16.x\` | PostgreSQL License (BSD-like) | **다중 사용자 동시 접근 RDBMS.** GXT 기반 다수 클라이언트 환경 지원, 풀 스캔 성능, JSONB 타입, 풀텍스트 검색 등 SQLite 대비 확장성 확보 |
| **6** | **Redis** | \`7.2.x\` | BSD-3-Clause | **인메모리 캐시 & 세션 스토어.** JWT 토큰 블랙리스트, 세션 관리, 공통 코드 캐싱, 실시간 알림 Pub/Sub 채널 |
| **7** | **JWT (jjwt)** | \`0.12.x\` | Apache-2.0 | JSON Web Token 인증. Java 21 호환, Access/Refresh Token 이중 토큰 구조, jjwt 0.12 API (\`Jwts.builder().signWith()\`) |
| **8** | **WebSocket (STOMP)** | Spring 내장 | Apache-2.0 | 실시간 양방향 통신. 운영자 공지, 대용량 업로드 진행률, 자산 상태 변경 실시간 알림. Redis Pub/Sub과 연동하여 다중 인스턴스 환경 지원 |

### Frontend

| 구분 | 기술 | 안정 버전 | 라이센스 | 역할 |
|------|------|-----------|----------|------|
| 1 | React | 19.x | MIT | UI 컴포넌트 라이브러리. 컴포넌트 기반 아키텍처, Server Components 대응 가능 |
| 2 | Vite | 6.x | MIT | 프론트엔드 빌드 도구 및 개발 서버. 빠른 HMR, 프록시 설정, 프로덕션 번들링 |
| 3 | React Router | 7.x | MIT | 클라이언트 사이드 라우팅. SPA 페이지 전환, 중첩 라우트, 메뉴 권한 연동 라우트 가드 |
| 4 | TypeScript | 5.x | Apache-2.0 | 정적 타입 시스템. 자산/ERP 데이터 타입 안정성, API 응답 타입 자동 생성 연동 |
| 5 | Ant Design | 5.x | MIT | **메인 UI 컴포넌트 라이브러리.** Form, Table, Tree, Modal, Drawer, Tabs 등 ERP 화면에 최적화된 풍부한 컴포넌트. CSS-in-JS 기반 테마 커스터마이징 |
| 6 | AG Grid Community | 34.x | MIT | 고성능 데이터 그리드. 대용량 자산 목록 가상 스크롤, 셀 편집, 정렬, 필터링, 컬럼 고정. Ant Design Table로는 부족한 대용량 데이터 처리 보완 |
| 7 | Zustand | 5.x | MIT | 경량 전역 상태관리. 멀티 탭 자산 상태 공유, 화면 간 데이터 연동, 메뉴/권한 전역 상태 |
| 8 | React Hook Form | 7.x | MIT | 고성능 폼 상태관리. Ant Design \`Form.Item\`과 \`Controller\` 연동, 복잡한 자산 등록/수정 폼 처리 |
| 9 | Zod | 3.x | MIT | 스키마 기반 유효성 검증. TypeScript 타입 추론과 런타임 검증 통합, 폼 검증 규칙 정의 |
| 10 | axios | 1.x | MIT | HTTP 클라이언트. 인터셉터 기반 JWT 토큰 자동 첨부, 토큰 만료 시 자동 갱신, 공통 에러 처리 |
| 11 | TanStack Query | 5.x | MIT | 서버 상태 관리. API 캐싱, 자동 리페치, 뮤테이션, 낙관적 업데이트. MyBatis 기반 REST API와 연동 |
| 12 | @milkdown/crepe | 7.x | MIT | Markdown WYSIWYG 에디터. 게시판/메뉴얼 콘텐츠 작성, 마크다운 파싱 |
| 13 | dayjs | 1.x | MIT | 날짜 처리. Ant Design v5 내장 의존성, 자산 만료일/계약일 등 날짜 포맷 처리 |

---

## 스크립트 가이드
- 백엔드 실행/컴파일: \`./bm.sh\`
- 프론트엔드 실행/컴파일: \`./fm.sh\`
- 배포 패키징: \`./deploy.sh\`
EOF
else
cat << EOF > "$TARGET_DIR/README.md"
# ${APP_NAME}

## 기술 스택 (TOBE — AssetERP 차세대 [shadcn/ui])

### Backend

| 구분 | 기술 | 확정 버전 | 라이센스 | 역할 |
|------|------|-----------|----------|------|
| **1** | **Java** | \`21 (LTS)\` | Oracle / GPLv2 (Eclipse Temurin) | 서버 사이드 언어. GXT가 요구하던 Java 1.8 제약에서 완전히 탈피, 최신 언어 기능(Records, Pattern Matching, Virtual Threads 등) 활용 가능 |
| **2** | **Spring Boot** | \`3.4.x\` | Apache-2.0 | 백엔드 프레임워크. Java 21 지원, \`jakarta.*\` 네임스페이스 전환. WAR 배포 또는 내장 톰캣 선택 가능 |
| **3** | **Spring Security** | \`6.x\` (내장형) | Apache-2.0 | 인증/인가 프레임워크. JWT 기반 토큰 인증, 메뉴별 RBAC 권한 제어. Spring Security 6 API (Lambda DSL, \`SecurityFilterChain\` Bean 방식) |
| **4** | **MyBatis** | \`mybatis-spring-boot-starter 3.0.x\` | Apache-2.0 | **기존 AssetERP SQL 매핑 자산 그대로 활용.** XML Mapper 기반 쿼리 관리, 동적 SQL, Map/DTO 자동 매핑 |
| **5** | **PostgreSQL** | \`16.x\` | PostgreSQL License (BSD-like) | **다중 사용자 동시 접근 RDBMS.** GXT 기반 다수 클라이언트 환경 지원, 풀 스캔 성능, JSONB 타입, 풀텍스트 검색 등 SQLite 대비 확장성 확보 |
| **6** | **Redis** | \`7.2.x\` | BSD-3-Clause | **인메모리 캐시 & 세션 스토어.** JWT 토큰 블랙리스트, 세션 관리, 공통 코드 캐싱, 실시간 알림 Pub/Sub 채널 |
| **7** | **JWT (jjwt)** | \`0.12.x\` | Apache-2.0 | JSON Web Token 인증. Java 21 호환, Access/Refresh Token 이중 토큰 구조, jjwt 0.12 API (\`Jwts.builder().signWith()\`) |
| **8** | **WebSocket (STOMP)** | Spring 내장 | Apache-2.0 | 실시간 양방향 통신. 운영자 공지, 대용량 업로드 진행률, 자산 상태 변경 실시간 알림. Redis Pub/Sub과 연동하여 다중 인스턴스 환경 지원 |

### Frontend

| 구분 | 기술 | 안정 버전 | 라이센스 | 역할 |
|------|------|-----------|----------|------|
| 1 | React | 19.x | MIT | UI 컴포넌트 라이브러리. 컴포넌트 기반 아키텍처, Server Components 대응 가능 |
| 2 | Vite | 6.x | MIT | 프론트엔드 빌드 도구 및 개발 서버. 빠른 HMR, 프록시 설정, 프로덕션 번들링 |
| 3 | React Router | 7.x | MIT | 클라이언트 사이드 라우팅. SPA 페이지 전환, 중첩 라우트, 메뉴 권한 연동 라우트 가드 |
| 4 | TypeScript | 5.x | Apache-2.0 | 정적 타입 시스템. 자산/ERP 데이터 타입 안정성, API 응답 타입 자동 생성 연동 |
| 5 | shadcn/ui | 최신 | MIT | **메인 UI 컴포넌트 라이브러리.** Radix UI와 Tailwind CSS 기반 재사용 컴포넌트. 고성능, 무한한 커스터마이징 자유도 및 현대적인 디자인 시스템 |
| 6 | Tailwind CSS | 3.4.x | MIT | 유틸리티 퍼스트 CSS 프레임워크. 고속 스타일링 및 디자인 시스템 토큰/테마 관리 |
| 7 | Lucide React | 최신 | ISC | 모던 오픈소스 아이콘 라이브러리. 가볍고 일관된 UI 아이콘 제공 |
| 8 | AG Grid Community | 34.x | MIT | 고성능 데이터 그리드. 대용량 자산 목록 가상 스크롤, 셀 편집, 정렬, 필터링, 컬럼 고정. 대용량 ERP 데이터 처리 최적화 |
| 9 | Zustand | 5.x | MIT | 경량 전역 상태관리. 멀티 탭 자산 상태 공유, 화면 간 데이터 연동, 메뉴/권한 전역 상태 |
| 10 | React Hook Form | 7.x | MIT | 고성능 폼 상태관리. shadcn/ui 폼 컴포넌트와 연동, 복잡한 자산 등록/수정 폼 처리 |
| 11 | Zod | 3.x | MIT | 스키마 기반 유효성 검증. TypeScript 타입 추론과 런타임 검증 통합, 폼 검증 규칙 정의 |
| 12 | axios | 1.x | MIT | HTTP 클라이언트. 인터셉터 기반 JWT 토큰 자동 첨부, 토큰 만료 시 자동 갱신, 공통 에러 처리 |
| 13 | TanStack Query | 5.x | MIT | 서버 상태 관리. API 캐싱, 자동 리페치, 뮤테이션, 낙관적 업데이트. MyBatis 기반 REST API와 연동 |
| 14 | @milkdown/crepe | 7.x | MIT | Markdown WYSIWYG 에디터. 게시판/메뉴얼 콘텐츠 작성, 마크다운 파싱 |
| 15 | dayjs | 1.x | MIT | 날짜 처리. 자산 만료일/계약일 등 날짜 포맷 처리 |

---

## 스크립트 가이드
- 백엔드 실행/컴파일: \`./bm.sh\`
- 프론트엔드 실행/컴파일: \`./fm.sh\`
- 배포 패키징: \`./deploy.sh\`
EOF
fi

info "README.md 생성 완료: # ${APP_NAME} (${UI_NAME})"

cat << EOF > "$TARGET_DIR/docs/README.md"
# ${APP_NAME} Documentation

문서 디렉토리입니다. 아키텍처 및 상세 설계 문서를 이곳에 보관합니다.
EOF

# ── 4. Frontend 파일 구성 ──────────────────────────────────────────────────
header "4. 프론트엔드 기본 코드 및 설정 생성 (${UI_NAME})"

if [[ "$UI_FRAMEWORK" == "antd" ]]; then
    # --- Ant Design Frontend ---
    cat << EOF > "$TARGET_DIR/frontend/package.json"
{
  "name": "${APP_NAME}-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@ant-design/icons": "^5.6.0",
    "@ant-design/pro-components": "^2.8.10",
    "ag-grid-community": "^36.1.0",
    "ag-grid-react": "^36.1.0",
    "antd": "^5.24.0",
    "dayjs": "^1.11.13",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/vite.config.ts"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
EOF

    cat << EOF > "$TARGET_DIR/frontend/index.html"
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${APP_NAME} - Ant Design Prototype</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f5;">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/main.tsx"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={koKR} theme={{ token: { colorPrimary: '#1677ff' } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/types/index.ts"
export interface MenuItem {
  code: string;
  title: string;
  group?: string;
  badge?: string;
}

export interface MenuGroup {
  groupCode: string;
  groupTitle: string;
  items: MenuItem[];
}

export interface FirstLevelMenu {
  id: string;
  title: string;
  iconName: string;
  groups: MenuGroup[];
}

export interface EmployeeStatus {
  id: string;
  name: string;
  position: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  dept?: string;
}

export interface ScheduleItem {
  id: string;
  category: string;
  title: string;
  registrant: string;
  dueDate: string;
  processedDate: string;
  detail: string;
}

export interface DayListItem {
  id: string;
  workType: string;
  regDueDate: string;
  title: string;
  completedDate: string;
  manager: string;
  detail: string;
}

export interface ApprovalItem {
  id: string;
  status: string;
  regDate: string;
  title: string;
  applicant: string;
  detail: string;
}

export interface ComplianceItem {
  id: string;
  category: string;
  dueDate: string;
  title: string;
  detail: string;
}

export interface LargeAssetItem {
  id: number;
  assetNo: string;
  name: string;
  category: string;
  dept: string;
  manager: string;
  status: '정상' | '수리중' | '폐기예정' | '대여중';
  acquireDate: string;
  price: number;
  location: string;
  complianceChecked: boolean;
}

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/mock/data.ts"
import { FirstLevelMenu, EmployeeStatus, ScheduleItem, DayListItem, ApprovalItem, ComplianceItem, LargeAssetItem } from '../types';

export const firstLevelMenus: FirstLevelMenu[] = [
  {
    id: 'doc',
    title: '문서작성',
    iconName: 'FileTextOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 문서기안',
        items: [
          { code: '1101', title: '일반 기안서 작성' },
          { code: '1102', title: '비용 품의서 작성' },
          { code: '1103', title: '자산 취득 품의서' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 문서보관함',
        items: [
          { code: '1110', title: '결재 진행 문서함' },
          { code: '1111', title: '완료 문서함' },
          { code: '1112', title: '반려 문서함' },
        ],
      },
    ],
  },
  {
    id: 'duty',
    title: '책무',
    iconName: 'AuditOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 대시보드',
        items: [
          { code: '1495', title: '책무점검 현황' },
          { code: '1496', title: '책무진행 상태' },
          { code: '1497', title: '책무마감 검증' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 기본정보',
        items: [
          { code: '1411', title: '임원 등록' },
          { code: '1412', title: '책무 등록' },
          { code: '1413', title: '관리의무 등록' },
          { code: '1415', title: '회의체 등록' },
          { code: '1414', title: '직책 등록' },
          { code: '1454', title: '책무담당자 등록' },
          { code: '1463', title: '직책별 부서승인선 등록' },
        ],
      },
      {
        groupCode: '02',
        groupTitle: '02. 책무구조도',
        items: [
          { code: '1417', title: '임원별 직책배정' },
          { code: '1418', title: '임원별 책무기술서' },
          { code: '1419', title: '책무체계도' },
          { code: '1480', title: '책무구조도 제출' },
        ],
      },
      {
        groupCode: '03',
        groupTitle: '03. 부서책무매뉴얼',
        items: [
          { code: '1420', title: '매뉴얼 작업대상 선정' },
          { code: '1421', title: '매뉴얼 부서지정' },
          { code: '1422', title: '매뉴얼(점검항목) 작성' },
          { code: '1423', title: '매뉴얼 보고(부서별)' },
          { code: '1424', title: '매뉴얼 관리(관리자)' },
        ],
      },
    ],
  },
  {
    id: 'compliance',
    title: '준법감시',
    iconName: 'SafetyCertificateOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 컴플라이언스 현황',
        items: [
          { code: '1501', title: '준법통제 점검현황' },
          { code: '1502', title: '법규준수 평가보고' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 내부통제 점검',
        items: [
          { code: '1511', title: '상시모니터링 항목' },
          { code: '1512', title: '점검결과 조치내역' },
        ],
      },
    ],
  },
  {
    id: 'schedule',
    title: '스케줄',
    iconName: 'CalendarOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 일정 관리',
        items: [
          { code: '1601', title: '전사 공유 캘린더' },
          { code: '1602', title: '부서별 업무 스케줄' },
          { code: '1603', title: '회의실 및 자원 예약' },
        ],
      },
    ],
  },
  {
    id: 'management',
    title: '경영관리',
    iconName: 'IdcardOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 자산 관리 (AgGrid 대용량)',
        items: [
          { code: '1701', title: '대용량 자산 마스터 (AgGrid 10,000건+)', badge: '대용량' },
          { code: '1702', title: '자산 취득 및 이동 관리' },
          { code: '1703', title: '정기 재물조사 현황' },
        ],
      },
      {
        groupCode: '01',
        groupTitle: '01. 인사/조직',
        items: [
          { code: '1711', title: '임직원 마스터 정보' },
          { code: '1712', title: '부서 및 조직도 개편' },
        ],
      },
    ],
  },
  {
    id: 'request',
    title: '신청',
    iconName: 'FormOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 행정 신청',
        items: [
          { code: '1801', title: '연차 및 근태 신청' },
          { code: '1802', title: '출장 및 여비 정산' },
          { code: '1803', title: 'IT장비/소프트웨어 신청' },
        ],
      },
    ],
  },
  {
    id: 'community',
    title: '커뮤니티',
    iconName: 'TeamOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. 사내 소통',
        items: [
          { code: '1901', title: '사내 공지사항' },
          { code: '1902', title: '자유게시판' },
          { code: '1903', title: '사내 제안마당' },
        ],
      },
    ],
  },
  {
    id: 'kfs',
    title: 'KFS',
    iconName: 'AppstoreOutlined',
    groups: [
      {
        groupCode: '00',
        groupTitle: '00. KFS 금융시스템',
        items: [
          { code: '2001', title: '금융자산 평가 현황' },
          { code: '2002', title: '펀드/신탁 포트폴리오' },
          { code: '2003', title: '대용량 거래내역 (AgGrid)', badge: '대용량' },
        ],
      },
    ],
  },
];

export const employeeList: EmployeeStatus[] = [
  { id: '1', name: '박동진', position: '사장', status: 'busy', dept: '경영진' },
  { id: '2', name: '배주한', position: '상무', status: 'busy', dept: '금융영업본부' },
  { id: '3', name: '정영주', position: '상무', status: 'busy', dept: '리스크관리본부' },
  { id: '4', name: '김상환', position: '상무', status: 'online', dept: '자산운용본부' },
  { id: '5', name: '이용희', position: '전무', status: 'online', dept: '기획조정실' },
  { id: '6', name: '김대정', position: '상무', status: 'online', dept: '준법감시실' },
  { id: '7', name: '김득수', position: '이사', status: 'online', dept: 'IT정보전략실' },
  { id: '8', name: '나필순', position: '상무', status: 'online', dept: '재무회계본부' },
  { id: '9', name: '천영임', position: '부장', status: 'online', dept: '자산수탁팀' },
  { id: '10', name: '한송이', position: '차장', status: 'busy', dept: '컴플라이언스팀' },
  { id: '11', name: '김승주', position: '차장', status: 'online', dept: 'IT개발실' },
  { id: '12', name: '정가해', position: '과장', status: 'busy', dept: '인사총무팀' },
  { id: '13', name: '김도영', position: '이사', status: 'online', dept: 'IT개발실' },
];

export const mockScheduleList: ScheduleItem[] = [
  {
    id: 's1',
    category: '부서일정',
    title: '[책무구조도] 3분기 임원별 관리의무 및 직책배정 최종 검증',
    registrant: '김도영',
    dueDate: '2026-09-16 18:00',
    processedDate: '진행중',
    detail: '보기',
  },
  {
    id: 's2',
    category: '부서일정',
    title: 'IT 인프라 자산 실사 및 라이선스 갱신 품의',
    registrant: '김승주',
    dueDate: '2026-09-18 15:00',
    processedDate: '대기',
    detail: '보기',
  },
  {
    id: 's3',
    category: '자리비움',
    title: '금융감독원 업무보고 세미나 참석',
    registrant: '김도영',
    dueDate: '2026-09-16 17:00',
    processedDate: '완료',
    detail: '보기',
  },
];

export const mockDayList: DayListItem[] = [
  {
    id: 'd1',
    workType: '책무관리',
    regDueDate: '2026-09-17',
    title: '2026년 하반기 내부통제위원회 회의체 안건 등록',
    completedDate: '-',
    manager: '김대정 상무',
    detail: '상세',
  },
  {
    id: 'd2',
    workType: '전산자산',
    regDueDate: '2026-09-17',
    title: 'IDC 노후 스위치 장비 교체 및 자산 불용 처리',
    completedDate: '-',
    manager: '김도영 이사',
    detail: '상세',
  },
  {
    id: 'd3',
    workType: '법규준수',
    regDueDate: '2026-09-17',
    title: '금융소비자보호법 개정안 반영 매뉴얼 점검보고',
    completedDate: '-',
    manager: '한송이 차장',
    detail: '상세',
  },
];

export const mockApprovalList: ApprovalItem[] = [
  {
    id: 'a1',
    status: '결재대기',
    regDate: '2026-09-16',
    title: '[품의] 2026년 차세대 AssetERP 클라우드 서버 증설 요청 건',
    applicant: '김승주 차장',
    detail: '결재',
  },
  {
    id: 'a2',
    status: '검토중',
    regDate: '2026-09-15',
    title: '[보고] 책무구조도 임원별 업무범위 기술서 제출 승인',
    applicant: '김도영 이사',
    detail: '검토',
  },
];

export const mockComplianceList: ComplianceItem[] = [
  {
    id: 'c1',
    category: '외감법공시',
    dueDate: '2026-09-30',
    title: '2026년도 3분기 외부감사인 중간보고 및 내부회계관리제도 점검',
    detail: '열람',
  },
  {
    id: 'c2',
    category: '금융규정',
    dueDate: '2026-10-15',
    title: '지배구조법 개정에 따른 책무구조도 금융위원회 정기 제출 안내',
    detail: '열람',
  },
  {
    id: 'c3',
    category: '보안지침',
    dueDate: '2026-09-25',
    title: '전자금융감독규정 준수를 위한 개인정보 단말기 보안 일제 점검',
    detail: '열람',
  },
];

// 10,000건 이상의 고성능 대용량 데이터 생성기 (AgGrid 가상 스크롤 테스트용)
export function generateLargeAssetData(count: number = 10000): LargeAssetItem[] {
  const categories = ['IT전산장비', '네트워크서버', '사무가구', '업무용차량', '소프트웨어라이선스', '연구개발장비'];
  const depts = ['IT개발실', '자산운용팀', '기획조정실', '컴플라이언스팀', '재무회계팀', '금융영업부', '리스크관리팀'];
  const managers = ['김도영', '김승주', '박동진', '배주한', '정영주', '김상환', '이용희', '천영임', '한송이'];
  const statuses: ('정상' | '수리중' | '폐기예정' | '대여중')[] = ['정상', '정상', '정상', '수리중', '정상', '폐기예정', '대여중'];
  const locations = ['본사 12F 대회의실', '본사 8F IT전산실', 'IDC 가산센터 R-3', '본사 10F 금융사업부', 'IDC 상암센터 Rack-12', '본사 7F'];

  const items: LargeAssetItem[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const num = i + 1;
    const cat = categories[i % categories.length];
    const dept = depts[i % depts.length];
    const manager = managers[i % managers.length];
    const status = statuses[i % statuses.length];
    const loc = locations[i % locations.length];

    const year = 2022 + (i % 5);
    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');
    const price = Math.round((500000 + ((i * 137) % 15000000)) / 10000) * 10000;

    items[i] = {
      id: num,
      assetNo: `AST-${year}-${String(num).padStart(6, '0')}`,
      name: `${cat === 'IT전산장비' ? 'Apple MacBook Pro / ThinkPad X1' : cat === '네트워크서버' ? 'Dell PowerEdge R750 / Cisco Nexus' : cat === '사무가구' ? 'Herman Miller Aeron Chair' : cat === '소프트웨어라이선스' ? 'JetBrains All Products / Oracle DB' : '업무용 법인 자산'} #${num}`,
      category: cat,
      dept,
      manager,
      status,
      acquireDate: `${year}-${month}-${day}`,
      price,
      location: loc,
      complianceChecked: i % 3 === 0,
    };
  }
  return items;
}

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/TopBar.tsx"
import React from 'react';
import { Input, Avatar, Dropdown, MenuProps, Tooltip } from 'antd';
import {
  SearchOutlined,
  BulbOutlined,
  UserOutlined,
  DownOutlined,
  RobotOutlined,
  MessageOutlined,
  SendOutlined,
  SoundOutlined,
  SettingOutlined,
  PoweroffOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

interface TopBarProps {
  onSearch?: (term: string) => void;
  sidebarPinned: boolean;
  onToggleSidebarPin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSearch,
  sidebarPinned,
  onToggleSidebarPin,
}) => {
  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '내 정보 수정' },
    { key: 'setting', icon: <SettingOutlined />, label: '개인 환경설정' },
    { type: 'divider' },
    { key: 'logout', icon: <PoweroffOutlined />, label: '로그아웃', danger: true },
  ];

  return (
    <header
      style={{
        height: 50,
        background: 'linear-gradient(90deg, #1872b7 0%, #1782c5 45%, #009ab8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        position: 'relative',
      }}
    >
      {/* Left section: Logo, Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          onClick={onToggleSidebarPin}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            userSelect: 'none',
          }}
          title={sidebarPinned ? '메뉴 고정 해제' : '메뉴 고정'}
        >
          {sidebarPinned ? (
            <MenuFoldOutlined style={{ fontSize: 18, color: '#fff' }} />
          ) : (
            <MenuUnfoldOutlined style={{ fontSize: 18, color: '#fff' }} />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, userSelect: 'none' }}>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>
            Asset-ERP
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
            All-in-One System
          </span>
          <UnorderedListOutlined style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginLeft: 2 }} />
        </div>

        {/* Rounded pill search bar matching main1.png */}
        <div style={{ marginLeft: 16 }}>
          <Input
            placeholder="화면번호/메뉴명/기능설명"
            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
            allowClear
            onChange={(e) => onSearch?.(e.target.value)}
            style={{
              width: 250,
              borderRadius: 20,
              fontSize: 12,
              background: '#fff',
              border: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
            }}
          />
        </div>
      </div>

      {/* Right section: Help, User, Messenger/Tool icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Tooltip title="온라인 도움말 / 아이디어 제안">
          <BulbOutlined
            style={{
              fontSize: 18,
              cursor: 'pointer',
              color: '#fff',
              transition: 'transform 0.2s',
            }}
          />
        </Tooltip>

        {/* User Profile dropdown */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              userSelect: 'none',
            }}
          >
            <Avatar
              size={26}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)', color: '#fff' }}
              icon={<UserOutlined />}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>IT개발실 김도영님</span>
            <DownOutlined style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }} />
          </div>
        </Dropdown>

        {/* Tool action icons from screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderLeft: '1px solid rgba(255,255,255,0.25)', paddingLeft: 14 }}>
          <Tooltip title="AI 어시스턴트 (Beta)">
            <RobotOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="사내 메신저">
            <MessageOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="업무 전송 / 쪽지">
            <SendOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="사내 공지사항">
            <SoundOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="사용자 정보">
            <UserOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="시스템 설정">
            <SettingOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
          <Tooltip title="로그아웃">
            <PoweroffOutlined style={{ fontSize: 17, cursor: 'pointer', color: '#fff' }} />
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/LeftSidebar.tsx"
import React, { useState } from 'react';
import { Checkbox, Tag } from 'antd';
import {
  FileTextOutlined,
  AuditOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  IdcardOutlined,
  FormOutlined,
  TeamOutlined,
  AppstoreOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { FirstLevelMenu, MenuItem } from '../types';
import { firstLevelMenus } from '../mock/data';

interface LeftSidebarProps {
  activeMenuId: string | null;
  onSelectFirstLevel: (menuId: string) => void;
  onSelectMenuItem: (item: MenuItem, parentMenu: FirstLevelMenu) => void;
  pinned: boolean;
  onTogglePin: (pinned: boolean) => void;
  selectedSubMenuCode?: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeMenuId,
  onSelectFirstLevel,
  onSelectMenuItem,
  pinned,
  onTogglePin,
  selectedSubMenuCode,
}) => {
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  const renderIcon = (iconName: string, active: boolean) => {
    const style = { fontSize: 20, color: active ? '#1a1a1a' : '#abb4c4', marginBottom: 4 };
    switch (iconName) {
      case 'FileTextOutlined':
        return <FileTextOutlined style={style} />;
      case 'AuditOutlined':
        return <AuditOutlined style={style} />;
      case 'SafetyCertificateOutlined':
        return <SafetyCertificateOutlined style={style} />;
      case 'CalendarOutlined':
        return <CalendarOutlined style={style} />;
      case 'IdcardOutlined':
        return <IdcardOutlined style={style} />;
      case 'FormOutlined':
        return <FormOutlined style={style} />;
      case 'TeamOutlined':
        return <TeamOutlined style={style} />;
      case 'AppstoreOutlined':
        return <AppstoreOutlined style={style} />;
      default:
        return <AppstoreOutlined style={style} />;
    }
  };

  const activeMenuObj = firstLevelMenus.find((m) => m.id === activeMenuId);

  return (
    <div style={{ display: 'flex', height: '100%', zIndex: 900 }}>
      {/* ── 1단계: 아이콘 바 (Dark Sidebar, 64px) ── */}
      <div
        style={{
          width: 64,
          backgroundColor: '#1f2430',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 8,
          borderRight: '1px solid #151a24',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {firstLevelMenus.map((menu) => {
          const isActive = activeMenuId === menu.id;
          return (
            <div
              key={menu.id}
              onClick={() => onSelectFirstLevel(menu.id)}
              style={{
                width: 54,
                height: 58,
                margin: '3px 0',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#1a1a1a' : '#a9b3c4',
                transition: 'all 0.15s ease',
              }}
              title={menu.title}
            >
              {renderIcon(menu.iconName, isActive)}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: -0.5,
                  color: isActive ? '#1a1a1a' : '#cbd3e0',
                }}
              >
                {menu.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 2단계 / 3단계: 서브메뉴 패널 (230px, White & Clean) ── */}
      {activeMenuObj && (
        <div
          style={{
            width: 230,
            backgroundColor: '#ffffff',
            borderRight: '1px solid #d9dfe8',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: pinned ? 'none' : '4px 0 16px rgba(0,0,0,0.12)',
            flexShrink: 0,
            zIndex: 950,
          }}
        >
          {/* Submenu Header/Groups */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0',
            }}
          >
            {activeMenuObj.groups.map((group) => (
              <div key={group.groupCode} style={{ marginBottom: 12 }}>
                {/* Group Title Header */}
                <div
                  style={{
                    backgroundColor: '#eef2f8',
                    color: '#2a3b5c',
                    fontWeight: 700,
                    fontSize: 12 + fontSizeOffset,
                    padding: '6px 14px',
                    borderTop: '1px solid #e1e7f0',
                    borderBottom: '1px solid #e1e7f0',
                  }}
                >
                  {group.groupTitle}
                </div>

                {/* Group Items */}
                <div style={{ padding: '4px 0' }}>
                  {group.items.map((item) => {
                    const isItemSelected = selectedSubMenuCode === item.code;
                    return (
                      <div
                        key={item.code}
                        onClick={() => onSelectMenuItem(item, activeMenuObj)}
                        style={{
                          padding: '6px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: 12 + fontSizeOffset,
                          color: isItemSelected ? '#1677ff' : '#4a5568',
                          fontWeight: isItemSelected ? 600 : 400,
                          backgroundColor: isItemSelected ? '#e6f4ff' : 'transparent',
                          transition: 'background-color 0.12s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isItemSelected) {
                            e.currentTarget.style.backgroundColor = '#f7fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isItemSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#8c9ba5', fontSize: 11, fontFamily: 'monospace' }}>
                            {item.code}
                          </span>
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Tag color="cyan" style={{ fontSize: 10, margin: 0, padding: '0 4px' }}>
                            {item.badge}
                          </Tag>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Controls: Zoom (+, -) and Pin (고정) as seen in main2.png */}
          <div
            style={{
              height: 38,
              borderTop: '1px solid #e5e9f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: 12,
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.min(prev + 1, 3))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 22,
                  height: 22,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="글꼴 확대"
              >
                <PlusOutlined style={{ fontSize: 10 }} />
              </button>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.max(prev - 1, -2))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 22,
                  height: 22,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="글꼴 축소"
              >
                <MinusOutlined style={{ fontSize: 10 }} />
              </button>
            </div>

            <Checkbox
              checked={pinned}
              onChange={(e) => onTogglePin(e.target.checked)}
              style={{ fontSize: 12, fontWeight: 500, color: '#4b5563' }}
            >
              고정
            </Checkbox>
          </div>
        </div>
      )}
    </div>
  );
};

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/RightMessengerSidebar.tsx"
import React, { useState } from 'react';
import { Input, Avatar, Tooltip } from 'antd';
import {
  UserOutlined,
  InfoCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { employeeList } from '../mock/data';

export const RightMessengerSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'busy'>('all');

  const filteredEmployees = employeeList.filter((emp) => {
    const matchesSearch =
      emp.name.includes(searchTerm) ||
      emp.position.includes(searchTerm) ||
      (emp.dept && emp.dept.includes(searchTerm));

    if (statusFilter === 'online') return matchesSearch && emp.status === 'online';
    if (statusFilter === 'busy') return matchesSearch && emp.status === 'busy';
    return matchesSearch;
  });

  return (
    <div
      style={{
        width: 190,
        backgroundColor: '#f8fafc',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
      }}
    >
      {/* Employee List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 8px',
        }}
      >
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              margin: '3px 0',
              borderRadius: 6,
              backgroundColor: '#ffffff',
              border: '1px solid #eef2f7',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#eef2f7';
            }}
          >
            {/* Avatar with info icon badge */}
            <div style={{ position: 'relative' }}>
              <Avatar
                size={30}
                style={{ backgroundColor: '#94a3b8', color: '#fff' }}
                icon={<UserOutlined />}
              />
              <InfoCircleFilled
                style={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  fontSize: 11,
                  color: '#3b82f6',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Name and Position */}
            <div style={{ flex: 1, marginLeft: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                {emp.name} <span style={{ fontSize: 11, fontWeight: 400, color: '#64748b' }}>{emp.position}</span>
              </div>
            </div>

            {/* Status dot (Green = online, Red = busy/away) matching screenshot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: emp.status === 'online' ? '#22c55e' : '#ef4444',
                boxShadow: emp.status === 'online' ? '0 0 4px #22c55e' : '0 0 4px #ef4444',
              }}
              title={emp.status === 'online' ? '온라인 / 대화가능' : '자리비움 / 회의중'}
            />
          </div>
        ))}
      </div>

      {/* Bottom Search & Filter Bar */}
      <div
        style={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Status indicator buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Tooltip title="온라인">
            <span
              onClick={() => setStatusFilter(statusFilter === 'online' ? 'all' : 'online')}
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                cursor: 'pointer',
                opacity: statusFilter === 'busy' ? 0.3 : 1,
              }}
            />
          </Tooltip>
          <Tooltip title="자리비움">
            <span
              onClick={() => setStatusFilter(statusFilter === 'busy' ? 'all' : 'busy')}
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                cursor: 'pointer',
                opacity: statusFilter === 'online' ? 0.3 : 1,
              }}
            />
          </Tooltip>
        </div>

        {/* Search input matching main1.png */}
        <Input
          placeholder="사원/부서명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          style={{ fontSize: 11, borderRadius: 4 }}
        />

        <Tooltip title="새로고침">
          <ReloadOutlined
            style={{ fontSize: 12, color: '#64748b', cursor: 'pointer' }}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/DashboardCalendar.tsx"
import React, { useState } from 'react';
import { Button, Space } from 'antd';
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

interface CalendarCell {
  day: number;
  isCurrentMonth: boolean;
  isSunday?: boolean;
  badge?: string;
  count?: string;
  holiday?: string;
  isSelected?: boolean;
}

interface CalendarProps {
  selectedDate: number;
  onSelectDate: (day: number) => void;
}

export const DashboardCalendar: React.FC<CalendarProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);

  // Calendar cells definition matching main1.png & main2.png
  const weeks: CalendarCell[][] = [
    // Week 1
    [
      { day: 30, isCurrentMonth: false, isSunday: true },
      { day: 31, isCurrentMonth: false },
      { day: 1, isCurrentMonth: true },
      { day: 2, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 3, isCurrentMonth: true, count: '+2 개' },
      { day: 4, isCurrentMonth: true, count: '+2 개' },
      { day: 5, isCurrentMonth: true },
    ],
    // Week 2
    [
      { day: 6, isCurrentMonth: true, isSunday: true, count: '+2 개' },
      { day: 7, isCurrentMonth: true, count: '+2 개' },
      { day: 8, isCurrentMonth: true, count: '+4 개' },
      { day: 9, isCurrentMonth: true, count: '+2 개' },
      { day: 10, isCurrentMonth: true, count: '+2 개' },
      { day: 11, isCurrentMonth: true, count: '+2 개' },
      { day: 12, isCurrentMonth: true },
    ],
    // Week 3
    [
      { day: 13, isCurrentMonth: true, isSunday: true, count: '+3 개' },
      { day: 14, isCurrentMonth: true },
      { day: 15, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 16, isCurrentMonth: true, isSelected: true, count: '+2 개' }, // 16일: 선택된 날짜
      { day: 17, isCurrentMonth: true, count: '+2 개' },
      { day: 18, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 19, isCurrentMonth: true },
    ],
    // Week 4
    [
      { day: 20, isCurrentMonth: true, isSunday: true, count: '+2 개' },
      { day: 21, isCurrentMonth: true },
      { day: 22, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 23, isCurrentMonth: true, count: '+2 개' },
      { day: 24, isCurrentMonth: true, holiday: '휴일(추석연휴)' },
      { day: 25, isCurrentMonth: true, holiday: '휴일(추석)' },
      { day: 26, isCurrentMonth: true },
    ],
    // Week 5
    [
      { day: 27, isCurrentMonth: true, isSunday: true, count: '+2 개' },
      { day: 28, isCurrentMonth: true },
      { day: 29, isCurrentMonth: true, count: '+2 개' },
      { day: 30, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 1, isCurrentMonth: false },
      { day: 2, isCurrentMonth: false },
      { day: 3, isCurrentMonth: false },
    ],
    // Week 6 (faded bottom row)
    [
      { day: 4, isCurrentMonth: false, isSunday: true },
      { day: 5, isCurrentMonth: false },
      { day: 6, isCurrentMonth: false },
      { day: 7, isCurrentMonth: false },
      { day: 8, isCurrentMonth: false },
      { day: 9, isCurrentMonth: false },
      { day: 10, isCurrentMonth: false },
    ],
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* ── Calendar Header ── */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          backgroundColor: '#fafbfc',
        }}
      >
        {/* Left: Year/Month and Quick Action Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
            {year}년 {month}월
          </span>

          <Space size={4}>
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 3 }}>🔔</span> 일정표시
            </Button>
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 3 }}>⭐</span> 북마크
            </Button>
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#ef4444', marginRight: 3 }}>📅</span> 공모주
            </Button>
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#854d0e', marginRight: 3 }}>💼</span> 출퇴근(Beta)
            </Button>
          </Space>
        </div>

        {/* Right: Navigation buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button.Group size="small">
            <Button
              icon={<DoubleLeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => setYear((y) => y - 1)}
              style={{ height: 24, padding: '0 6px' }}
            />
            <Button
              icon={<LeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => setMonth((m) => (m === 1 ? 12 : m - 1))}
              style={{ height: 24, padding: '0 6px' }}
            />
            <Button
              icon={<RightOutlined style={{ fontSize: 10 }} />}
              onClick={() => setMonth((m) => (m === 12 ? 1 : m + 1))}
              style={{ height: 24, padding: '0 6px' }}
            />
            <Button
              icon={<DoubleRightOutlined style={{ fontSize: 10 }} />}
              onClick={() => setYear((y) => y + 1)}
              style={{ height: 24, padding: '0 6px' }}
            />
          </Button.Group>

          <Button
            size="small"
            style={{ fontSize: 11, height: 24, borderRadius: 3 }}
            onClick={() => {
              setYear(2026);
              setMonth(9);
              onSelectDate(16);
            }}
          >
            오늘
          </Button>

          <Button
            size="small"
            type="primary"
            style={{ fontSize: 11, height: 24, borderRadius: 3, backgroundColor: '#1e3a5f' }}
            icon={<ReloadOutlined style={{ fontSize: 10 }} />}
          >
            새로고침
          </Button>
        </div>
      </div>

      {/* ── Calendar Table Grid ── */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
            fontSize: 12,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#dc2626', fontWeight: 600 }}>일</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>월</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>화</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>수</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>목</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>금</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#2563eb', fontWeight: 600 }}>토</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wIdx) => (
              <tr key={wIdx} style={{ height: 48, borderBottom: '1px solid #e2e8f0' }}>
                {week.map((cell, dIdx) => {
                  const isCurrent = cell.isCurrentMonth;
                  const isChosen = isCurrent && cell.day === selectedDate;
                  const dayColor = !isCurrent
                    ? '#cbd5e1'
                    : cell.isSunday
                    ? '#dc2626'
                    : dIdx === 6
                    ? '#2563eb'
                    : '#1e293b';

                  return (
                    <td
                      key={dIdx}
                      onClick={() => isCurrent && onSelectDate(cell.day)}
                      style={{
                        borderRight: '1px solid #e2e8f0',
                        padding: '4px',
                        verticalAlign: 'top',
                        backgroundColor: isChosen ? '#e06666' : isCurrent ? '#ffffff' : '#fcfcfc',
                        color: isChosen ? '#ffffff' : '#334155',
                        cursor: isCurrent ? 'pointer' : 'default',
                        position: 'relative',
                        transition: 'background-color 0.12s',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: isChosen ? 700 : 500,
                            color: isChosen ? '#ffffff' : dayColor,
                            fontSize: 12,
                          }}
                        >
                          {cell.day}
                        </span>

                        {/* Count text e.g. +2 개 */}
                        {cell.count && (
                          <span
                            style={{
                              fontSize: 10,
                              color: isChosen ? 'rgba(255,255,255,0.9)' : '#94a3b8',
                              fontWeight: 400,
                            }}
                          >
                            {cell.count}
                          </span>
                        )}
                      </div>

                      {/* Event badge pills */}
                      <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {cell.badge && (
                          <div
                            style={{
                              backgroundColor: '#1d63b8',
                              color: '#ffffff',
                              fontSize: 10,
                              padding: '1px 3px',
                              borderRadius: 3,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textAlign: 'center',
                            }}
                          >
                            {cell.badge}
                          </div>
                        )}
                        {cell.holiday && (
                          <div
                            style={{
                              backgroundColor: '#274b78',
                              color: '#ffffff',
                              fontSize: 10,
                              padding: '1px 3px',
                              borderRadius: 3,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textAlign: 'center',
                            }}
                          >
                            {cell.holiday}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/DashboardGrids.tsx"
import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
  mockScheduleList,
  mockDayList,
  mockApprovalList,
  mockComplianceList,
} from '../mock/data';
import { ScheduleItem, DayListItem, ApprovalItem, ComplianceItem } from '../types';

// Register AG Grid Community modules once
ModuleRegistry.registerModules([AllCommunityModule]);

// ── 1. 기준일 상세 일정 박스 (좌측 하단) ──
interface ScheduleBoxProps {
  selectedDay: number;
}

export const ScheduleGridBox: React.FC<ScheduleBoxProps> = ({ selectedDay }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dept' | 'away'>('dept');

  const tabs = [
    { key: 'my', label: '나의일정', count: 0 },
    { key: 'dept', label: '부서일정', count: 1 },
    { key: 'work', label: '업무활동', count: 0 },
    { key: 'alert', label: '알림', count: 0 },
    { key: 'away', label: '자리비움', count: 1 },
    { key: 'reserve', label: '예약', count: 0 },
  ];

  const filteredData = mockScheduleList.filter((item) => {
    if (activeTab === 'dept') return item.category === '부서일정';
    if (activeTab === 'away') return item.category === '자리비움';
    return true;
  });

  const columnDefs: ColDef<ScheduleItem>[] = [
    {
      field: 'category',
      headerName: '분류',
      width: 90,
      cellRenderer: (params: any) => (
        <Tag color={params.value === '부서일정' ? 'blue' : 'default'} style={{ margin: 0 }}>
          {params.value}
        </Tag>
      ),
    },
    { field: 'title', headerName: '나의일정명', flex: 1, minWidth: 220 },
    { field: 'registrant', headerName: '등록자', width: 90 },
    { field: 'dueDate', headerName: '마감일', width: 140 },
    { field: 'processedDate', headerName: '처리일', width: 85 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
          보기
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Box Header */}
      <div
        style={{
          padding: '7px 12px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#1e3a5f', fontWeight: 700, fontSize: 13 }}>
            ▶ 기준일 : 2026년 09월 {String(selectedDay).padStart(2, '0')}일
          </span>
        </div>
        <Button size="small" style={{ fontSize: 11, borderRadius: 3 }}>
          ↪ 등록 바로가기
        </Button>
      </div>

      {/* Sub Filter Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '4px 6px',
          gap: 4,
        }}
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                border: '1px solid',
                borderColor: isSelected ? '#1677ff' : '#cbd5e1',
                backgroundColor: isSelected ? '#1677ff' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                borderRadius: 3,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {tab.label} <span style={{ opacity: 0.9 }}>[{tab.count}]</span>
            </button>
          );
        })}
      </div>

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 160, width: '100%' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          headerHeight={30}
          rowHeight={30}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};

// ── 2. Day List 박스 (중앙 상단) ──
export const DayListBox: React.FC = () => {
  const [dayDate, setDayDate] = useState('2026-09-17');

  const columnDefs: ColDef<DayListItem>[] = [
    { field: 'workType', headerName: '업무구분', width: 95 },
    { field: 'regDueDate', headerName: '등록(마감)일', width: 110 },
    { field: 'title', headerName: '제목', flex: 1, minWidth: 200 },
    { field: 'completedDate', headerName: '처리(완료)일', width: 100 },
    { field: 'manager', headerName: '담당자', width: 100 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          padding: '6px 12px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>Day List</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Button
              size="small"
              icon={<LeftOutlined style={{ fontSize: 9 }} />}
              onClick={() => setDayDate('2026-09-16')}
              style={{ height: 22, padding: '0 4px' }}
            />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#334155', fontFamily: 'monospace' }}>
              {dayDate}
            </span>
            <CalendarOutlined style={{ color: '#64748b', fontSize: 13 }} />
            <Button
              size="small"
              icon={<RightOutlined style={{ fontSize: 9 }} />}
              onClick={() => setDayDate('2026-09-18')}
              style={{ height: 22, padding: '0 4px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button size="small" style={{ fontSize: 11, height: 24, borderRadius: 3 }}>
            새로고침
          </Button>
          <Button size="small" style={{ fontSize: 11, height: 24, borderRadius: 3 }}>
            바로가기
          </Button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 140, width: '100%' }}>
        <AgGridReact
          rowData={mockDayList}
          columnDefs={columnDefs}
          headerHeight={28}
          rowHeight={28}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};

// ── 3. 결재요청함 박스 (중앙 중간) ──
export const ApprovalGridBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'requested' | 'draft'>('requested');

  const tabs = [
    { key: 'pending', label: '미결함', count: 0 },
    { key: 'requested', label: '결재요청함 (완료/반려건은 최대 7일까지 표시)', count: 2 },
    { key: 'draft', label: '임시저장함', count: 0 },
  ];

  const columnDefs: ColDef<ApprovalItem>[] = [
    {
      field: 'status',
      headerName: '진행상태',
      width: 90,
      cellRenderer: (params: any) => (
        <Tag color={params.value === '결재대기' ? 'orange' : 'blue'} style={{ margin: 0 }}>
          {params.value}
        </Tag>
      ),
    },
    { field: 'regDate', headerName: '등록일', width: 100 },
    { field: 'title', headerName: '제목', flex: 1, minWidth: 220 },
    { field: 'applicant', headerName: '상신자', width: 100 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
          결재
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '4px 8px',
          gap: 6,
        }}
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                border: '1px solid',
                borderColor: isSelected ? '#1677ff' : '#cbd5e1',
                backgroundColor: isSelected ? '#1677ff' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                borderRadius: 3,
                padding: '3px 8px',
                fontSize: 11,
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {tab.label} <span style={{ opacity: 0.9 }}>[{tab.count}]</span>
            </button>
          );
        })}
      </div>

      <div className="ag-theme-alpine" style={{ height: 140, width: '100%' }}>
        <AgGridReact
          rowData={mockApprovalList}
          columnDefs={columnDefs}
          headerHeight={28}
          rowHeight={28}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};

// ── 4. 법규보고공시 및 내규정보 박스 (중앙 하단) ──
export const ComplianceGridBox: React.FC = () => {
  const columnDefs: ColDef<ComplianceItem>[] = [
    {
      field: 'category',
      headerName: '구분',
      width: 100,
      cellRenderer: (params: any) => (
        <Tag color="geekblue" style={{ margin: 0 }}>
          {params.value}
        </Tag>
      ),
    },
    { field: 'dueDate', headerName: '마감일', width: 100 },
    { field: 'title', headerName: '제목', flex: 1, minWidth: 240 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
          열람
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          padding: '6px 12px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#fafbfc',
          fontWeight: 700,
          fontSize: 13,
          color: '#1e293b',
        }}
      >
        법규보고공시 및 내규정보
      </div>

      <div className="ag-theme-alpine" style={{ height: 140, width: '100%' }}>
        <AgGridReact
          rowData={mockComplianceList}
          columnDefs={columnDefs}
          headerHeight={28}
          rowHeight={28}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/LargeDataView.tsx"
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Card, Button, Input, Select, Tag, Space, Statistic, Row, Col, message } from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { generateLargeAssetData } from '../mock/data';
import { LargeAssetItem } from '../types';

interface LargeDataViewProps {
  title?: string;
  menuCode?: string;
}

export const LargeDataView: React.FC<LargeDataViewProps> = ({
  title = '대용량 자산 마스터 관리 (AgGrid Community)',
  menuCode = '1701',
}) => {
  const gridRef = useRef<AgGridReact<LargeAssetItem>>(null);
  const [dataCount, setDataCount] = useState<number>(10000);
  const [rowData, setRowData] = useState<LargeAssetItem[]>(() => generateLargeAssetData(10000));
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleRegenerate = (count: number) => {
    setDataCount(count);
    const newData = generateLargeAssetData(count);
    setRowData(newData);
    message.success(`${count.toLocaleString()}건의 대용량 데이터가 AgGrid에 로드되었습니다.`);
  };

  const handleExportCsv = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `asset-master-${new Date().toISOString().slice(0, 10)}.csv`,
      });
      message.info('CSV 내보내기가 완료되었습니다.');
    }
  }, []);

  const stats = useMemo(() => {
    const total = rowData.length;
    let totalPrice = 0;
    let normalCount = 0;
    let repairCount = 0;
    let discardCount = 0;

    for (let i = 0; i < total; i++) {
      totalPrice += rowData[i].price;
      if (rowData[i].status === '정상') normalCount++;
      else if (rowData[i].status === '수리중') repairCount++;
      else if (rowData[i].status === '폐기예정') discardCount++;
    }

    return {
      total,
      totalPrice: (totalPrice / 100000000).toFixed(1), // 억원 단위
      normalCount,
      repairCount,
      discardCount,
    };
  }, [rowData]);

  const filteredRowData = useMemo(() => {
    if (selectedCategory === 'all') return rowData;
    return rowData.filter((item) => item.category === selectedCategory);
  }, [rowData, selectedCategory]);

  const columnDefs: ColDef<LargeAssetItem>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'No',
        width: 75,
        pinned: 'left',
        sortable: true,
      },
      {
        field: 'assetNo',
        headerName: '자산번호',
        width: 155,
        pinned: 'left',
        cellStyle: { fontFamily: 'monospace', fontWeight: 600 } as Record<string, string | number>,
        sortable: true,
        filter: true,
      },
      {
        field: 'name',
        headerName: '자산명 / 모델규격',
        width: 260,
        sortable: true,
        filter: true,
      },
      {
        field: 'category',
        headerName: '자산분류',
        width: 140,
        sortable: true,
        filter: true,
      },
      {
        field: 'dept',
        headerName: '관리부서',
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: 'manager',
        headerName: '담당자',
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        field: 'status',
        headerName: '상태',
        width: 110,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let color = 'green';
          let icon = <CheckCircleOutlined />;
          if (status === '수리중') {
            color = 'warning';
            icon = <ExclamationCircleOutlined />;
          } else if (status === '폐기예정') {
            color = 'error';
            icon = <CloseCircleOutlined />;
          } else if (status === '대여중') {
            color = 'blue';
          }
          return (
            <Tag color={color} icon={icon} style={{ margin: 0 }}>
              {status}
            </Tag>
          );
        },
      },
      {
        field: 'price',
        headerName: '취득원가 (원)',
        width: 130,
        sortable: true,
        cellStyle: { textAlign: 'right', fontFamily: 'monospace' } as Record<string, string | number>,
        valueFormatter: (params) => (params.value ? params.value.toLocaleString() : '0'),
      },
      {
        field: 'acquireDate',
        headerName: '취득일자',
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: 'location',
        headerName: '설치위치',
        width: 180,
        sortable: true,
      },
      {
        field: 'complianceChecked',
        headerName: '책무점검',
        width: 100,
        cellRenderer: (params: any) =>
          params.value ? (
            <Tag color="cyan">점검완료</Tag>
          ) : (
            <Tag color="default">미점검</Tag>
          ),
      },
    ],
    []
  );

  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* ── Summary Stats Cards ── */}
      <Row gutter={12}>
        <Col span={6}>
          <Card size="small" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
            <Statistic
              title={<span style={{ fontSize: 12, color: '#0369a1' }}>총 로드된 자산 건수 (AgGrid)</span>}
              value={stats.total}
              suffix="건"
              valueStyle={{ color: '#0284c7', fontSize: 20, fontWeight: 700 }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ backgroundColor: '#fdf4ff', borderColor: '#f5d0fe' }}>
            <Statistic
              title={<span style={{ fontSize: 12, color: '#86198f' }}>총 자산 가액 (취득가 합산)</span>}
              value={stats.totalPrice}
              suffix="억원"
              valueStyle={{ color: '#c026d3', fontSize: 20, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <Statistic
              title={<span style={{ fontSize: 12, color: '#15803d' }}>정상 가동 자산</span>}
              value={stats.normalCount}
              suffix="건"
              valueStyle={{ color: '#16a34a', fontSize: 20, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
            <Statistic
              title={<span style={{ fontSize: 12, color: '#b45309' }}>점검/수리/폐기 대상</span>}
              value={stats.repairCount + stats.discardCount}
              suffix="건"
              valueStyle={{ color: '#d97706', fontSize: 20, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── Action Toolbar ── */}
      <Card
        size="small"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
              [{menuCode}] {title}
            </span>
            <Tag color="purple" style={{ margin: 0 }}>
              가상 스크롤 60fps
            </Tag>
          </div>

          <Space size={8} wrap>
            <Input
              placeholder="빠른 통합 검색 (자산번호, 이름, 부서...)"
              prefix={<SearchOutlined />}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ width: 230 }}
              allowClear
            />

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 140 }}
              options={[
                { value: 'all', label: '전체 분류' },
                { value: 'IT전산장비', label: 'IT전산장비' },
                { value: '네트워크서버', label: '네트워크서버' },
                { value: '사무가구', label: '사무가구' },
                { value: '소프트웨어라이선스', label: '소프트웨어' },
                { value: '업무용차량', label: '업무용차량' },
              ]}
            />

            <Button.Group>
              <Button
                type={dataCount === 10000 ? 'primary' : 'default'}
                onClick={() => handleRegenerate(10000)}
                icon={<ReloadOutlined />}
              >
                1만 건 로드
              </Button>
              <Button
                type={dataCount === 30000 ? 'primary' : 'default'}
                onClick={() => handleRegenerate(30000)}
              >
                3만 건 로드
              </Button>
            </Button.Group>

            <Button icon={<DownloadOutlined />} onClick={handleExportCsv}>
              CSV 저장
            </Button>
          </Space>
        </div>
      </Card>

      {/* ── AG Grid Table (Large Dataset with Virtual Scrolling) ── */}
      <div
        className="ag-theme-alpine"
        style={{
          flex: 1,
          width: '100%',
          minHeight: 450,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <AgGridReact<LargeAssetItem>
          ref={gridRef}
          rowData={filteredRowData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          rowSelection="multiple"
          headerHeight={34}
          rowHeight={32}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          pagination={false} // Virtual DOM scrolling for extreme performance!
        />
      </div>
    </div>
  );
};

EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/App.tsx"
import { useState } from 'react';
import { Tabs } from 'antd';
import { ProLayout } from '@ant-design/pro-components';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightMessengerSidebar } from './components/RightMessengerSidebar';
import { DashboardCalendar } from './components/DashboardCalendar';
import {
  ScheduleGridBox,
  DayListBox,
  ApprovalGridBox,
  ComplianceGridBox,
} from './components/DashboardGrids';
import { LargeDataView } from './components/LargeDataView';
import { MenuItem, FirstLevelMenu } from './types';

interface OpenTab {
  key: string;
  title: string;
  code?: string;
  closable: boolean;
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState<number>(16);
  // Default active 1st level menu to 'duty' ('책무') matching main2.png
  const [activeMenuId, setActiveMenuId] = useState<string | null>('duty');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedSubMenuCode, setSelectedSubMenuCode] = useState<string>('1495');

  // Multi-tab state: starts with "My Page"
  const [activeTabKey, setActiveTabKey] = useState<string>('mypage');
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { key: 'mypage', title: 'My Page', closable: false },
  ]);

  const handleSelectFirstLevel = (menuId: string) => {
    if (activeMenuId === menuId && !sidebarPinned) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(menuId);
    }
  };

  const handleSelectMenuItem = (item: MenuItem, _parent: FirstLevelMenu) => {
    setSelectedSubMenuCode(item.code);

    const existingTab = openTabs.find((t) => t.key === item.code);
    if (!existingTab) {
      setOpenTabs((prev) => [
        ...prev,
        {
          key: item.code,
          title: `[${item.code}] ${item.title}`,
          code: item.code,
          closable: true,
        },
      ]);
    }
    setActiveTabKey(item.code);
  };

  const handleCloseTab = (targetKey: string) => {
    const newTabs = openTabs.filter((t) => t.key !== targetKey);
    setOpenTabs(newTabs);
    if (activeTabKey === targetKey) {
      setActiveTabKey(newTabs[newTabs.length - 1]?.key || 'mypage');
    }
  };

  return (
    <ProLayout
      title="Asset-ERP"
      pure
      headerRender={() => (
        <TopBar
          sidebarPinned={sidebarPinned}
          onToggleSidebarPin={() => setSidebarPinned(!sidebarPinned)}
        />
      )}
      menuRender={false}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* ── Body Container with LeftSidebar, Main Content & Messenger ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 50px)', position: 'relative' }}>
        {/* ── 2. 왼쪽 1단계 아이콘 메뉴 및 2단계/3단계 서브메뉴 ── */}
        <LeftSidebar
          activeMenuId={activeMenuId}
          onSelectFirstLevel={handleSelectFirstLevel}
          onSelectMenuItem={handleSelectMenuItem}
          pinned={sidebarPinned}
          onTogglePin={setSidebarPinned}
          selectedSubMenuCode={selectedSubMenuCode}
        />

        {/* ── Main Content Area ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#eef2f6',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {/* Breadcrumb / Tab Bar matching main1.png & main2.png */}
          <div
            style={{
              height: 34,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #d9dfe8',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              flexShrink: 0,
            }}
          >
            <Tabs
              activeKey={activeTabKey}
              onChange={setActiveTabKey}
              type="editable-card"
              hideAdd
              onEdit={(targetKey, action) => {
                if (action === 'remove' && typeof targetKey === 'string') {
                  handleCloseTab(targetKey);
                }
              }}
              size="small"
              tabBarStyle={{ margin: 0, height: 32 }}
              items={openTabs.map((tab) => ({
                key: tab.key,
                label: tab.title,
                closable: tab.closable,
              }))}
            />
          </div>

          {/* Tab View Switcher */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {activeTabKey === 'mypage' ? (
              // ── My Page: AS-IS Dashboard matching main1.png & main2.png ──
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  overflow: 'hidden',
                }}
              >
                {/* Center Dashboard (Left & Center Columns) */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 8,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(420px, 48%) minmax(460px, 52%)',
                    gap: 8,
                    alignContent: 'start',
                  }}
                >
                  {/* Left Column: Calendar + Schedule Box */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <DashboardCalendar
                      selectedDate={selectedDay}
                      onSelectDate={setSelectedDay}
                    />
                    <ScheduleGridBox selectedDay={selectedDay} />
                  </div>

                  {/* Center Column: Day List + Approvals + Compliance */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <DayListBox />
                    <ApprovalGridBox />
                    <ComplianceGridBox />
                  </div>
                </div>

                {/* Rightmost Column: Employee Organization / Messenger Status */}
                <RightMessengerSidebar />
              </div>
            ) : (
              // ── 대용량 AgGrid View ──
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <LargeDataView
                  title={openTabs.find((t) => t.key === activeTabKey)?.title}
                  menuCode={activeTabKey}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ProLayout>
  );
}

EOF

else
    # --- shadcn/ui Frontend ---
    cat << EOF > "$TARGET_DIR/frontend/package.json"
{
  "name": "${APP_NAME}-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^22.13.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/vite.config.ts"
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/tailwind.config.js"
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/postcss.config.js"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/components.json"
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
EOF

    cat << EOF > "$TARGET_DIR/frontend/index.html"
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${APP_NAME} - shadcn/ui Prototype</title>
  </head>
  <body class="bg-slate-50">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/index.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/ui/button.tsx"
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/ui/badge.tsx"
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
        warning:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/ui/card.tsx"
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/ui/table.tsx"
import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/main.tsx"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/App.tsx"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Database, LayoutGrid, RefreshCw, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface AssetRecord {
  key: string;
  assetNo: string;
  name: string;
  category: string;
  status: '정상' | '수리중' | '폐기예정';
  regDate: string;
}

const mockData: AssetRecord[] = [
  { key: '1', assetNo: 'AST-2026-001', name: 'MacBook Pro M3 Max', category: 'IT전산장비', status: '정상', regDate: '2026-01-15' },
  { key: '2', assetNo: 'AST-2026-002', name: 'Dell UltraSharp 32"', category: 'IT전산장비', status: '정상', regDate: '2026-02-01' },
  { key: '3', assetNo: 'AST-2026-003', name: 'Herman Miller Aeron', category: '사무가구', status: '수리중', regDate: '2025-11-20' },
  { key: '4', assetNo: 'AST-2026-004', name: 'Canon 복합기 C5535i', category: '사무기기', status: '폐기예정', regDate: '2023-04-12' },
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('1');

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } transition-all duration-300 bg-slate-900 text-slate-100 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!collapsed && <span className="font-bold text-lg">AssetERP Next</span>}
          {collapsed && <span className="font-bold text-base mx-auto">ERP</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setActiveMenu('1')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeMenu === '1'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database size={18} className="shrink-0" />
            {!collapsed && <span>자산 관리</span>}
          </button>
          <button
            onClick={() => setActiveMenu('2')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeMenu === '2'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutGrid size={18} className="shrink-0" />
            {!collapsed && <span>공통 코드</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">
            자산 마스터 목록 (shadcn/ui Prototype)
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw size={14} />
              새로고침
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus size={14} />
              자산 등록
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Card className="bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">자산번호</TableHead>
                    <TableHead>자산명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="w-[120px]">상태</TableHead>
                    <TableHead className="w-[140px]">취득일자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell className="font-mono font-medium">{item.assetNo}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === '정상'
                              ? 'success'
                              : item.status === '수리중'
                              ? 'warning'
                              : 'destructive'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{item.regDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
EOF

fi

# ── 5. Backend 설정 생성 ───────────────────────────────────────────────────
header "5. 백엔드 기본 설정 생성 (Spring Boot 3.4 / Java 21)"

cat << EOF > "$TARGET_DIR/backend/build.gradle"
plugins {
    id 'java'
    id 'war'
    id 'org.springframework.boot' version '3.4.3'
    id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.asseterp'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    providedRuntime 'org.springframework.boot:spring-boot-starter-tomcat'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}

bootWar {
    archiveFileName = '${APP_NAME}.war'
}
EOF

cat << EOF > "$TARGET_DIR/backend/src/main/resources/application.properties"
spring.application.name=${APP_NAME}-backend
server.port=8080
spring.application.version=0.0.1
EOF

cat << 'EOF' > "$TARGET_DIR/backend/src/main/java/com/asseterp/test/TestApplication.java"
package com.asseterp.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@SpringBootApplication
@RestController
public class TestApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(TestApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }

    @GetMapping("/api/health")
    public Map<String, Object> healthCheck() {
        return Map.of(
            "status", "UP",
            "message", "AssetERP Backend Prototype Ready",
            "javaVersion", System.getProperty("java.version")
        );
    }
}
EOF

# ── 6. bm.sh, fm.sh, deploy.sh 스크립트 작성 ──────────────────────────────
header "6. bm.sh, fm.sh, deploy.sh 스크립트 작성"

# --- bm.sh ---
cat << 'EOF' > "$TARGET_DIR/bm.sh"
#!/usr/bin/env bash
#============================================================================
# bm.sh - Backend 관리 스크립트 (run, compile 간소화 버전)
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
GRADLE_CMD="gradle"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()   { echo -e "${GREEN}[INFO]${NC}  $*"; }
header() { echo -e "\n${CYAN}${BOLD}══ $* ══${NC}\n"; }

check_tool() {
    if [[ -f "$BACKEND_DIR/gradlew" ]]; then
        GRADLE_CMD="$BACKEND_DIR/gradlew"
    elif ! command -v gradle &>/dev/null; then
        echo -e "${RED}[ERROR]${NC} gradle 또는 gradlew가 존재하지 않습니다."
        exit 1
    fi
}

do_run() {
    header "Backend - 개발 서버 실행"
    check_tool
    cd "$BACKEND_DIR"
    $GRADLE_CMD bootRun
}

do_compile() {
    header "Backend - 컴파일"
    check_tool
    cd "$BACKEND_DIR"
    $GRADLE_CMD compileJava
    info "컴파일 완료."
}

print_menu() {
    echo -e "${CYAN}${BOLD}[ Backend Manager (bm.sh) ]${NC}"
    echo "  1) run      - Spring Boot 개발 서버 실행"
    echo "  2) compile  - Java 소스 컴파일"
    echo "  q) 종료"
    echo ""
}

main() {
    local cmd="${1:-}"
    if [[ -z "$cmd" ]]; then
        print_menu
        read -rp "명령을 선택하세요: " choice
        case "$choice" in
            1|run)     do_run ;;
            2|compile) do_compile ;;
            q|Q)       exit 0 ;;
            *) echo "잘못된 입력입니다."; exit 1 ;;
        esac
    else
        case "$cmd" in
            run)     do_run ;;
            compile) do_compile ;;
            *) echo "지원하지 않는 명령어: $cmd (run, compile 만 지원)"; exit 1 ;;
        esac
    fi
}

main "$@"
EOF
chmod +x "$TARGET_DIR/bm.sh"

# --- fm.sh ---
cat << 'EOF' > "$TARGET_DIR/fm.sh"
#!/usr/bin/env bash
#============================================================================
# fm.sh - Frontend 관리 스크립트 (run, compile 간소화 버전)
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()   { echo -e "${GREEN}[INFO]${NC}  $*"; }
header() { echo -e "\n${CYAN}${BOLD}══ $* ══${NC}\n"; }

do_run() {
    header "Frontend - Vite 개발 서버 실행"
    cd "$FRONTEND_DIR"
    npm run dev
}

do_compile() {
    header "Frontend - 빌드 및 컴파일 (TypeScript + Vite)"
    cd "$FRONTEND_DIR"
    npm run build
    info "컴파일 및 빌드 완료: $FRONTEND_DIR/dist"
}

print_menu() {
    echo -e "${CYAN}${BOLD}[ Frontend Manager (fm.sh) ]${NC}"
    echo "  1) run      - Vite 개발 서버 실행 (포트 5173)"
    echo "  2) compile  - 프론트엔드 빌드 (dist 생성)"
    echo "  q) 종료"
    echo ""
}

main() {
    local cmd="${1:-}"
    if [[ -z "$cmd" ]]; then
        print_menu
        read -rp "명령을 선택하세요: " choice
        case "$choice" in
            1|run)     do_run ;;
            2|compile) do_compile ;;
            q|Q)       exit 0 ;;
            *) echo "잘못된 입력입니다."; exit 1 ;;
        esac
    else
        case "$cmd" in
            run|dev)   do_run ;;
            compile|build) do_compile ;;
            *) echo "지원하지 않는 명령어: $cmd (run, compile 만 지원)"; exit 1 ;;
        esac
    fi
}

main "$@"
EOF
chmod +x "$TARGET_DIR/fm.sh"

# --- deploy.sh ---
cat << 'EOF' > "$TARGET_DIR/deploy.sh"
#!/usr/bin/env bash
#============================================================================
# deploy.sh - 프론트엔드 빌드 산출물을 백엔드 static으로 통합 및 WAR 배포 패키징
#============================================================================
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
STATIC_DIR="$BACKEND_DIR/src/main/resources/static"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()   { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()   { echo -e "${YELLOW}[WARN]${NC}  $*"; }
header() { echo -e "\n${CYAN}${BOLD}══ $* ══${NC}\n"; }

# ── 필수 도구 사전 점검 ──
if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js 및 npm이 필요합니다 (Node.js >= 18)."
    exit 1
fi

if ! command -v java &>/dev/null; then
    echo -e "${RED}[ERROR]${NC} Java가 필요합니다 (Java 21 LTS 권장)."
    exit 1
fi

header "Step 1: 프론트엔드 빌드 (__UI_NAME__ UI)"
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    info "node_modules가 없어 패키지를 먼저 설치합니다..."
    npm install
fi
npm run build

header "Step 2: 정적 리소스 Spring Boot 내부로 복사"
rm -rf "$STATIC_DIR"/*
mkdir -p "$STATIC_DIR"
cp -r "$FRONTEND_DIR/dist"/* "$STATIC_DIR"/
info "복사 완료: $STATIC_DIR"

header "Step 3: 백엔드 빌드 및 WAR 패키징 (bootWar)"
cd "$BACKEND_DIR"

GRADLE_CMD="gradle"
if [[ -f "$BACKEND_DIR/gradlew" ]]; then
    GRADLE_CMD="$BACKEND_DIR/gradlew"
    chmod +x "$BACKEND_DIR/gradlew"
elif ! command -v gradle &>/dev/null; then
    echo -e "${RED}[ERROR]${NC} gradle 또는 gradlew가 존재하지 않습니다."
    exit 1
fi

info "기존 빌드 산출물 정리..."
$GRADLE_CMD clean

info "WAR 패키징 실행 ($GRADLE_CMD bootWar)..."
$GRADLE_CMD bootWar -x test

WAR_PATH=$(find "$BACKEND_DIR/build/libs" -name "*.war" 2>/dev/null | head -n 1)
if [[ -n "$WAR_PATH" && -f "$WAR_PATH" ]]; then
    WAR_SIZE=$(du -h "$WAR_PATH" | cut -f1)
    WAR_NAME=$(basename "$WAR_PATH")
    header "🎉 배포용 WAR 생성 성공!"
    echo -e "  - 생성 위치: ${BOLD}${GREEN}${WAR_PATH}${NC}"
    echo -e "  - 파일명:    ${BOLD}${WAR_NAME}${NC}"
    echo -e "  - 파일 크기: ${BOLD}${WAR_SIZE}${NC}"
    echo ""
    echo -e "  ${CYAN}[배포 안내]${NC}"
    echo -e "  - 외장 톰캣(Tomcat)의 ${BOLD}webapps/${NC} 폴더에 복사하거나 배포 서버로 전송할 수 있습니다."
    echo -e "  - 로컬 직접 실행 테스트: ${BOLD}java -jar ${WAR_PATH}${NC}"
else
    echo -e "${RED}[ERROR]${NC} WAR 파일 생성에 실패했습니다: $BACKEND_DIR/build/libs"
    exit 1
fi
EOF
sed -i "s|__UI_NAME__|$UI_NAME|g" "$TARGET_DIR/deploy.sh"
chmod +x "$TARGET_DIR/deploy.sh"

# ── 7. 패키지 설치 실행 분기 ───────────────────────────────────────────────
if [[ "$INSTALL_OPT" == "1" ]]; then
    header "7. 프론트엔드 의존성(npm) 설치 진행 중..."
    cd "$TARGET_DIR/frontend"
    npm install
    info "npm install 완료!"
fi

header "🎉 초기화 작업 완료!"
echo -e "생성된 프로젝트: ${BOLD}${APP_NAME}${NC}"
echo -e "  - UI 라이브러리: ${BOLD}${UI_NAME}${NC}"
echo -e "  - README.md: 기술스택 표 및 프로젝트명 기입 완료"
echo -e "  - .gitignore: 백엔드/프론트엔드/IDE 통합 제외 설정 완료"
echo -e "  - 프론트엔드: ${BOLD}./fm.sh run${NC} (http://localhost:5173)"
echo -e "  - 백엔드:     ${BOLD}./bm.sh run${NC} (http://localhost:8080)"
echo -e "  - 통합 배포:  ${BOLD}./deploy.sh${NC}"
