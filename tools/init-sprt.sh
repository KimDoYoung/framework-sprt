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
    mkdir -p "$TARGET_DIR/frontend/src/assets/icons"
    mkdir -p "$TARGET_DIR/frontend/src/assets/images"
    mkdir -p "$TARGET_DIR/frontend/src/components/common/button"
    mkdir -p "$TARGET_DIR/frontend/src/components/common/form"
    mkdir -p "$TARGET_DIR/frontend/src/components/common/grid"
    mkdir -p "$TARGET_DIR/frontend/src/components/common/modal"
    mkdir -p "$TARGET_DIR/frontend/src/components/layout"
    mkdir -p "$TARGET_DIR/frontend/src/pages/mypage/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/act/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/act/hooks"
    mkdir -p "$TARGET_DIR/frontend/src/pages/act/types"
    mkdir -p "$TARGET_DIR/frontend/src/pages/biz/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/biz/types"
    mkdir -p "$TARGET_DIR/frontend/src/pages/crm/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/crm/types"
    mkdir -p "$TARGET_DIR/frontend/src/pages/emp/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/emp/types"
    mkdir -p "$TARGET_DIR/frontend/src/pages/fnd/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/fnd/types"
    mkdir -p "$TARGET_DIR/frontend/src/pages/rpt/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/rpt/types"
    mkdir -p "$TARGET_DIR/frontend/src/pages/sys/components"
    mkdir -p "$TARGET_DIR/frontend/src/pages/sys/types"
    mkdir -p "$TARGET_DIR/frontend/src/services/biz"
    mkdir -p "$TARGET_DIR/frontend/src/types"
    mkdir -p "$TARGET_DIR/frontend/src/utils"
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
    "flexlayout-react": "^0.11.0",
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

    cat << 'EOF' > "$TARGET_DIR/frontend/src/flexlayout-custom.css"
@import 'flexlayout-react/style/light.css';

/* ── Ant Design Theme Tuning for FlexLayout ── */
.flexlayout__layout {
  --flexlayout-color-background: #eef2f6;
  --flexlayout-color-tabset-background: #ffffff;
  --flexlayout-color-tabset-background-selected: #ffffff;
  --flexlayout-color-tab-selected-background: #ffffff;
  --flexlayout-color-tab-selected: #1677ff;
  --flexlayout-color-tab-unselected-background: #f8fafc;
  --flexlayout-color-tab-unselected: #64748b;
  --flexlayout-color-focus: #1677ff;
  --flexlayout-color-drag1: #1677ff;
  --flexlayout-color-drag1-background: rgba(22, 119, 255, 0.16);
  --flexlayout-color-splitter: #d9dfe8;
  --flexlayout-color-splitter-hover: #1677ff;
  --flexlayout-color-splitter-drag: #1677ff;
  --flexlayout-splitter-size: 6px;
  --flexlayout-font-size: 12px;
  --flexlayout-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
}

/* 탭 버튼 스타일 (Ant Design Card 탭과 일관된 느낌) */
.flexlayout__tab_button {
  border-radius: 4px 4px 0 0 !important;
  margin-right: 3px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 4px 10px !important;
  border: 1px solid #e2e8f0 !important;
  border-bottom: none !important;
  transition: all 0.12s ease !important;
}

.flexlayout__tab_button:hover {
  background-color: #f1f5f9 !important;
  color: #1677ff !important;
}

.flexlayout__tab_button--selected {
  background-color: #ffffff !important;
  border-top: 2px solid #1677ff !important;
  border-color: #d9dfe8 #d9dfe8 transparent #d9dfe8 !important;
  color: #1677ff !important;
  font-weight: 600 !important;
}

/* 탭 바 헤더 (34px 슬림 헤더) */
.flexlayout__tabset_header {
  height: 34px !important;
  background-color: #ffffff !important;
  border-bottom: 1px solid #d9dfe8 !important;
  box-sizing: border-box !important;
}

.flexlayout__tabset_tabbar_outer {
  background-color: #ffffff !important;
}

.flexlayout__tabset_tabbar_inner {
  padding-top: 2px !important;
}

/* 스플리터 구분선 */
.flexlayout__splitter {
  background-color: #d9dfe8 !important;
  transition: background-color 0.15s !important;
}

.flexlayout__splitter:hover {
  background-color: #1677ff !important;
}

/* 탭 닫기 버튼 */
.flexlayout__tab_button_trailing {
  margin-left: 6px !important;
  color: #94a3b8 !important;
}

.flexlayout__tab_button_trailing:hover {
  color: #ef4444 !important;
}

/* 탭 내부 콘텐츠 영역: 브라우저/모니터 우측 외곽 스크롤바 방지 (뷰포트 피팅) */
.flexlayout__tab {
  overflow: hidden !important;
  box-sizing: border-box !important;
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/types/index.ts"
// ── Menu Hierarchy Types ──
export interface MenuLevel_3 {
  code: string;
  title: string;
  group?: string;
  badge?: string;
}

export interface MenuLevel_2 {
  groupCode: string;
  groupTitle: string;
  items: MenuLevel_3[];
}

export interface MenuLevel_1 {
  id: string;
  title: string;
  iconName: string;
  groups: MenuLevel_2[];
}

// Backward-compatible aliases
export type MenuItem = MenuLevel_3;
export type MenuGroup = MenuLevel_2;
export type FirstLevelMenu = MenuLevel_1;

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
import { MenuLevel_1, EmployeeStatus, ScheduleItem, DayListItem, ApprovalItem, ComplianceItem, LargeAssetItem } from '../types';

export const menuLevel_1_List: MenuLevel_1[] = [
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

export const firstLevelMenus = menuLevel_1_List;

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

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/layout/TopBar.tsx"
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
        <Tooltip title="온라인 도움말 / 아이디어 제안" placement="bottom">
          <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
            <BulbOutlined
              style={{
                fontSize: 18,
                color: '#fff',
                transition: 'transform 0.2s',
              }}
            />
          </span>
        </Tooltip>

        {/* User Profile dropdown */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
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
          <Tooltip title="AI 어시스턴트 (Beta)" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <RobotOutlined style={{ fontSize: 17, color: '#fff' }} />
            </span>
          </Tooltip>
          <Tooltip title="사내 메신저" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <MessageOutlined style={{ fontSize: 17, color: '#fff' }} />
            </span>
          </Tooltip>
          <Tooltip title="업무 전송 / 쪽지" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <SendOutlined style={{ fontSize: 17, color: '#fff' }} />
            </span>
          </Tooltip>
          <Tooltip title="사내 공지사항" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <SoundOutlined style={{ fontSize: 17, color: '#fff' }} />
            </span>
          </Tooltip>
          <Tooltip title="사용자 정보" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <UserOutlined style={{ fontSize: 17, color: '#fff' }} />
            </span>
          </Tooltip>
          <Tooltip title="시스템 설정" placement="bottom">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <SettingOutlined style={{ fontSize: 17, color: '#fff' }} />
            </span>
          </Tooltip>
          <Tooltip title="로그아웃" placement="bottomRight">
            <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', lineHeight: 1 }}>
              <PoweroffOutlined style={{ fontSize: 17, color: '#fff' }} />
            </span>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/layout/StatusBar.tsx"
import React, { useState, useEffect } from 'react';
import { Tooltip, Popover, Modal, Button, Tag, Space, Divider, message } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  SoundOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  SyncOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  WifiOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface StatusMessage {
  id: string;
  type: 'notice' | 'update' | 'info' | 'warning';
  tag: string;
  tagColor: string;
  text: string;
  timestamp: string;
  detail?: string;
}

const statusMessages: StatusMessage[] = [
  {
    id: '1',
    type: 'notice',
    tag: '시스템',
    tagColor: 'blue',
    text: 'Asset-ERP 서버 및 인프라 서비스가 모두 정상 운영 중입니다.',
    timestamp: '16:00',
    detail: '모든 마이크로서비스 및 메인 데이터베이스(DB), 캐시 클러스터와의 지연 시간이 정상 범위를 유지하고 있습니다.',
  },
  {
    id: '2',
    type: 'update',
    tag: '업데이트',
    tagColor: 'green',
    text: 'FlexLayout 기반 멀티 윈도우 분할 탭 및 레이아웃 자동 저장 기능이 활성화되었습니다.',
    timestamp: '15:30',
    detail: '탭 헤더를 상/하/좌/우로 드래그하여 패널을 무제한 분할할 수 있으며, 탭이 0개가 된 패널은 자동으로 정리됩니다.',
  },
  {
    id: '3',
    type: 'info',
    tag: '결재안내',
    tagColor: 'orange',
    text: '결재 대기 중인 문서가 2건 있습니다. MyPage 결재함을 확인하세요.',
    timestamp: '14:15',
    detail: '정기 승인 및 컴플라이언스 준수 승인 요청 건이 도착해 있습니다.',
  },
  {
    id: '4',
    type: 'warning',
    tag: '점검예정',
    tagColor: 'volcano',
    text: '정기 보안 패치 및 데이터 무결성 검증 작업이 토요일 02:00에 예정되어 있습니다.',
    timestamp: '10:00',
    detail: '작업 중 약 5분간 간헐적 접속 지연이 발생할 수 있습니다.',
  },
];

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export const StatusBar: React.FC = () => {
  // ── 실시간 시계 상태 ──
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());
  const [sessionSeconds, setSessionSeconds] = useState<number>(3540); // 59분

  // ── 메시지 티커 상태 ──
  const [currentMsgIndex, setCurrentMsgIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // ── 시스템 헬스 새로고침 상태 ──
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('방금 전');
  const [latency, setLatency] = useState<number>(14);

  // 1초마다 시계 업데이트 및 세션 감소
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 5초마다 중앙 메시지 순환
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % statusMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // 세션 연장 처리
  const handleExtendSession = () => {
    setSessionSeconds(3600);
    message.success('로그인 세션이 60분 연장되었습니다.');
  };

  // 헬스체크 새로고침 시뮬레이션
  const handleRefreshHealth = () => {
    setIsCheckingHealth(true);
    setTimeout(() => {
      setIsCheckingHealth(false);
      setLatency(Math.floor(Math.random() * 8) + 11);
      setLastCheckedTime(dayjs().format('HH:mm:ss'));
      message.success('시스템 헬스 상태가 정상 확인되었습니다.');
    }, 600);
  };

  const currentMsg = statusMessages[currentMsgIndex];
  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const sessionRemSec = sessionSeconds % 60;

  // ── 왼쪽 시스템 헬스 Popover 컨텐츠 ──
  const healthPopoverContent = (
    <div style={{ width: 280, fontSize: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckCircleFilled style={{ color: '#52c41a', fontSize: 14 }} />
          <span>전체 시스템 정상 가동 중</span>
        </div>
        <Button
          type="text"
          size="small"
          icon={<SyncOutlined spin={isCheckingHealth} />}
          onClick={handleRefreshHealth}
          style={{ fontSize: 11, padding: '0 4px', height: 22 }}
        >
          재점검
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#475569' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <CloudServerOutlined style={{ color: '#1677ff' }} /> API Gateway
          </span>
          <Tag color="success" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>
            200 OK ({latency}ms)
          </Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <DatabaseOutlined style={{ color: '#722ed1' }} /> Main Database
          </span>
          <Tag color="success" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>
            Connected (Pool: 8/20)
          </Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <WifiOutlined style={{ color: '#13c2c2' }} /> EventBus / Push
          </span>
          <Tag color="success" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>
            Active (Live)
          </Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <DashboardOutlined style={{ color: '#fa8c16' }} /> Server CPU / Mem
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>16% / 32% (안정)</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <SafetyCertificateOutlined style={{ color: '#52c41a' }} /> 보안 컴플라이언스
          </span>
          <span style={{ fontSize: 11, color: '#52c41a', fontWeight: 600 }}>정상 (0건 위반)</span>
        </div>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
        <span>마지막 점검: {lastCheckedTime}</span>
        <span>Version 2.4.0</span>
      </div>
    </div>
  );

  return (
    <>
      <footer
        style={{
          height: 28,
          backgroundColor: '#151a24',
          borderTop: '1px solid #222938',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          color: '#94a3b8',
          fontSize: 11,
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
          userSelect: 'none',
          zIndex: 1000,
          flexShrink: 0,
        }}
      >
        {/* ── 1. 왼쪽: System Health (시스템 헬스 상태) ── */}
        <Popover content={healthPopoverContent} title={null} trigger="hover" placement="topLeft">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 3,
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2736')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {/* Pulsing Green Indicator */}
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#52c41a',
                display: 'inline-block',
                boxShadow: '0 0 6px #52c41a',
              }}
            />
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 11 }}>
              System Healthy
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 3 }}>
              <CloudServerOutlined style={{ fontSize: 11 }} />
              API {latency}ms
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 3 }}>
              <DatabaseOutlined style={{ fontSize: 11 }} />
              DB OK
            </span>
          </div>
        </Popover>

        {/* ── 2. 중앙: 메세지 (시스템 공지 및 상태 알림) ── */}
        <div
          style={{
            flex: 1,
            maxWidth: 680,
            margin: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: 3,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            setIsPaused(true);
            e.currentTarget.style.backgroundColor = '#1f2736';
          }}
          onMouseLeave={(e) => {
            setIsPaused(false);
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => setModalOpen(true)}
          title="클릭하여 전체 시스템 공지 및 메시지 확인"
        >
          <SoundOutlined style={{ color: '#fbbf24', fontSize: 12, marginRight: 6, flexShrink: 0 }} />
          <Tag
            color={currentMsg.tagColor}
            style={{
              fontSize: 10,
              lineHeight: '16px',
              padding: '0 4px',
              marginRight: 6,
              borderRadius: 2,
              border: 'none',
              flexShrink: 0,
            }}
          >
            {currentMsg.tag}
          </Tag>
          <span
            style={{
              color: '#cbd5e1',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 11,
              transition: 'opacity 0.2s',
            }}
          >
            {currentMsg.text}
          </span>
          <span style={{ color: '#64748b', fontSize: 10, marginLeft: 6, flexShrink: 0 }}>
            ({currentMsgIndex + 1}/{statusMessages.length})
          </span>
        </div>

        {/* ── 3. 오른쪽: Clock (실시간 시계 및 세션) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tooltip title={`세션 남은 시간: ${sessionMinutes}분 ${sessionRemSec}초 (클릭하여 연장)`}>
            <span
              onClick={handleExtendSession}
              style={{
                color: sessionMinutes < 10 ? '#f87171' : '#94a3b8',
                fontSize: 11,
                cursor: 'pointer',
                padding: '2px 5px',
                borderRadius: 3,
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2736')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              세션 {sessionMinutes}m
            </span>
          </Tooltip>

          <span style={{ color: '#334155' }}>|</span>

          <Tooltip title="대한민국 표준시 (KST, UTC+09:00)">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: '#f1f5f9',
                fontWeight: 500,
                fontSize: 11,
                padding: '2px 4px',
              }}
            >
              <ClockCircleOutlined style={{ color: '#38bdf8', fontSize: 12 }} />
              <span>
                {currentTime.format('YYYY-MM-DD')} ({dayNames[currentTime.day()]}){' '}
                <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentTime.format('HH:mm:ss')}</strong>
              </span>
              <Tag
                color="blue"
                style={{
                  margin: '0 0 0 4px',
                  fontSize: 9,
                  lineHeight: '14px',
                  padding: '0 3px',
                  borderRadius: 2,
                  border: 'none',
                }}
              >
                KST
              </Tag>
            </div>
          </Tooltip>
        </div>
      </footer>

      {/* ── 전체 시스템 메시지 및 공지사항 모달 ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HistoryOutlined style={{ color: '#1677ff' }} />
            <span>시스템 알림 및 공지사항 전체 내역</span>
          </div>
        }
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setModalOpen(false)}>
            확인
          </Button>,
        ]}
        width={580}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {statusMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '10px 14px',
                borderRadius: 6,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Space size={6}>
                  <Tag color={msg.tagColor} style={{ margin: 0, fontSize: 11 }}>
                    {msg.tag}
                  </Tag>
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{msg.text}</span>
                </Space>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{msg.timestamp}</span>
              </div>
              {msg.detail && (
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
                  {msg.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/layout/LeftMenuBar.tsx"
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
import { MenuLevel_1, MenuLevel_3 } from '../../types';
import { menuLevel_1_List } from '../../mock/data';

interface LeftMenuBarProps {
  activeMenuId: string | null;
  onSelectMenuLevel_1: (menuId: string | null) => void;
  onSelectMenuLevel_3: (item: MenuLevel_3, parentMenu: MenuLevel_1) => void;
  pinned: boolean;
  onTogglePin: (pinned: boolean) => void;
  selectedMenuLevel_3_Code?: string;
  // Backward compatibility props
  onSelectFirstLevel?: (menuId: string) => void;
  onSelectMenuItem?: (item: MenuLevel_3, parentMenu: MenuLevel_1) => void;
  selectedSubMenuCode?: string;
}

export const LeftMenuBar: React.FC<LeftMenuBarProps> = ({
  activeMenuId,
  onSelectMenuLevel_1,
  onSelectMenuLevel_3,
  pinned,
  onTogglePin,
  selectedMenuLevel_3_Code,
}) => {
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  // 1차 메뉴 아이콘 렌더링
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

  // 1차 메뉴(MenuLevel_1) 아이콘 클릭 핸들러
  // - 현재 펼쳐진 상태에서 동일한 아이콘을 다시 클릭하면 2,3차 메뉴 패널 닫힘 (토글)
  // - '고정'이 체크되어 있으면 토글로 닫히지 않고 열린 상태 유지
  // - 다른 1차 메뉴 아이콘이 클릭되면 무조건 해당 메뉴로 오픈
  const handleMenuLevel_1_Click = (menuId: string) => {
    if (activeMenuId === menuId) {
      if (!pinned) {
        onSelectMenuLevel_1(null);
      }
    } else {
      onSelectMenuLevel_1(menuId);
    }
  };

  const activeMenuObj = menuLevel_1_List.find((m) => m.id === activeMenuId);

  return (
    <div style={{ display: 'flex', height: '100%', zIndex: 900 }}>
      {/* ── MenuLevel_1: 1차 아이콘 바 (Dark Sidebar, 64px) ── */}
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
        {menuLevel_1_List.map((menu) => {
          const isActive = activeMenuId === menu.id;
          return (
            <div
              key={menu.id}
              onClick={() => handleMenuLevel_1_Click(menu.id)}
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

      {/* ── MenuLevel_2 / MenuLevel_3: 2단계 그룹 및 3단계 항목 패널 (230px, White & Clean) ── */}
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
          {/* MenuLevel_2 & MenuLevel_3 List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0',
            }}
          >
            {activeMenuObj.groups.map((group) => (
              <div key={group.groupCode} style={{ marginBottom: 12 }}>
                {/* MenuLevel_2 헤더 */}
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

                {/* MenuLevel_3 항목들 */}
                <div style={{ padding: '4px 0' }}>
                  {group.items.map((item) => {
                    const isItemSelected = selectedMenuLevel_3_Code === item.code;
                    return (
                      <div
                        key={item.code}
                        onClick={() => onSelectMenuLevel_3(item, activeMenuObj)}
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

          {/* 하단 컨트롤: 폰트 확대/축소 및 '고정' 체크박스 */}
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
              flexShrink: 0,
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

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/mypage/components/EmployeePanel.tsx"
import React, { useState } from 'react';
import { Input, Avatar, Tooltip } from 'antd';
import {
  UserOutlined,
  InfoCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { employeeList } from '../../../mock/data';

export const EmployeePanel: React.FC = () => {
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
          <Tooltip title="온라인" placement="bottom">
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
          <Tooltip title="자리비움" placement="bottom">
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

        <Tooltip title="새로고침" placement="left">
          <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <ReloadOutlined
              style={{ fontSize: 12, color: '#64748b' }}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export const RightMessengerSidebar = EmployeePanel;
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/mypage/MyPageCalendar.tsx"
import React, { useState } from 'react';
import { Calendar, Button, Space } from 'antd';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

interface CalendarProps {
  selectedDate?: number;
  onSelectDate?: (day: number) => void;
  value?: Dayjs;
  onChange?: (date: Dayjs) => void;
}

interface EventItem {
  badge?: string;
  count?: string;
  holiday?: string;
}

// 2026-09 기준 목업 일정 데이터
const eventMap: Record<string, EventItem> = {
  '2026-09-02': { badge: '부서일정 1건' },
  '2026-09-03': { count: '+2 개' },
  '2026-09-04': { count: '+2 개' },
  '2026-09-06': { count: '+2 개' },
  '2026-09-07': { count: '+2 개' },
  '2026-09-08': { count: '+4 개' },
  '2026-09-09': { count: '+2 개' },
  '2026-09-10': { count: '+2 개' },
  '2026-09-11': { count: '+2 개' },
  '2026-09-13': { count: '+3 개' },
  '2026-09-15': { badge: '부서일정 1건' },
  '2026-09-16': { count: '+2 개' },
  '2026-09-17': { count: '+2 개' },
  '2026-09-18': { badge: '부서일정 1건' },
  '2026-09-20': { count: '+2 개' },
  '2026-09-22': { badge: '부서일정 1건' },
  '2026-09-23': { count: '+2 개' },
  '2026-09-24': { holiday: '휴일(추석연휴)' },
  '2026-09-25': { holiday: '휴일(추석)' },
  '2026-09-27': { count: '+2 개' },
  '2026-09-29': { count: '+2 개' },
  '2026-09-30': { badge: '부서일정 1건' },
};

export const MyPageCalendar: React.FC<CalendarProps> = ({
  selectedDate = 16,
  onSelectDate,
  value: propValue,
  onChange: propOnChange,
}) => {
  const [internalValue, setInternalValue] = useState<Dayjs>(() =>
    dayjs('2026-09-01').set('date', selectedDate)
  );

  const currentValue = propValue ?? internalValue;

  const handleDateSelect = (date: Dayjs) => {
    setInternalValue(date);
    onSelectDate?.(date.date());
    propOnChange?.(date);
  };

  // Ant Design Calendar 헤더 렌더러 (연/월 네비게이션 및 빠른 액션 버튼)
  const renderHeader = ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
    return (
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
        {/* Left: 연/월 표시 및 빠른 버튼들 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
            {value.year()}년 {value.month() + 1}월
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

        {/* Right: 연/월 이동 버튼 그룹 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button.Group size="small">
            <Button
              icon={<DoubleLeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.subtract(1, 'year'))}
              style={{ height: 24, padding: '0 6px' }}
              title="이전 연도"
            />
            <Button
              icon={<LeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.subtract(1, 'month'))}
              style={{ height: 24, padding: '0 6px' }}
              title="이전 달"
            />
            <Button
              icon={<RightOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.add(1, 'month'))}
              style={{ height: 24, padding: '0 6px' }}
              title="다음 달"
            />
            <Button
              icon={<DoubleRightOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.add(1, 'year'))}
              style={{ height: 24, padding: '0 6px' }}
              title="다음 연도"
            />
          </Button.Group>

          <Button
            size="small"
            style={{ fontSize: 11, height: 24, borderRadius: 3 }}
            onClick={() => {
              const today = dayjs('2026-09-16');
              onChange(today);
              handleDateSelect(today);
            }}
          >
            오늘
          </Button>

          <Button
            size="small"
            type="primary"
            style={{ fontSize: 11, height: 24, borderRadius: 3, backgroundColor: '#1e3a5f' }}
            icon={<ReloadOutlined style={{ fontSize: 10 }} />}
            onClick={() => {
              onChange(value.clone());
            }}
          >
            새로고침
          </Button>
        </div>
      </div>
    );
  };

  // Ant Design Calendar 커스텀 날짜 셀 렌더러
  const fullCellRender = (date: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type !== 'date') return info.originNode;

    const isCurrentMonth = date.month() === currentValue.month();
    const isChosen = date.isSame(currentValue, 'day');
    const dayOfWeek = date.day(); // 0 = Sun, 6 = Sat
    const dateKey = date.format('YYYY-MM-DD');
    const event = eventMap[dateKey];

    const dayColor = !isCurrentMonth
      ? '#cbd5e1'
      : dayOfWeek === 0
      ? '#dc2626'
      : dayOfWeek === 6
      ? '#2563eb'
      : '#1e293b';

    return (
      <div
        style={{
          height: 48,
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          padding: 4,
          boxSizing: 'border-box',
          backgroundColor: isChosen ? '#e06666' : isCurrentMonth ? '#ffffff' : '#fcfcfc',
          color: isChosen ? '#ffffff' : '#334155',
          cursor: isCurrentMonth ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'background-color 0.12s',
        }}
      >
        {/* 상단: 날짜 번호 및 개수 카운트 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span
            style={{
              fontWeight: isChosen ? 700 : 500,
              color: isChosen ? '#ffffff' : dayColor,
              fontSize: 12,
            }}
          >
            {date.date()}
          </span>

          {event?.count && (
            <span
              style={{
                fontSize: 10,
                color: isChosen ? 'rgba(255,255,255,0.9)' : '#94a3b8',
                fontWeight: 400,
              }}
            >
              {event.count}
            </span>
          )}
        </div>

        {/* 하단: 일정 배지 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {event?.badge && (
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
              {event.badge}
            </div>
          )}
          {event?.holiday && (
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
              {event.holiday}
            </div>
          )}
        </div>
      </div>
    );
  };

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
      <Calendar
        fullscreen={false}
        value={currentValue}
        onSelect={handleDateSelect}
        headerRender={renderHeader}
        fullCellRender={fullCellRender}
      />
    </div>
  );
};

export const MyPageCalender = MyPageCalendar;
export const DashboardCalendar = MyPageCalendar;
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/mypage/MyPageCalendarLegacy.tsx"
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

export const MyPageCalendar: React.FC<CalendarProps> = ({
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

export const MyPageCalendarLegacy = MyPageCalendar;
export const MyPageCalenderLegacy = MyPageCalendar;
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/mypage/MyPageCalender.tsx"
export * from './MyPageCalendar';
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/mypage/MyPageCalenderLegacy.tsx"
export * from './MyPageCalendarLegacy';
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/mypage/MyPageGrids.tsx"
import React, { useState } from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  mockScheduleList,
  mockDayList,
  mockApprovalList,
  mockComplianceList,
} from '../../mock/data';
import { ScheduleItem, DayListItem, ApprovalItem, ComplianceItem } from '../../types';

// ── 1. 기준일 상세 일정 박스 (MyPage 좌측 하단) ──
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

  const columns: TableProps<ScheduleItem>['columns'] = [
    {
      title: '분류',
      dataIndex: 'category',
      key: 'category',
      width: 80,
      render: (val: string) => (
        <Tag color={val === '부서일정' ? 'blue' : 'default'} style={{ margin: 0, fontSize: 11 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: '나의일정명',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
      title: '등록자',
      dataIndex: 'registrant',
      key: 'registrant',
      width: 75,
      align: 'center',
    },
    {
      title: '마감일',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 130,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val}</span>,
    },
    {
      title: '처리일',
      dataIndex: 'processedDate',
      key: 'processedDate',
      width: 75,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val || '-'}</span>,
    },
    {
      title: '상세보기',
      dataIndex: 'detail',
      key: 'detail',
      width: 70,
      align: 'center',
      render: () => (
        <Button size="small" type="link" style={{ padding: 0, fontSize: 11 }}>
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
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Box Header */}
      <div
        style={{
          padding: '6px 12px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#1e3a5f', fontWeight: 700, fontSize: 13 }}>
            ▶ 기준일 : 2026년 09월 {String(selectedDay).padStart(2, '0')}일
          </span>
        </div>
        <Button size="small" style={{ fontSize: 11, borderRadius: 3, height: 22 }}>
          ↪ 등록 바로가기
        </Button>
      </div>

      {/* Sub Filter Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '3px 6px',
          gap: 4,
          flexShrink: 0,
          flexWrap: 'wrap',
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
                transition: 'all 0.12s',
              }}
            >
              {tab.label} <span style={{ opacity: 0.85 }}>[{tab.count}]</span>
            </button>
          );
        })}
      </div>

      {/* Ant Design Compact Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Table<ScheduleItem>
          rowKey="id"
          dataSource={filteredData}
          columns={columns}
          size="small"
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

// ── 2. Day List 박스 (MyPage 우측 상단) ──
export const DayListBox: React.FC = () => {
  const [dayDate, setDayDate] = useState('2026-09-17');

  const columns: TableProps<DayListItem>['columns'] = [
    {
      title: '업무구분',
      dataIndex: 'workType',
      key: 'workType',
      width: 90,
      align: 'center',
      render: (val: string) => (
        <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: '등록(마감)일',
      dataIndex: 'regDueDate',
      key: 'regDueDate',
      width: 105,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val}</span>,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
      title: '처리(완료)일',
      dataIndex: 'completedDate',
      key: 'completedDate',
      width: 95,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val || '-'}</span>,
    },
    {
      title: '담당자',
      dataIndex: 'manager',
      key: 'manager',
      width: 85,
      align: 'center',
    },
    {
      title: '상세보기',
      dataIndex: 'detail',
      key: 'detail',
      width: 70,
      align: 'center',
      render: () => (
        <Button size="small" type="link" style={{ padding: 0, fontSize: 11 }}>
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
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
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
          flexShrink: 0,
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
          <Button size="small" icon={<ReloadOutlined style={{ fontSize: 10 }} />} style={{ fontSize: 11, height: 22, borderRadius: 3 }}>
            새로고침
          </Button>
          <Button size="small" style={{ fontSize: 11, height: 22, borderRadius: 3 }}>
            바로가기
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Table<DayListItem>
          rowKey="id"
          dataSource={mockDayList}
          columns={columns}
          size="small"
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

// ── 3. 결재요청함 박스 (MyPage 우측 중간) ──
export const ApprovalGridBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'requested' | 'draft'>('requested');

  const tabs = [
    { key: 'pending', label: '미결함', count: 0 },
    { key: 'requested', label: '결재요청함 (완료/반려건은 최대 7일까지 표시)', count: 2 },
    { key: 'draft', label: '임시저장함', count: 0 },
  ];

  const columns: TableProps<ApprovalItem>['columns'] = [
    {
      title: '진행상태',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      align: 'center',
      render: (val: string) => (
        <Tag color={val === '결재대기' ? 'orange' : 'blue'} style={{ margin: 0, fontSize: 11 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: '등록일',
      dataIndex: 'regDate',
      key: 'regDate',
      width: 95,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val}</span>,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
      title: '상신자',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 85,
      align: 'center',
    },
    {
      title: '상세보기',
      dataIndex: 'detail',
      key: 'detail',
      width: 70,
      align: 'center',
      render: () => (
        <Button size="small" type="link" style={{ padding: 0, fontSize: 11 }}>
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
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '3px 8px',
          gap: 6,
          flexShrink: 0,
          flexWrap: 'wrap',
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
                transition: 'all 0.12s',
              }}
            >
              {tab.label} <span style={{ opacity: 0.85 }}>[{tab.count}]</span>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Table<ApprovalItem>
          rowKey="id"
          dataSource={mockApprovalList}
          columns={columns}
          size="small"
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

// ── 4. 법규보고공시 및 내규정보 박스 (MyPage 우측 하단) ──
export const ComplianceGridBox: React.FC = () => {
  const columns: TableProps<ComplianceItem>['columns'] = [
    {
      title: '구분',
      dataIndex: 'category',
      key: 'category',
      width: 90,
      align: 'center',
      render: (val: string) => (
        <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: '마감일',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 95,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val}</span>,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
      title: '상세보기',
      dataIndex: 'detail',
      key: 'detail',
      width: 70,
      align: 'center',
      render: () => (
        <Button size="small" type="link" style={{ padding: 0, fontSize: 11 }}>
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
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
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
          flexShrink: 0,
        }}
      >
        법규보고공시 및 내규정보
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Table<ComplianceItem>
          rowKey="id"
          dataSource={mockComplianceList}
          columns={columns}
          size="small"
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/grid/LargeDataView.tsx"
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
import { generateLargeAssetData } from '../../../mock/data';
import { LargeAssetItem } from '../../../types';

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
    <div
      style={{
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        gap: 8,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Summary Stats Cards ── */}
      <Row gutter={8} style={{ flexShrink: 0 }}>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#0369a1' }}>총 로드된 자산 건수 (AgGrid)</span>}
              value={stats.total}
              suffix="건"
              valueStyle={{ color: '#0284c7', fontSize: 17, fontWeight: 700 }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#fdf4ff', borderColor: '#f5d0fe' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#86198f' }}>총 자산 가액 (취득가 합산)</span>}
              value={stats.totalPrice}
              suffix="억원"
              valueStyle={{ color: '#c026d3', fontSize: 17, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#15803d' }}>정상 가동 자산</span>}
              value={stats.normalCount}
              suffix="건"
              valueStyle={{ color: '#16a34a', fontSize: 17, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#b45309' }}>점검/수리/폐기 대상</span>}
              value={stats.repairCount + stats.discardCount}
              suffix="건"
              valueStyle={{ color: '#d97706', fontSize: 17, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── Action Toolbar ── */}
      <Card
        size="small"
        bodyStyle={{ padding: '6px 12px' }}
        style={{
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
              [{menuCode}] {title}
            </span>
            <Tag color="purple" style={{ margin: 0, fontSize: 10 }}>
              가상 스크롤 60fps
            </Tag>
          </div>

          <Space size={6} wrap>
            <Input
              placeholder="빠른 통합 검색 (자산번호, 이름...)"
              prefix={<SearchOutlined />}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ width: 200, fontSize: 12 }}
              size="small"
              allowClear
            />

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 125 }}
              size="small"
              options={[
                { value: 'all', label: '전체 분류' },
                { value: 'IT전산장비', label: 'IT전산장비' },
                { value: '네트워크서버', label: '네트워크서버' },
                { value: '사무가구', label: '사무가구' },
                { value: '소프트웨어라이선스', label: '소프트웨어' },
                { value: '업무용차량', label: '업무용차량' },
              ]}
            />

            <Button.Group size="small">
              <Button
                type={dataCount === 10000 ? 'primary' : 'default'}
                onClick={() => handleRegenerate(10000)}
                icon={<ReloadOutlined />}
              >
                1만 건
              </Button>
              <Button
                type={dataCount === 30000 ? 'primary' : 'default'}
                onClick={() => handleRegenerate(30000)}
              >
                3만 건
              </Button>
            </Button.Group>

            <Button size="small" icon={<DownloadOutlined />} onClick={handleExportCsv}>
              CSV
            </Button>
          </Space>
        </div>
      </Card>

      {/* ── AG Grid Table (Viewport Fitted, Pure Internal Virtual Scrolling) ── */}
      <div
        className="ag-theme-alpine"
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          height: '100%',
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
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return <MainLayout />;
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/layout/MainLayout.tsx"
import { useRef, useState } from 'react';
import { TopBar } from './TopBar';
import { LeftMenuBar } from './LeftMenuBar';
import { StatusBar } from './StatusBar';
import { Workspace, WorkspaceHandle } from './Workspace';
import { MenuLevel_1, MenuLevel_3 } from '../../types';

// ── 최상위 셸 레이아웃 (Header + LNB + Workspace + Status) ──
export function MainLayout() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>('duty');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedMenuLevel_3_Code, setSelectedMenuLevel_3_Code] = useState<string>('1495');

  const workspaceRef = useRef<WorkspaceHandle>(null);

  const handleSelectMenuLevel_1 = (menuId: string | null) => {
    setActiveMenuId(menuId);
  };

  // ── 메뉴 클릭 시: Workspace(FlexLayout)에 새 탭 추가 또는 기존 탭 활성화 위임 ──
  const handleSelectMenuLevel_3 = (item: MenuLevel_3, parent: MenuLevel_1) => {
    setSelectedMenuLevel_3_Code(item.code);
    workspaceRef.current?.openMenuTab(item, parent);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar
        sidebarPinned={sidebarPinned}
        onToggleSidebarPin={() => setSidebarPinned(!sidebarPinned)}
      />

      {/* ── Body Container with LeftMenuBar & Workspace ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
        {/* ── 왼쪽 MenuLevel_1 아이콘 메뉴 및 MenuLevel_2/3 서브메뉴 ── */}
        <LeftMenuBar
          activeMenuId={activeMenuId}
          onSelectMenuLevel_1={handleSelectMenuLevel_1}
          onSelectMenuLevel_3={handleSelectMenuLevel_3}
          pinned={sidebarPinned}
          onTogglePin={setSidebarPinned}
          selectedMenuLevel_3_Code={selectedMenuLevel_3_Code}
        />

        {/* ── Main Content Area: FlexLayout Multi-Split & Docking ── */}
        <Workspace ref={workspaceRef} />
      </div>

      {/* ── Status Bar (System Health, Message, Clock) ── */}
      <StatusBar />
    </div>
  );
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/layout/Workspace.tsx"
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Tooltip, Tag, Popconfirm, message } from 'antd';
import {
  SplitCellsOutlined,
  InsertRowBelowOutlined,
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Model,
  Actions,
  TabNode,
  IJsonModel,
  DockLocation,
} from 'flexlayout-react';
import '../../flexlayout-custom.css';

import { MyPageCalendar } from '../../pages/mypage/MyPageCalendar';
import {
  ScheduleGridBox,
  DayListBox,
  ApprovalGridBox,
  ComplianceGridBox,
} from '../../pages/mypage/MyPageGrids';
import { EmployeePanel } from '../../pages/mypage/components/EmployeePanel';
import { LargeDataView } from '../common/grid/LargeDataView';
import { MenuLevel_1, MenuLevel_3 } from '../../types';

// ── 기본 레이아웃 정의 (초기 상태: My Page 1개 탭) ──
const defaultLayoutJson: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabSetEnableMaximize: false, // 최대화로 인한 분할 차단 및 전체화면 고착 방지
    tabSetEnableClose: true, // 탭셋 닫기/삭제 허용
    tabSetEnableCloseButton: false, // 탭셋 헤더 자체의 닫기 버튼은 미노출
    tabSetEnableDeleteWhenEmpty: true, // 탭이 0개가 되면 해당 분할 패널(탭셋) 자동 소멸
    tabEnableRename: false,
    tabEnableScrollbars: false, // 탭 외곽 스크롤바 방지 (뷰포트 피팅 및 내부 가상 스크롤 격리)
    tabSetEnableDivide: true, // 패널 드래그 분할 허용
    tabSetEnableDrop: true, // 드롭 허용
    tabSetEnableDrag: true,
    tabEnableDrag: true,
    enableEdgeDock: true,
    enableEdgeDockIndicators: true,
    tabSetMinWidth: 240,
    tabSetMinHeight: 160,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 100,
        id: 'main-tabset',
        enableDivide: true,
        enableDrop: true,
        children: [
          {
            type: 'tab',
            name: 'My Page',
            component: 'mypage',
            enableClose: false,
            enableScrollbars: false,
            id: 'tab-mypage',
          },
        ],
      },
    ],
  },
};

const STORAGE_KEY = 'asseterp_flexlayout_model';

// 로컬 스토리지에 저장된 레이아웃 정제 (0개 탭 자동 소멸, 최대화 해제, 분할 허용 강제 적용)
function sanitizeLayoutJson(json: IJsonModel): IJsonModel {
  if (!json.global) {
    json.global = {};
  }
  json.global.tabSetEnableClose = true;
  json.global.tabSetEnableCloseButton = false;
  json.global.tabSetEnableDeleteWhenEmpty = true;
  json.global.tabEnableScrollbars = false; // 외곽 스크롤 방지
  json.global.tabSetEnableMaximize = false; // 최대화 고착 방지
  json.global.tabSetEnableDivide = true; // 패널 드래그 분할 보장
  json.global.tabSetEnableDrop = true;
  json.global.tabSetEnableDrag = true;
  json.global.tabEnableDrag = true;
  json.global.enableEdgeDock = true;
  json.global.enableEdgeDockIndicators = true;

  const fixNode = (node: any) => {
    if (!node) return;
    if (node.type === 'tabset') {
      if (node.enableClose === false) delete node.enableClose;
      if (node.enableDeleteWhenEmpty === false) delete node.enableDeleteWhenEmpty;
      if (node.maximized) delete node.maximized; // 저장된 최대화 상태 강제 해제!
      node.enableMaximize = false;
      node.enableDivide = true;
      node.enableDrop = true;
    }
    if (node.type === 'tab') {
      node.enableScrollbars = false;
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(fixNode);
    }
  };

  if (json.layout) {
    fixNode(json.layout);
  }
  return json;
}

// 로컬 스토리지에서 저장된 레이아웃 복원 또는 기본 레이아웃 로드
function getInitialModel(): Model {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const json = JSON.parse(saved);
      const m = Model.fromJson(sanitizeLayoutJson(json));
      const maxTs = m.getMaximizedTabset();
      if (maxTs) {
        m.doAction(Actions.maximizeToggle(maxTs.getId()));
      }
      return m;
    } catch (e) {
      console.warn('저장된 레이아웃 복원 실패, 기본값 사용:', e);
    }
  }
  return Model.fromJson(defaultLayoutJson);
}

export interface WorkspaceHandle {
  openMenuTab: (item: MenuLevel_3, parent: MenuLevel_1) => void;
}

// ── FlexLayout 기반 MDI 다중 탭/도킹 컨테이너 ──
export const Workspace = forwardRef<WorkspaceHandle>((_props, ref) => {
  const [selectedDay, setSelectedDay] = useState<number>(16);

  // ── FlexLayout 모델 상태 ──
  const [model, setModel] = useState<Model>(() => getInitialModel());

  // ── 메뉴 클릭 시: 활성화된 탭셋(TabSet)에 새 탭 추가 또는 기존 탭 활성화 ──
  useImperativeHandle(ref, () => ({
    openMenuTab: (item: MenuLevel_3) => {
      const tabId = `tab-${item.code}`;

      const existingNode = model.getNodeById(tabId);
      if (existingNode) {
        // 이미 열려 있는 탭이면 해당 탭 선택
        model.doAction(Actions.selectTab(tabId));
      } else {
        // 현재 활성화된 탭셋(없으면 첫 번째 탭셋)에 탭 추가
        const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
        const targetTabsetId = activeTabset ? activeTabset.getId() : 'main-tabset';

        model.doAction(
          Actions.addTab(
            {
              type: 'tab',
              name: `[${item.code}] ${item.title}`,
              component: 'largedata',
              id: tabId,
              config: { code: item.code, title: item.title },
              enableClose: true,
              enableScrollbars: false,
            },
            targetTabsetId,
            DockLocation.CENTER,
            -1,
            true // 바로 선택
          )
        );
      }
    },
  }));

  // ── 레이아웃 변경 시 자동 로컬 스토리지 저장 ──
  const handleModelChange = (newModel: Model) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel.toJson()));
    } catch (e) {
      console.error('레이아웃 저장 실패:', e);
    }
  };

  // ── 빠른 버튼: 현재 활성 탭을 우측으로 분할 ──
  const handleSplitRight = () => {
    // 혹시 최대화 상태인 경우 즉시 해제
    const maxTs = model.getMaximizedTabset();
    if (maxTs) {
      model.doAction(Actions.maximizeToggle(maxTs.getId()));
    }

    const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
    if (!activeTabset) {
      message.warning('분할할 패널이 없습니다.');
      return;
    }
    const activeTab = activeTabset.getSelectedNode();

    // 패널에 탭이 1개뿐일 때: 우측에 새 작업 화면([1495] 당직명령부)을 분할 생성하여 즉시 2개 패널 배치
    if (activeTabset.getChildren().length <= 1) {
      const splitTabId = 'tab-1495';
      const existing = model.getNodeById(splitTabId);
      if (existing) {
        model.doAction(
          Actions.moveNode(
            splitTabId,
            activeTabset.getId(),
            DockLocation.RIGHT,
            -1,
            true
          )
        );
      } else {
        model.doAction(
          Actions.addTab(
            {
              type: 'tab',
              name: '[1495] 당직명령부',
              component: 'largedata',
              id: splitTabId,
              config: { code: '1495', title: '당직명령부' },
              enableClose: true,
              enableScrollbars: false,
            },
            activeTabset.getId(),
            DockLocation.RIGHT,
            -1,
            true
          )
        );
      }
      message.success('우측으로 새 작업 패널이 분할 생성되었습니다.');
      return;
    }

    if (activeTab) {
      model.doAction(
        Actions.moveNode(
          activeTab.getId(),
          activeTabset.getId(),
          DockLocation.RIGHT,
          -1,
          true
        )
      );
      message.success('현재 탭이 우측 패널로 분할 이동되었습니다.');
    }
  };

  // ── 빠른 버튼: 현재 활성 탭을 하단으로 분할 ──
  const handleSplitBottom = () => {
    // 혹시 최대화 상태인 경우 즉시 해제
    const maxTs = model.getMaximizedTabset();
    if (maxTs) {
      model.doAction(Actions.maximizeToggle(maxTs.getId()));
    }

    const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
    if (!activeTabset) {
      message.warning('분할할 패널이 없습니다.');
      return;
    }
    const activeTab = activeTabset.getSelectedNode();

    // 패널에 탭이 1개뿐일 때: 하단에 새 작업 화면([1495] 당직명령부)을 분할 생성하여 즉시 2개 패널 배치
    if (activeTabset.getChildren().length <= 1) {
      const splitTabId = 'tab-1495';
      const existing = model.getNodeById(splitTabId);
      if (existing) {
        model.doAction(
          Actions.moveNode(
            splitTabId,
            activeTabset.getId(),
            DockLocation.BOTTOM,
            -1,
            true
          )
        );
      } else {
        model.doAction(
          Actions.addTab(
            {
              type: 'tab',
              name: '[1495] 당직명령부',
              component: 'largedata',
              id: splitTabId,
              config: { code: '1495', title: '당직명령부' },
              enableClose: true,
              enableScrollbars: false,
            },
            activeTabset.getId(),
            DockLocation.BOTTOM,
            -1,
            true
          )
        );
      }
      message.success('하단으로 새 작업 패널이 분할 생성되었습니다.');
      return;
    }

    if (activeTab) {
      model.doAction(
        Actions.moveNode(
          activeTab.getId(),
          activeTabset.getId(),
          DockLocation.BOTTOM,
          -1,
          true
        )
      );
      message.success('현재 탭이 하단 패널로 분할 이동되었습니다.');
    }
  };

  // ── 레이아웃 수동 저장 ──
  const handleSaveLayout = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(model.toJson()));
    message.success('현재 화면 분할 및 탭 레이아웃이 저장되었습니다.');
  };

  // ── 레이아웃 기본값으로 초기화 ──
  const handleResetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setModel(Model.fromJson(defaultLayoutJson));
    message.info('기본 레이아웃으로 초기화되었습니다.');
  };

  // ── FlexLayout Tab 컴포넌트 렌더러 (factory) ──
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = (node.getConfig() as { code?: string; title?: string }) || {};

    if (component === 'mypage') {
      return (
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            height: '100%',
            minHeight: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* MyPage Grid/Calendar Container (뷰포트 피팅 및 외부 스크롤바 방지) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              padding: 8,
              gap: 8,
              overflow: 'hidden',
              minWidth: 0,
              minHeight: 0,
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Left Column: Calendar (상단) + Schedule Box (하단 채움) */}
            <div
              style={{
                width: 440,
                minWidth: 380,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                height: '100%',
                minHeight: 0,
                flexShrink: 0,
              }}
            >
              <MyPageCalendar
                selectedDate={selectedDay}
                onSelectDate={setSelectedDay}
              />
              <ScheduleGridBox selectedDay={selectedDay} />
            </div>

            {/* Center Column: Day List + Approvals + Compliance (높이 균등 분할) */}
            <div
              style={{
                flex: 1,
                minWidth: 420,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                height: '100%',
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              <DayListBox />
              <ApprovalGridBox />
              <ComplianceGridBox />
            </div>

            {/* Rightmost Column: 사원 조직도 / 우측 사이드바 */}
            <EmployeePanel />
          </div>
        </div>
      );
    }

    // 기본 대용량 데이터 뷰 (AgGrid: 외부 스크롤 없이 AgGrid 내부 가상 스크롤만 동작하도록 격리)
    return (
      <div style={{ flex: 1, overflow: 'hidden', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
        <LargeDataView
          title={config.title || node.getName()}
          menuCode={config.code || node.getId().replace('tab-', '')}
        />
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, backgroundColor: '#eef2f6' }}>
      {/* Layout Utility Toolbar */}
      <div
        style={{
          height: 32,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #d9dfe8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          flexShrink: 0,
        }}
      >
        {/* Guide message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tag color="geekblue" icon={<InfoCircleOutlined />} style={{ fontSize: 11, margin: 0 }}>
            💡 탭이 2개 이상일 때 탭을 패널 우측/하단 가장자리로 드래그하거나, '우측/하단 분할' 버튼을 누르면 즉시 분할됩니다
          </Tag>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tooltip title="현재 선택된 탭을 오른쪽으로 분할">
            <Button
              size="small"
              icon={<SplitCellsOutlined style={{ color: '#1677ff' }} />}
              onClick={handleSplitRight}
              style={{ fontSize: 11, height: 24, padding: '0 8px' }}
            >
              우측 분할
            </Button>
          </Tooltip>

          <Tooltip title="현재 선택된 탭을 아래쪽으로 분할">
            <Button
              size="small"
              icon={<InsertRowBelowOutlined style={{ color: '#1677ff' }} />}
              onClick={handleSplitBottom}
              style={{ fontSize: 11, height: 24, padding: '0 8px' }}
            >
              하단 분할
            </Button>
          </Tooltip>

          <Tooltip title="현재 화면 배치(분할 크기, 열린 탭 위치)를 브라우저에 저장">
            <Button
              size="small"
              icon={<SaveOutlined style={{ color: '#52c41a' }} />}
              onClick={handleSaveLayout}
              style={{ fontSize: 11, height: 24, padding: '0 8px' }}
            >
              레이아웃 저장
            </Button>
          </Tooltip>

          <Popconfirm
            title="레이아웃 초기화"
            description="모든 분할을 닫고 기본 단일 화면으로 초기화하시겠습니까?"
            onConfirm={handleResetLayout}
            okText="초기화"
            cancelText="취소"
          >
            <Button
              size="small"
              icon={<ReloadOutlined />}
              style={{ fontSize: 11, height: 24, padding: '0 8px' }}
            >
              초기화
            </Button>
          </Popconfirm>
        </div>
      </div>

      {/* FlexLayout Viewport */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Layout
          model={model}
          factory={factory}
          onModelChange={handleModelChange}
          realtimeResize
        />
      </div>
    </div>
  );
});

Workspace.displayName = 'Workspace';
EOF

    # ── common/button ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/button/AuthButton.tsx"
// TODO: AuthButton.tsx - 권한 연동 제어 버튼 (스켈레톤)
import React from 'react';
import { Button, ButtonProps } from 'antd';

export const AuthButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/button/index.ts"
// TODO: barrel export - 하위 컴포넌트 완성 후 추가
export * from './AuthButton';
EOF

    # ── common/form ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/form/AmountInput.tsx"
// TODO: AmountInput.tsx - 통화/금액 포맷 입력기 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/form/CodeSelect.tsx"
// TODO: CodeSelect.tsx - 공통 코드 기반 Select 드롭다운 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/form/DateRangePicker.tsx"
// TODO: DateRangePicker.tsx - 표준 기간 선택기 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/form/index.ts"
// TODO: barrel export - 하위 컴포넌트 완성 후 추가
export {};
EOF

    # ── common/grid ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/grid/AppDataGrid.tsx"
// TODO: AppDataGrid.tsx - Ant Design Table 기반 표준 그리드 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/grid/columnRenderers.tsx"
// TODO: columnRenderers.tsx - 통화, 날짜, 태그 등 공통 셀 렌더러 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/grid/index.ts"
// TODO: barrel export - 하위 컴포넌트 완성 후 추가
export * from './AppDataGrid';
export * from './columnRenderers';
EOF

    # ── common/modal ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/modal/ConfirmModal.tsx"
// TODO: ConfirmModal.tsx - 표준 확인/취소 팝업 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/common/modal/index.ts"
// TODO: barrel export - 하위 컴포넌트 완성 후 추가
export {};
EOF

    # ── pages/act (회계) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/act/components/SlipDetailModal.tsx"
// TODO: SlipDetailModal.tsx - 회계 전표 상세 팝업 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/act/hooks/useActSlipQuery.ts"
// TODO: useActSlipQuery.ts - 회계 전표 조회용 React Query 훅 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/act/types/actTypes.ts"
// TODO: actTypes.ts - act(회계) 도메인 DTO/VO 정의 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/act/ActSlipManageView.tsx"
// TODO: ActSlipManageView.tsx - 회계 전표 관리 화면 (Workspace 탭에 마운트 예정, 스켈레톤)
import React from 'react';

const ActSlipManageView: React.FC = () => {
  return <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>ActSlipManageView (구현 예정)</div>;
};

export default ActSlipManageView;
EOF

    # ── pages/biz (업무/영업 공통) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/biz/types/bizTypes.ts"
// TODO: bizTypes.ts - biz(업무/영업) 도메인 DTO/VO 정의 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/biz/BizOverviewView.tsx"
// TODO: BizOverviewView.tsx - 업무/영업 현황 개요 화면 (스켈레톤)
import React from 'react';

const BizOverviewView: React.FC = () => {
  return <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>BizOverviewView (구현 예정)</div>;
};

export default BizOverviewView;
EOF

    # ── pages/crm (고객 관리) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/crm/types/crmTypes.ts"
// TODO: crmTypes.ts - crm(고객 관리) 도메인 DTO/VO 정의 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/crm/CrmCustomerView.tsx"
// TODO: CrmCustomerView.tsx - 고객 마스터 관리 화면 (스켈레톤)
import React from 'react';

const CrmCustomerView: React.FC = () => {
  return <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>CrmCustomerView (구현 예정)</div>;
};

export default CrmCustomerView;
EOF

    # ── pages/emp (인사 관리) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/emp/components/EmpDetailCard.tsx"
// TODO: EmpDetailCard.tsx - 임직원 상세 정보 카드 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/emp/types/empTypes.ts"
// TODO: empTypes.ts - emp(인사) 도메인 DTO/VO 정의 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/emp/EmpListView.tsx"
// TODO: EmpListView.tsx - 임직원 마스터 목록 화면 (스켈레톤)
import React from 'react';

const EmpListView: React.FC = () => {
  return <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>EmpListView (구현 예정)</div>;
};

export default EmpListView;
EOF

    # ── pages/fnd (펀드 기준 정보) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/fnd/types/fndTypes.ts"
// TODO: fndTypes.ts - fnd(펀드) 도메인 DTO/VO 정의 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/fnd/FndMasterView.tsx"
// TODO: FndMasterView.tsx - 펀드 기준 정보 관리 화면 (스켈레톤)
import React from 'react';

const FndMasterView: React.FC = () => {
  return <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>FndMasterView (구현 예정)</div>;
};

export default FndMasterView;
EOF

    # ── pages/rpt (보고서 출력) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/rpt/types/rptTypes.ts"
// TODO: rptTypes.ts - rpt(보고서) 도메인 DTO/VO 정의 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/rpt/RptDailySummaryView.tsx"
// TODO: RptDailySummaryView.tsx - 일일 요약 보고서 화면 (스켈레톤)
import React from 'react';

const RptDailySummaryView: React.FC = () => {
  return <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>RptDailySummaryView (구현 예정)</div>;
};

export default RptDailySummaryView;
EOF

    # ── pages/sys (시스템 관리) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/sys/types/sysTypes.ts"
// TODO: sysTypes.ts - sys(시스템) 도메인 DTO/VO 정의 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/sys/SysUserAuthView.tsx"
// TODO: SysUserAuthView.tsx - 사용자/권한 관리 화면 (스켈레톤)
import React from 'react';

const SysUserAuthView: React.FC = () => {
  return <div style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>SysUserAuthView (구현 예정)</div>;
};

export default SysUserAuthView;
EOF

    # ── services ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/api.ts"
// TODO: api.ts - Axios 인스턴스 (JWT 주입 및 ApiResponse 처리) 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/authService.ts"
// TODO: authService.ts - 로그인/로그아웃/토큰 재발급 API 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/commonService.ts"
// TODO: commonService.ts - 공통 코드/메뉴 목록 조회 API 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/biz/actService.ts"
// TODO: actService.ts - act(회계) 도메인 API 서비스 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/biz/bizService.ts"
// TODO: bizService.ts - biz(업무/영업) 도메인 API 서비스 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/biz/crmService.ts"
// TODO: crmService.ts - crm(고객 관리) 도메인 API 서비스 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/biz/empService.ts"
// TODO: empService.ts - emp(인사) 도메인 API 서비스 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/biz/fndService.ts"
// TODO: fndService.ts - fnd(펀드) 도메인 API 서비스 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/services/biz/sysService.ts"
// TODO: sysService.ts - sys(시스템) 도메인 API 서비스 예정 (스켈레톤)
export {};
EOF

    # ── types (전역 공통 규약 스켈레톤) ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/types/api.ts"
// TODO: api.ts - 백엔드 표준 응답 Envelope (ApiResponse<T>, PageResponse) 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/types/auth.ts"
// TODO: auth.ts - 사용자 세션, 토큰, Role 권한 규약 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/types/common.ts"
// TODO: common.ts - 공통 코드(CodeItem), Key-Value 옵션 규약 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/types/grid.ts"
// TODO: grid.ts - DataGrid 컬럼 스키마 및 셀 렌더러 인터페이스 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/types/layout.ts"
// TODO: layout.ts - FlexLayout JSON 노드, MDI 탭 상태 규약 예정 (스켈레톤)
export {};
EOF

    # ── utils ──
    cat << 'EOF' > "$TARGET_DIR/frontend/src/utils/auth.ts"
// TODO: auth.ts - 권한 확인 및 로컬 스토리지 헬퍼 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/utils/excel.ts"
// TODO: excel.ts - 엑셀 파일 파싱 및 다운로드 유틸 예정 (스켈레톤)
export {};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/utils/formatters.ts"
// TODO: formatters.ts - 통화, 날짜, 사업자번호 등 포맷팅 함수 예정 (스켈레톤)
export {};
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
