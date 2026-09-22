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
    mkdir -p "$TARGET_DIR/frontend/src/pages/doc"
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
    mkdir -p "$TARGET_DIR/frontend/src/hooks"
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
    <!-- Web Fonts: Pretendard, NanumSquare Neo, Nanum Gothic -->
    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
      @font-face {
        font-family: 'NanumSquareNeo';
        font-weight: 400;
        font-style: normal;
        src: url('https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.woff') format('woff');
      }
      @font-face {
        font-family: 'NanumSquareNeo';
        font-weight: 700;
        font-style: normal;
        src: url('https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.woff') format('woff');
      }
      @font-face {
        font-family: 'NanumSquareNeo';
        font-weight: 800;
        font-style: normal;
        src: url('https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-dEb.woff') format('woff');
      }

      :root {
        --app-font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
      }

      html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: var(--app-font-family);
      }
    </style>
  </head>
  <body style="background-color:#f5f5f5; font-family: var(--app-font-family);">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/main.tsx"
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import App from './App.tsx';

// AG Grid Community 전체 모듈 등록
ModuleRegistry.registerModules([AllCommunityModule]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
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
  --flexlayout-font-family: var(--app-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
}

/* 탭 버튼 스타일: 모든 탭 동일 너비(160px - '1234 일이삼사오...' 수용), 선택된 탭만 테두리 표시 */
.flexlayout__tab_button {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  border-radius: 4px 4px 0 0 !important;
  margin-right: 2px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 4px 8px !important;
  border: 1px solid transparent !important; /* 미선택 탭: 테두리 없음 */
  background-color: transparent !important;
  color: #64748b !important;
  box-sizing: border-box !important;
  transition: none !important; /* 불필요한 탭 전환 지연/애니메이션 제거 - 즉각 반응 */
  animation: none !important;
  cursor: pointer !important;
}

.flexlayout__tab_button_content {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  flex: 1 !important;
  text-align: left !important;
  user-select: none !important;
}

.flexlayout__tab_button:hover {
  background-color: #f1f5f9 !important;
  color: #1677ff !important;
  border-color: transparent !important;
  transition: background-color 0.08s ease !important;
}

/* 현재 선택된 탭만 테두리 선 표시 (상단 2px 포인트 블루, 배경 흰색, 하단 경계 일체화) */
.flexlayout__tab_button--selected {
  background-color: #ffffff !important;
  border: 1px solid #d9dfe8 !important;
  border-top: 2px solid #1677ff !important;
  border-bottom: 1px solid #ffffff !important;
  color: #1677ff !important;
  font-weight: 600 !important;
  position: relative !important;
  z-index: 2 !important;
  transition: none !important; /* 애니메이션 제거 */
  animation: none !important;
}

.flexlayout__tab_button--selected:hover {
  background-color: #ffffff !important;
  border-color: #d9dfe8 !important;
  border-top-color: #1677ff !important;
  border-bottom-color: #ffffff !important;
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

/* 탭 내부 콘텐츠 영역: 브라우저/모니터 우측 외곽 스크롤바 방지 (뷰포트 피팅 및 탭 전환 즉각 반응) */
.flexlayout__tab {
  overflow: hidden !important;
  box-sizing: border-box !important;
  transition: none !important;
  animation: none !important;
}

/* 탭셋 헤더 우측 툴바 (모든 탭 닫기, 최대화/복원 버튼) */
.flexlayout__tab_toolbar {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  padding-right: 8px !important;
  --color-icon: #94a3b8;
}

.flexlayout-toolbar-custom-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 20px !important;
  height: 20px !important;
  border-radius: 4px !important;
  border: none !important;
  background: transparent !important;
  color: #94a3b8 !important;
  cursor: pointer !important;
  padding: 0 !important;
  transition: all 0.15s ease !important;
  user-select: none !important;
}

.flexlayout-toolbar-custom-btn:hover {
  background-color: #e2e8f0 !important;
  color: #334155 !important;
  --color-icon: #334155;
}

/* ── 글로벌 마우스 호버(Hover) 배경색 하이라이트 효과 ── */

/* 1. AG Grid (1101 일반기안서, 1102 지출결의서, 1103 자산취득품의, 대용량 그리드 등) */
.ag-theme-alpine {
  --ag-row-hover-color: rgba(22, 119, 255, 0.13) !important; /* 선명하고 부드러운 소프트 블루 */
  --ag-selected-row-background-color: rgba(22, 119, 255, 0.24) !important;
}

.ag-theme-alpine .ag-row:not(.ag-row-pinned) {
  cursor: pointer;
}

/* 2. Ant Design 일반 Table (MyPage 상세 일정, 전자결재함, 컴플라이언스 등) */
.ant-table-wrapper .ant-table-tbody > tr {
  transition: background-color 0.12s ease;
}

.ant-table-wrapper .ant-table-tbody > tr:not(.ant-table-placeholder):hover > td,
.ant-table-wrapper .ant-table-tbody > tr.ant-table-row:hover > td {
  background-color: #e6f4ff !important; /* Ant Design 대표 hover 소프트 블루 */
  cursor: pointer;
}

/* 3. MyPage 달력 날짜 셀 호버 효과 */
.mypage-calendar-day-cell {
  transition: background-color 0.12s ease, box-shadow 0.12s ease;
}

.mypage-calendar-day-cell.is-current-month:not(.is-chosen):hover {
  background-color: #f0f7ff !important;
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

// ── 1101 일반기안서 작성 타입 ──
export interface DraftDocItem {
  id: string;
  docNo: string;
  draftDate: string;
  category: string;
  title: string;
  dept: string;
  drafter: string;
  status: '임시저장' | '결재대기' | '진행중' | '승인완료' | '반려';
  approvalDate: string;
  isUrgent: boolean;
  retentionPeriod: string;
  content?: string;
}

// ── 1102 비용품의서 작성 타입 ──
export interface ExpenseDocItem {
  id: string;
  expenseDate: string;
  accountName: string;
  description: string;
  merchant: string;
  supplyAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: '법인카드' | '세금계산서' | '개인카드' | '현금영수증';
  evidenceStatus: '첨부완료' | '미첨부';
  dept: string;
  isDirty?: boolean;
}

// ── 1103 자산취득품의서 마스터/디테일 타입 ──
export interface AssetAcqMasterItem {
  id: string;
  docNo: string;
  reqDate: string;
  title: string;
  dept: string;
  requester: string;
  totalBudget: number;
  itemCount: number;
  status: '작성중' | '결재대기' | '승인완료' | '집행완료';
}

export interface AssetAcqDetailItem {
  id: string;
  masterId: string;
  assetCode: string;
  category: string;
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  location: string;
  targetUser: string;
  note?: string;
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/utils/storage.ts"
/**
 * Asset-ERP 단일 통합 JSON LocalStorage 관리 라이브러리
 * - 모든 화면 및 사용자 설정은 'asseterp_settings' 단일 키에 1개의 JSON 객체로 저장됩니다.
 * - 개별 설정 항목(menu23_font_size, flexlayout_model 등)을 일관되게 관리합니다.
 */

export const SETTINGS_STORAGE_KEY = 'asseterp_settings';

export interface SavedLayoutItem {
  id: string;
  name: string;
  createdAt: string;
  modelJson: any;
}

export interface AppSettings {
  menu23_font_size: number;
  font_family?: 'pretendard' | 'nanum-square-neo' | 'nanum-gothic' | 'system';
  flexlayout_model?: any;
  saved_layouts?: SavedLayoutItem[];
  mypage_employee_collapsed?: boolean;
  [key: string]: any;
}

export const defaultAppSettings: AppSettings = {
  menu23_font_size: 0,
  font_family: 'pretendard',
  saved_layouts: [],
  mypage_employee_collapsed: false,
};

function migrateLegacySettings(settings: Partial<AppSettings>): AppSettings {
  let migrated = false;
  const merged: AppSettings = { ...defaultAppSettings, ...settings };

  if (typeof window !== 'undefined') {
    const oldFont = localStorage.getItem('asseterp_font_size_offset');
    if (oldFont !== null) {
      try {
        merged.menu23_font_size = JSON.parse(oldFont);
        migrated = true;
      } catch (e) {}
      localStorage.removeItem('asseterp_font_size_offset');
    }

    const oldLayout = localStorage.getItem('asseterp_flexlayout_model');
    if (oldLayout !== null) {
      try {
        merged.flexlayout_model = JSON.parse(oldLayout);
        migrated = true;
      } catch (e) {}
      localStorage.removeItem('asseterp_flexlayout_model');
    }

    if (migrated) {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.error('[appSettingsStorage] 마이그레이션 저장 실패:', e);
      }
    }
  }

  return merged;
}

export const appSettingsStorage = {
  getAll(): AppSettings {
    if (typeof window === 'undefined') {
      return defaultAppSettings;
    }
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return migrateLegacySettings(parsed);
    } catch (e) {
      console.warn('[appSettingsStorage] 설정 파싱 실패, 기본값 사용:', e);
      return defaultAppSettings;
    }
  },

  get<K extends keyof AppSettings>(key: K, defaultValue?: AppSettings[K]): AppSettings[K] {
    const all = this.getAll();
    if (key in all && all[key] !== undefined) {
      return all[key];
    }
    return defaultValue !== undefined ? defaultValue : defaultAppSettings[key];
  },

  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    if (typeof window === 'undefined') return;
    try {
      const all = this.getAll();
      all[key] = value;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error(`[appSettingsStorage] '${String(key)}' 저장 실패:`, e);
    }
  },

  setMultiple(partial: Partial<AppSettings>): void {
    if (typeof window === 'undefined') return;
    try {
      const all = this.getAll();
      const updated = { ...all, ...partial };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[appSettingsStorage] 일괄 저장 실패:', e);
    }
  },

  remove(key: keyof AppSettings): void {
    if (typeof window === 'undefined') return;
    try {
      const all = this.getAll();
      delete all[key];
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error(`[appSettingsStorage] '${String(key)}' 삭제 실패:`, e);
    }
  },

  reset(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultAppSettings));
    } catch (e) {
      console.error('[appSettingsStorage] 초기화 실패:', e);
    }
  },

  getSavedLayouts(): SavedLayoutItem[] {
    return this.get('saved_layouts', []) || [];
  },

  saveLayout(name: string, modelJson: any): SavedLayoutItem {
    const list = this.getSavedLayouts();
    const cleanName = name.trim() || `레이아웃 ${list.length + 1}`;
    const newItem: SavedLayoutItem = {
      id: `layout_${Date.now()}`,
      name: cleanName,
      createdAt: new Date().toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      modelJson,
    };
    const updated = [newItem, ...list];
    this.set('saved_layouts', updated);
    return newItem;
  },

  deleteSavedLayout(id: string): void {
    const list = this.getSavedLayouts();
    const updated = list.filter((item) => item.id !== id);
    this.set('saved_layouts', updated);
  },
};

export const appStorage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = localStorage.getItem(`asseterp_${key}`);
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(`asseterp_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`asseterp_${key}`);
    } catch {}
  },
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/hooks/useAppSetting.ts"
import { useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  appSettingsStorage,
  SETTINGS_STORAGE_KEY,
} from '../utils/storage';

export function useAppSetting<K extends keyof AppSettings>(
  key: K,
  defaultValue?: AppSettings[K]
): [AppSettings[K], (value: AppSettings[K] | ((prev: AppSettings[K]) => AppSettings[K])) => void] {
  const [storedValue, setStoredValue] = useState<AppSettings[K]>(() => {
    return appSettingsStorage.get(key, defaultValue);
  });

  const setValue = useCallback(
    (value: AppSettings[K] | ((prev: AppSettings[K]) => AppSettings[K])) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        appSettingsStorage.set(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue) as AppSettings;
          if (key in parsed) {
            setStoredValue(parsed[key]);
          }
        } catch (err) {
          console.warn(`[useAppSetting] 외부 변경 파싱 실패 (${String(key)}):`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/utils/font.ts"
export type FontFamilyId = 'pretendard' | 'nanum-square-neo' | 'nanum-gothic' | 'system';

export interface FontOption {
  id: FontFamilyId;
  name: string;
  badge?: string;
  cssFamily: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'pretendard',
    name: 'Pretendard',
    badge: '추천',
    cssFamily:
      '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
    description: '작은 글씨(10~12px) 및 숫자/코드 정렬에 최적화된 ERP 추천 폰트',
  },
  {
    id: 'nanum-square-neo',
    name: '나눔스퀘어 네오',
    badge: '네이버',
    cssFamily:
      '"NanumSquareNeo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    description: '단정하고 현대적인 직선형 네이버 고딕 폰트',
  },
  {
    id: 'nanum-gothic',
    name: '나눔고딕',
    badge: '클래식',
    cssFamily:
      '"Nanum Gothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    description: '부드러운 곡선의 친근한 대중적 한글 고딕 폰트',
  },
  {
    id: 'system',
    name: '시스템 기본',
    badge: 'OS 기본',
    cssFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif',
    description: '맑은 고딕(Windows) / 산돌고딕(macOS) 등 OS 내장 폰트',
  },
];

export function getFontOption(id?: string): FontOption {
  return FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0];
}

export function applyGlobalFont(id?: string): string {
  const fontOpt = getFontOption(id);
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--app-font-family', fontOpt.cssFamily);
    document.body.style.fontFamily = fontOpt.cssFamily;
  }
  return fontOpt.cssFamily;
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/hooks/useLocalStorage.ts"
import { useState, useEffect, useCallback } from 'react';
import { appStorage } from '../utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return appStorage.get<T>(key, initialValue);
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        appStorage.set<T>(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const fullKey = `asseterp_${key}`;
      if (e.key === fullKey && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue) as T;
          setStoredValue(parsed);
        } catch (err) {
          console.warn(`[useLocalStorage] 외부 변경 이벤트 파싱 실패 (${key}):`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/mock/data.ts"
import {
  MenuLevel_1,
  EmployeeStatus,
  ScheduleItem,
  DayListItem,
  ApprovalItem,
  ComplianceItem,
  LargeAssetItem,
  DraftDocItem,
  ExpenseDocItem,
  AssetAcqMasterItem,
  AssetAcqDetailItem,
} from '../types';
 
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
    dueDate: '2026-09-16 15:00',
    processedDate: '대기',
    detail: '보기',
  },
  {
    id: 's3',
    category: '자리비움',
    title: '금융감독원 펀드 분기 결산 업무보고 세미나 참석',
    registrant: '김도영',
    dueDate: '2026-09-16 17:00',
    processedDate: '완료',
    detail: '보기',
  },
  {
    id: 's4',
    category: '부서일정',
    title: '사모펀드 수탁고 일일 대사 및 잔고 검증 회의',
    registrant: '이정훈',
    dueDate: '2026-09-16 11:30',
    processedDate: '완료',
    detail: '보기',
  },
  {
    id: 's5',
    category: '부서일정',
    title: '신탁업자 고유자산 운용내역 컴플라이언스 정기 점검',
    registrant: '박지민',
    dueDate: '2026-09-16 14:00',
    processedDate: '진행중',
    detail: '보기',
  },
  {
    id: 's6',
    category: '나의일정',
    title: '신규 퇴직연금 디폴트옵션 상품 등록 심사 보고',
    registrant: '김도영',
    dueDate: '2026-09-16 16:30',
    processedDate: '대기',
    detail: '보기',
  },
  {
    id: 's7',
    category: '부서일정',
    title: '대체투자 자산 공정가치 평가 실무위원회 개최',
    registrant: '정민우',
    dueDate: '2026-09-16 17:00',
    processedDate: '대기',
    detail: '보기',
  },
  {
    id: 's8',
    category: '부서일정',
    title: '외부 감사인 상반기 전산감사 실사 인터뷰 대응',
    registrant: '김도영',
    dueDate: '2026-09-16 10:00',
    processedDate: '완료',
    detail: '보기',
  },
  {
    id: 's9',
    category: '나의일정',
    title: '부서 정기 주간 업무 보고 및 포트폴리오 리뷰',
    registrant: '강동원',
    dueDate: '2026-09-16 09:30',
    processedDate: '완료',
    detail: '보기',
  },
  {
    id: 's10',
    category: '부서일정',
    title: '리스크관리위원회 의결사항 사후 모니터링 취합',
    registrant: '한승우',
    dueDate: '2026-09-16 17:30',
    processedDate: '대기',
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

let cached10kAssetData: LargeAssetItem[] | null = null;

// 10,000건 이상의 고성능 대용량 데이터 생성기 (AgGrid 가상 스크롤 테스트용)
export function generateLargeAssetData(count: number = 10000): LargeAssetItem[] {
  if (count === 10000 && cached10kAssetData) {
    return cached10kAssetData;
  }
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
  if (count === 10000) {
    cached10kAssetData = items;
  }
  return items;
}

// ── 1101 일반기안서 목업 데이터 ──
export const mockDraftDocList: DraftDocItem[] = [
  {
    id: 'dft-1',
    docNo: 'DFT-2026-0089',
    draftDate: '2026-09-22',
    category: '일반기안',
    title: '[책무구조도] 2026년 3분기 내부통제 관리의무 이행점검 결과 보고 및 개선안 승인의 건',
    dept: 'IT개발실',
    drafter: '김도영',
    status: '진행중',
    approvalDate: '2026-09-22 14:30',
    isUrgent: true,
    retentionPeriod: '5년',
    content: '금융회사 지배구조법 개정에 따른 3분기 임원별 관리의무 및 IT정보보호 영역 점검 결과를 보고하며, 미흡사항에 대한 보완조치 계획을 상신합니다.',
  },
  {
    id: 'dft-2',
    docNo: 'DFT-2026-0088',
    draftDate: '2026-09-21',
    category: '업무협조',
    title: '신규 사모투자재간접펀드(PEF) 수탁계약 체결에 따른 전산시스템 연계 지원 요청',
    dept: '자산운용팀',
    drafter: '이정훈',
    status: '승인완료',
    approvalDate: '2026-09-21 17:10',
    isUrgent: false,
    retentionPeriod: '영구',
    content: '신규 출시 예정인 PEF 펀드의 수탁사(신한은행) 전문 대사 및 일일 잔고 검증 프로세스 구축을 위한 IT 지원을 요청합니다.',
  },
  {
    id: 'dft-3',
    docNo: 'DFT-2026-0087',
    draftDate: '2026-09-20',
    category: '인사총무',
    title: '2026년 하반기 전문계약직 운용역 채용 계획안 및 연봉 테이블 검토의 건',
    dept: '인사총무팀',
    drafter: '정가해',
    status: '결재대기',
    approvalDate: '-',
    isUrgent: false,
    retentionPeriod: '3년',
    content: '대체투자 및 부동산 실물자산 운용역 2인 채용에 관한 공고 및 심사 기준 승인을 요청드립니다.',
  },
  {
    id: 'dft-4',
    docNo: 'DFT-2026-0086',
    draftDate: '2026-09-19',
    category: '규정개정',
    title: '임직원 개인정보보호 및 단말기 보안통제 내규 일부 개정의 건',
    dept: '준법감시실',
    drafter: '한송이',
    status: '승인완료',
    approvalDate: '2026-09-20 11:20',
    isUrgent: false,
    retentionPeriod: '영구',
    content: '금융보안원 보안관제 권고에 따라 망분리 예외 단말에 대한 보안수칙을 강화하고자 관련 내규를 개정합니다.',
  },
  {
    id: 'dft-5',
    docNo: 'DFT-2026-0085',
    draftDate: '2026-09-18',
    category: '일반기안',
    title: '추석 연휴 전산인프라 비상당직 편성 및 24시간 장애대응 매뉴얼 공유',
    dept: 'IT정보전략실',
    drafter: '김승주',
    status: '승인완료',
    approvalDate: '2026-09-18 16:45',
    isUrgent: true,
    retentionPeriod: '1년',
    content: '추석 명절 연휴 기간 데이터센터 서버 모니터링 및 비상연락망 가동 계획입니다.',
  },
  {
    id: 'dft-6',
    docNo: 'DFT-2026-0084',
    draftDate: '2026-09-17',
    category: '제휴제안',
    title: '글로벌 ETF 시장데이터 피드(Bloomberg B-PIPE) 제휴 라이선스 갱신 품의',
    dept: '금융영업부',
    drafter: '박동진',
    status: '반려',
    approvalDate: '2026-09-18 09:30',
    isUrgent: false,
    retentionPeriod: '3년',
    content: '단가 인상률이 과다하여 대체 솔루션(Refinitiv) 검토 후 재상신 요망.',
  },
  {
    id: 'dft-7',
    docNo: 'DFT-2026-0083',
    draftDate: '2026-09-16',
    category: '일반기안',
    title: '사내 업무포털 및 ERP UI 전환 프로토타입(Ant Design) 시범도입 계획',
    dept: 'IT개발실',
    drafter: '김도영',
    status: '임시저장',
    approvalDate: '-',
    isUrgent: false,
    retentionPeriod: '3년',
    content: '레거시 GXT 프레임워크를 대체하기 위한 Spring Boot + React + Ant Design 프로토타입 개발 보고서.',
  },
  {
    id: 'dft-8',
    docNo: 'DFT-2026-0082',
    draftDate: '2026-09-15',
    category: '업무협조',
    title: '외감법인 외부회계감사 중간감사 수검 준비 및 자료제출 협조',
    dept: '재무회계본부',
    drafter: '나필순',
    status: '진행중',
    approvalDate: '2026-09-16 10:00',
    isUrgent: false,
    retentionPeriod: '5년',
    content: '삼일회계법인 중간 전산감사 실사 인터뷰 및 재무자료 제출 일정 안내.',
  },
  {
    id: 'dft-9',
    docNo: 'DFT-2026-0081',
    draftDate: '2026-09-14',
    category: '인사총무',
    title: '2026년 10월 전사 체육대회 및 추계 워크숍 일정 승인 건',
    dept: '인사총무팀',
    drafter: '정가해',
    status: '승인완료',
    approvalDate: '2026-09-15 15:30',
    isUrgent: false,
    retentionPeriod: '1년',
    content: '가평 마이다스리조트 전사 임직원 추계 워크숍 진행 계획.',
  },
  {
    id: 'dft-10',
    docNo: 'DFT-2026-0080',
    draftDate: '2026-09-13',
    category: '일반기안',
    title: '컴플라이언스 상시 모니터링 룰셋(불건전영업행위 방지) 업데이트 승인',
    dept: '컴플라이언스팀',
    drafter: '천영임',
    status: '승인완료',
    approvalDate: '2026-09-14 14:00',
    isUrgent: false,
    retentionPeriod: '5년',
    content: '자본시장법 시행령 개정에 맞춘 사전 주문 이상징후 탐지 룰 적용.',
  },
];

// ── 1102 비용품의서 목업 데이터 ──
export const mockExpenseDocList: ExpenseDocItem[] = [
  {
    id: 'exp-1',
    expenseDate: '2026-09-22',
    accountName: '지급수수료',
    description: 'AWS 클라우드 인프라 8월 사용료 정산 (EC2, RDS, S3)',
    merchant: '아마존웹서비시즈코리아(유)',
    supplyAmount: 4850000,
    taxAmount: 485000,
    totalAmount: 5335000,
    paymentMethod: '세금계산서',
    evidenceStatus: '첨부완료',
    dept: 'IT개발실',
  },
  {
    id: 'exp-2',
    expenseDate: '2026-09-22',
    accountName: '회의비',
    description: '책무구조도 외부 법률자문위원회 실무 회의 및 식대',
    merchant: '여의도 한암동 본점',
    supplyAmount: 380000,
    taxAmount: 38000,
    totalAmount: 418000,
    paymentMethod: '법인카드',
    evidenceStatus: '첨부완료',
    dept: '준법감시실',
  },
  {
    id: 'exp-3',
    expenseDate: '2026-09-21',
    accountName: '도서인쇄비',
    description: '금융투자협회 2026년 자본시장법 해설집 및 최신 실무교재 구매',
    merchant: '교보문고 영등포점',
    supplyAmount: 185000,
    taxAmount: 0,
    totalAmount: 185000,
    paymentMethod: '법인카드',
    evidenceStatus: '첨부완료',
    dept: 'IT개발실',
  },
  {
    id: 'exp-4',
    expenseDate: '2026-09-20',
    accountName: '소모품비',
    description: 'IT개발실 및 펀드운용팀 토너 카트리지 및 A4 복사용지 20박스',
    merchant: '오피스디포 여의도점',
    supplyAmount: 420000,
    taxAmount: 42000,
    totalAmount: 462000,
    paymentMethod: '법인카드',
    evidenceStatus: '첨부완료',
    dept: '인사총무팀',
  },
  {
    id: 'exp-5',
    expenseDate: '2026-09-19',
    accountName: '여비교통비',
    description: '부산 벡스코 금융포럼 출장 KTX 왕복 및 시내교통비 정산 (3인)',
    merchant: '한국철도공사',
    supplyAmount: 358800,
    taxAmount: 0,
    totalAmount: 358800,
    paymentMethod: '법인카드',
    evidenceStatus: '첨부완료',
    dept: '금융영업부',
  },
  {
    id: 'exp-6',
    expenseDate: '2026-09-18',
    accountName: '교육훈련비',
    description: '한국금융투자협회 금융사 IT 보안 아키텍처 전문과정 수강료 (김도영)',
    merchant: '금융투자교육원',
    supplyAmount: 850000,
    taxAmount: 0,
    totalAmount: 850000,
    paymentMethod: '세금계산서',
    evidenceStatus: '첨부완료',
    dept: 'IT개발실',
  },
  {
    id: 'exp-7',
    expenseDate: '2026-09-17',
    accountName: '복리후생비',
    description: '개발팀 야간 비상 장애대응 근무자 특식 및 다과비',
    merchant: '배달의민족 (우아한형제들)',
    supplyAmount: 145000,
    taxAmount: 14500,
    totalAmount: 159500,
    paymentMethod: '법인카드',
    evidenceStatus: '첨부완료',
    dept: 'IT개발실',
  },
  {
    id: 'exp-8',
    expenseDate: '2026-09-16',
    accountName: '지급수수료',
    description: '코스콤 FNPricing 펀드 기준가 산정 엔진 9월 라이선스 이용료',
    merchant: '(주)코스콤',
    supplyAmount: 3200000,
    taxAmount: 320000,
    totalAmount: 3520000,
    paymentMethod: '세금계산서',
    evidenceStatus: '첨부완료',
    dept: '자산운용팀',
  },
  {
    id: 'exp-9',
    expenseDate: '2026-09-15',
    accountName: '소모품비',
    description: '본사 전산실 랙 선반 및 CAT.7 랜케이블/패치코드 일체',
    merchant: '강원전자 주식회사',
    supplyAmount: 260000,
    taxAmount: 26000,
    totalAmount: 286000,
    paymentMethod: '법인카드',
    evidenceStatus: '첨부완료',
    dept: 'IT정보전략실',
  },
  {
    id: 'exp-10',
    expenseDate: '2026-09-14',
    accountName: '회의비',
    description: '기관투자가 대상 신규 OCIO 상품 설명회 및 오찬 미팅',
    merchant: '더플라자호텔 세븐스퀘어',
    supplyAmount: 640000,
    taxAmount: 64000,
    totalAmount: 704000,
    paymentMethod: '법인카드',
    evidenceStatus: '첨부완료',
    dept: '금융영업부',
  },
];

// ── 1103 자산취득품의서 마스터/디테일 목업 데이터 ──
export const mockAssetAcqMasterList: AssetAcqMasterItem[] = [
  {
    id: 'acq-m1',
    docNo: 'ACQ-2026-0041',
    reqDate: '2026-09-22',
    title: '2026년 하반기 클라우드 전환 전산 개발장비 및 서버 인프라 확충의 건',
    dept: 'IT개발실',
    requester: '김도영',
    totalBudget: 42800000,
    itemCount: 4,
    status: '결재대기',
  },
  {
    id: 'acq-m2',
    docNo: 'ACQ-2026-0040',
    reqDate: '2026-09-19',
    title: '여의도 파크원 본사 10층 자산운용 트레이딩룸 PC/모니터 듀얼 환경 구축',
    dept: '자산운용팀',
    requester: '이정훈',
    totalBudget: 24500000,
    itemCount: 3,
    status: '승인완료',
  },
  {
    id: 'acq-m3',
    docNo: 'ACQ-2026-0039',
    reqDate: '2026-09-15',
    title: '가산 IDC 센터 백업 스토리지 및 네트워크 방화벽 교체 도입의 건',
    dept: 'IT정보전략실',
    requester: '김승주',
    totalBudget: 68000000,
    itemCount: 2,
    status: '집행완료',
  },
  {
    id: 'acq-m4',
    docNo: 'ACQ-2026-0038',
    reqDate: '2026-09-10',
    title: '준법감시실 및 컴플라이언스 상시감사 전용 단말기 및 암호화 USB 구매',
    dept: '준법감시실',
    requester: '한송이',
    totalBudget: 7800000,
    itemCount: 2,
    status: '승인완료',
  },
  {
    id: 'acq-m5',
    docNo: 'ACQ-2026-0037',
    reqDate: '2026-09-05',
    title: '신규 입사자 사무용 인체공학 의자 및 전동 데스크 가구 일괄 취득',
    dept: '인사총무팀',
    requester: '정가해',
    totalBudget: 15400000,
    itemCount: 3,
    status: '집행완료',
  },
];

export const mockAssetAcqDetailList: AssetAcqDetailItem[] = [
  // acq-m1 (4건)
  {
    id: 'acq-d1',
    masterId: 'acq-m1',
    assetCode: 'SRV-001',
    category: 'IT서버',
    name: 'Dell PowerEdge R760 Rack Server',
    spec: 'Dual Xeon Gold 6430 / 256GB RAM / 4x1.92TB NVMe',
    quantity: 2,
    unitPrice: 14500000,
    totalPrice: 29000000,
    location: 'IDC 가산센터 R-3',
    targetUser: 'IT개발실 공용',
    note: '클라우드 마이그레이션 백엔드 테스트베드',
  },
  {
    id: 'acq-d2',
    masterId: 'acq-m1',
    assetCode: 'DEV-002',
    category: 'PC/노트북',
    name: 'Apple MacBook Pro 16형 (M3 Max)',
    spec: 'M3 Max 16코어 / 64GB RAM / 1TB SSD',
    quantity: 2,
    unitPrice: 4800000,
    totalPrice: 9600000,
    location: '본사 8F 개발실',
    targetUser: '김도영 이사, 수석개발자',
    note: '아키텍처 설계 및 대규모 빌드용',
  },
  {
    id: 'acq-d3',
    masterId: 'acq-m1',
    assetCode: 'MON-003',
    category: 'PC/노트북',
    name: 'Dell UltraSharp 32인치 4K 모니터 (U3223QE)',
    spec: '32형 IPS Black 4K / USB-C 허브 / 400nits',
    quantity: 3,
    unitPrice: 1100000,
    totalPrice: 3300000,
    location: '본사 8F 개발실',
    targetUser: '개발팀원 공용',
    note: '다중 분할 소스코드 뷰어용',
  },
  {
    id: 'acq-d4',
    masterId: 'acq-m1',
    assetCode: 'LIC-004',
    category: 'SW라이선스',
    name: 'IntelliJ IDEA Ultimate 10 User Pack',
    spec: 'JetBrains 상업용 연간 구독 라이선스',
    quantity: 1,
    unitPrice: 900000,
    totalPrice: 900000,
    location: '본사 전사',
    targetUser: '개발팀 전체',
    note: '2026-2027 연간 갱신',
  },

  // acq-m2 (3건)
  {
    id: 'acq-d5',
    masterId: 'acq-m2',
    assetCode: 'TRD-010',
    category: 'PC/노트북',
    name: 'HP Z4 G5 Workstation',
    spec: 'Intel Xeon W5 / 64GB DDR5 / RTX 4000 Ada 20GB',
    quantity: 3,
    unitPrice: 5200000,
    totalPrice: 15600000,
    location: '본사 10F 트레이딩룸',
    targetUser: '이정훈 팀장 외 2인',
    note: '고빈도 실시간 틱데이터 처리용',
  },
  {
    id: 'acq-d6',
    masterId: 'acq-m2',
    assetCode: 'MON-011',
    category: 'PC/노트북',
    name: 'LG 울트라기어 34인치 WQHD 곡면 모니터',
    spec: '34형 21:9 WQHD 커브드 / 160Hz',
    quantity: 6,
    unitPrice: 850000,
    totalPrice: 5100000,
    location: '본사 10F 트레이딩룸',
    targetUser: '운용역 3인 듀얼 셋업',
    note: '블룸버그 및 차트 모니터링용',
  },
  {
    id: 'acq-d7',
    masterId: 'acq-m2',
    assetCode: 'NET-012',
    category: '네트워크장비',
    name: 'Cisco Catalyst 1000 24포트 PoE 스위치',
    spec: '24 x 10/100/1000, 4 x 1G SFP',
    quantity: 1,
    unitPrice: 3800000,
    totalPrice: 3800000,
    location: '본사 10F EPS실',
    targetUser: '트레이딩룸 네트워크',
    note: '독립 망분리 저지연 라우팅',
  },

  // acq-m3 (2건)
  {
    id: 'acq-d8',
    masterId: 'acq-m3',
    assetCode: 'STO-020',
    category: 'IT서버',
    name: 'Synology Enterprise All-Flash FS3410',
    spec: '24베이 2.5인치 / 10GbE SFP+ / 64GB ECC',
    quantity: 1,
    unitPrice: 42000000,
    totalPrice: 42000000,
    location: '가산 IDC 4층',
    targetUser: '전사 백업 시스템',
    note: '자산운용 데이터 실시간 스냅샷',
  },
  {
    id: 'acq-d9',
    masterId: 'acq-m3',
    assetCode: 'FW-021',
    category: '네트워크장비',
    name: 'Palo Alto Networks PA-1410 차세대 방화벽',
    spec: '최대 처리량 8.5Gbps / Threat Prevention 4.5G',
    quantity: 1,
    unitPrice: 26000000,
    totalPrice: 26000000,
    location: '가산 IDC 4층',
    targetUser: '인프라보안',
    note: '금융보안 가이드라인 차세대 방화벽 교체',
  },

  // acq-m4 (2건)
  {
    id: 'acq-d10',
    masterId: 'acq-m4',
    assetCode: 'SEC-030',
    category: 'PC/노트북',
    name: 'Lenovo ThinkPad P16s Gen 2 (보안단말)',
    spec: 'AMD Ryzen 7 PRO / 32GB / SmartCard 리더 탑재',
    quantity: 2,
    unitPrice: 3200000,
    totalPrice: 6400000,
    location: '본사 11F 준법감시실',
    targetUser: '한송이 차장, 박지민 대리',
    note: '감사로그 열람 전용 분리단말',
  },
  {
    id: 'acq-d11',
    masterId: 'acq-m4',
    assetCode: 'SEC-031',
    category: '사무용기기',
    name: 'DataLocker FIPS 140-2 암호화 외장보안키 1TB',
    spec: '하드웨어 256비트 AES 암호화 키패드',
    quantity: 2,
    unitPrice: 700000,
    totalPrice: 1400000,
    location: '준법감시실 금고',
    targetUser: '준법감시인 관리',
    note: '감사 증빙자료 안전 보관',
  },

  // acq-m5 (3건)
  {
    id: 'acq-d12',
    masterId: 'acq-m5',
    assetCode: 'FUR-040',
    category: '사무용기기',
    name: 'Herman Miller New Aeron Chair (Full)',
    spec: '포워드 틸팅 / 럼버 서포트 / 그라파이트 프레임',
    quantity: 6,
    unitPrice: 1900000,
    totalPrice: 11400000,
    location: '본사 8층/10층',
    targetUser: '신규 입사 전문직',
    note: '직원 복지 인체공학 체어',
  },
  {
    id: 'acq-d13',
    masterId: 'acq-m5',
    assetCode: 'FUR-041',
    category: '사무용기기',
    name: '데스커 모션데스크 듀얼모터 전동 높이조절',
    spec: '1600x800 / 메모리 프리셋 / 스마트 콘센트',
    quantity: 3,
    unitPrice: 850000,
    totalPrice: 2550000,
    location: '본사 8층 개발실',
    targetUser: '개발팀 집중 업무존',
    note: '스탠딩 워크스페이스 구축',
  },
  {
    id: 'acq-d14',
    masterId: 'acq-m5',
    assetCode: 'FUR-042',
    category: '사무용기기',
    name: '펠로우즈 서서일하는 풋레스트 발받침대',
    spec: '각도조절형 마사지 롤러 내장',
    quantity: 5,
    unitPrice: 290000,
    totalPrice: 1450000,
    location: '본사 8층 개발실',
    targetUser: '개발팀',
    note: '자세교정 악세사리',
  },
];
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/TopBar.tsx"
import React, { useState, useMemo } from 'react';
import { Input, Avatar, Dropdown, MenuProps, Tooltip, AutoComplete, Modal, Popconfirm, message, Tag } from 'antd';
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
  AppstoreOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FontSizeOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { MenuLevel_1, MenuLevel_3 } from '../types';
import { menuLevel_1_List } from '../mock/data';
import { SavedLayoutItem } from '../utils/storage';
import { FontFamilyId, FONT_OPTIONS, getFontOption } from '../utils/font';

interface TopBarProps {
  sidebarPinned: boolean;
  onToggleSidebarPin: () => void;
  onOpenScreen?: (item: MenuLevel_3, parent: MenuLevel_1) => void;
  savedLayouts?: SavedLayoutItem[];
  onSaveNamedLayout?: (name: string) => void;
  onLoadNamedLayout?: (item: SavedLayoutItem) => void;
  onDeleteNamedLayout?: (id: string) => void;
  onResetLayout?: () => void;
  currentFontId?: FontFamilyId;
  onChangeFont?: (id: FontFamilyId) => void;
}

interface ScreenSearchItem {
  code: string;
  title: string;
  categoryTitle: string;
  parentLevel1: MenuLevel_1;
  item: MenuLevel_3;
}

export const TopBar: React.FC<TopBarProps> = ({
  sidebarPinned,
  onToggleSidebarPin,
  onOpenScreen,
  savedLayouts = [],
  onSaveNamedLayout,
  onLoadNamedLayout,
  onDeleteNamedLayout,
  onResetLayout,
  currentFontId = 'pretendard',
  onChangeFont,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');

  // ── 전체 메뉴 평탄화 (화면번호/메뉴명 검색용) ──
  const allScreens: ScreenSearchItem[] = useMemo(() => {
    const list: ScreenSearchItem[] = [];
    for (const m1 of menuLevel_1_List) {
      for (const grp of m1.groups) {
        for (const item of grp.items) {
          list.push({
            code: item.code,
            title: item.title,
            categoryTitle: m1.title,
            parentLevel1: m1,
            item,
          });
        }
      }
    }
    return list;
  }, []);

  // ── 화면번호/메뉴명 자동완성 옵션 목록 ──
  const searchOptions = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return [];
    return allScreens
      .filter((s) => s.code.toLowerCase().includes(term) || s.title.toLowerCase().includes(term))
      .slice(0, 10)
      .map((s) => ({
        value: s.code,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <Tag color="blue" style={{ marginRight: 6, fontSize: 11, padding: '0 4px' }}>
                {s.code}
              </Tag>
              <span style={{ fontWeight: 500, fontSize: 12 }}>{s.title}</span>
            </span>
            <span style={{ fontSize: 11, color: '#8c8c8c' }}>{s.categoryTitle}</span>
          </div>
        ),
        screen: s,
      }));
  }, [searchValue, allScreens]);

  // ── 검색어 입력 후 Enter 또는 선택 시 화면 열기 ──
  const handleSelectScreen = (code: string) => {
    const found = allScreens.find((s) => s.code === code);
    if (found && onOpenScreen) {
      onOpenScreen(found.item, found.parentLevel1);
      message.success(`[${found.code}] ${found.title} 화면을 열었습니다.`);
      setSearchValue('');
    }
  };

  const handleSearchEnter = () => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return;

    // 1. 코드 완전 일치 검색
    let found = allScreens.find((s) => s.code.toLowerCase() === term);
    // 2. 제목 완전 일치 검색
    if (!found) {
      found = allScreens.find((s) => s.title.toLowerCase() === term);
    }
    // 3. 코드 또는 제목 부분 일치 검색
    if (!found) {
      found = allScreens.find(
        (s) => s.code.toLowerCase().includes(term) || s.title.toLowerCase().includes(term)
      );
    }

    if (found && onOpenScreen) {
      onOpenScreen(found.item, found.parentLevel1);
      message.success(`[${found.code}] ${found.title} 화면을 열었습니다.`);
      setSearchValue('');
    } else {
      message.warning(`화면번호 또는 메뉴 '${searchValue}'을(를) 찾을 수 없습니다.`);
    }
  };

  // ── 레이아웃 저장 확인 ──
  const handleSaveLayoutConfirm = () => {
    if (!newLayoutName.trim()) {
      message.warning('레이아웃 이름을 입력해 주세요.');
      return;
    }
    onSaveNamedLayout?.(newLayoutName.trim());
    setNewLayoutName('');
    setIsSaveModalOpen(false);
  };

  // ── 화면 레이아웃 드롭다운 메뉴 아이템 ──
  const layoutMenuItems: MenuProps['items'] = [
    {
      key: 'save-current',
      icon: <PlusOutlined style={{ color: '#1677ff' }} />,
      label: '현재 레이아웃 이름 지정 저장...',
      onClick: () => {
        setNewLayoutName(`화면배치 ${savedLayouts.length + 1}`);
        setIsSaveModalOpen(true);
      },
    },
    { type: 'divider' },
    {
      key: 'saved-group',
      type: 'group',
      label: `저장된 레이아웃 목록 (${savedLayouts.length})`,
      children:
        savedLayouts.length > 0
          ? savedLayouts.map((item) => ({
              key: item.id,
              label: (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: 220,
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                    onClick={() => onLoadNamedLayout?.(item)}
                  >
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: '#8c8c8c', marginLeft: 8 }}>
                      {item.createdAt}
                    </span>
                  </div>
                  <Popconfirm
                    title="레이아웃 삭제"
                    description={`'${item.name}'을(를) 삭제하시겠습니까?`}
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      onDeleteNamedLayout?.(item.id);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="삭제"
                    cancelText="취소"
                  >
                    <DeleteOutlined
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: '#ff4d4f', fontSize: 12, padding: '2px 4px', cursor: 'pointer' }}
                    />
                  </Popconfirm>
                </div>
              ),
            }))
          : [
              {
                key: 'no-layouts',
                disabled: true,
                label: <span style={{ color: '#8c8c8c', fontSize: 12 }}>저장된 레이아웃이 없습니다</span>,
              },
            ],
    },
    { type: 'divider' },
    {
      key: 'reset-default',
      icon: <ReloadOutlined />,
      label: '기본 레이아웃으로 초기화',
      onClick: () => onResetLayout?.(),
    },
  ];

  const currentFontOpt = getFontOption(currentFontId);

  // ── 폰트 선택 드롭다운 메뉴 아이템 (Pretendard vs 나눔폰트 비교) ──
  const fontMenuItems: MenuProps['items'] = [
    {
      key: 'font-group-header',
      type: 'group',
      label: (
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
          한글 폰트 비교 / 선택 (ERP 환경)
        </span>
      ),
      children: FONT_OPTIONS.map((opt) => ({
        key: opt.id,
        label: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: 280,
              gap: 12,
              padding: '4px 0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontWeight: currentFontId === opt.id ? 700 : 500,
                    fontSize: 13,
                    color: currentFontId === opt.id ? '#1677ff' : '#1e293b',
                  }}
                >
                  {opt.name}
                </span>
                {opt.badge && (
                  <Tag
                    color={
                      opt.id === 'pretendard'
                        ? 'blue'
                        : opt.id === 'nanum-square-neo'
                        ? 'green'
                        : opt.id === 'nanum-gothic'
                        ? 'orange'
                        : 'default'
                    }
                    style={{ margin: 0, fontSize: 10, padding: '0 4px', lineHeight: '16px' }}
                  >
                    {opt.badge}
                  </Tag>
                )}
              </div>
              <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{opt.description}</span>
            </div>
            {currentFontId === opt.id && (
              <CheckOutlined style={{ color: '#1677ff', fontSize: 13, flexShrink: 0 }} />
            )}
          </div>
        ),
        onClick: () => {
          onChangeFont?.(opt.id);
          message.info(`글꼴이 '${opt.name}'(으)로 적용되었습니다.`);
        },
      })),
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '내 정보 수정' },
    { key: 'setting', icon: <SettingOutlined />, label: '개인 환경설정' },
    { type: 'divider' },
    { key: 'logout', icon: <PoweroffOutlined />, label: '로그아웃', danger: true },
  ];

  return (
    <>
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
        {/* Left section: Logo, Search, Layout Management */}
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

          {/* ── 화면번호/메뉴명 입력 AutoComplete 검색창 (Enter 호출 지원) ── */}
          <div style={{ marginLeft: 12 }}>
            <AutoComplete
              value={searchValue}
              options={searchOptions}
              onSelect={handleSelectScreen}
              onChange={setSearchValue}
              style={{ width: 240 }}
            >
              <Input
                placeholder="화면번호/메뉴명 (Enter)"
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                onPressEnter={handleSearchEnter}
                allowClear
                style={{
                  borderRadius: 20,
                  fontSize: 12,
                  background: '#fff',
                  border: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
                }}
              />
            </AutoComplete>
          </div>

          {/* ── 화면 레이아웃 관리 드롭다운 (저장/불러오기) ── */}
          <Dropdown menu={{ items: layoutMenuItems }} trigger={['click']} placement="bottomLeft">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                fontSize: 12,
                fontWeight: 500,
                userSelect: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                transition: 'all 0.15s ease',
              }}
              title="화면 레이아웃 저장 및 불러오기"
            >
              <AppstoreOutlined style={{ fontSize: 13 }} />
              <span>화면 레이아웃</span>
              <DownOutlined style={{ fontSize: 9, opacity: 0.8 }} />
            </div>
          </Dropdown>

          {/* ── 폰트 선택 드롭다운 (Pretendard vs 나눔폰트 비교) ── */}
          <Dropdown menu={{ items: fontMenuItems }} trigger={['click']} placement="bottomLeft">
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                fontSize: 12,
                fontWeight: 500,
                userSelect: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                transition: 'all 0.15s ease',
              }}
              title="글꼴 실시간 비교 및 전환 (Pretendard vs 나눔폰트)"
            >
              <FontSizeOutlined style={{ fontSize: 13 }} />
              <span>글꼴: {currentFontOpt.name}</span>
              <DownOutlined style={{ fontSize: 9, opacity: 0.8 }} />
            </div>
          </Dropdown>
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

          {/* Tool action icons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              borderLeft: '1px solid rgba(255,255,255,0.25)',
              paddingLeft: 14,
            }}
          >
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

      {/* ── 화면 레이아웃 이름 지정 저장 모달 ── */}
      <Modal
        title="현재 화면 레이아웃 저장"
        open={isSaveModalOpen}
        onOk={handleSaveLayoutConfirm}
        onCancel={() => setIsSaveModalOpen(false)}
        okText="저장"
        cancelText="취소"
        destroyOnClose
      >
        <div style={{ marginBottom: 12, color: '#595959', fontSize: 13 }}>
          현재 분할된 화면과 열려 있는 탭들의 배치를 이름으로 저장합니다.
        </div>
        <Input
          placeholder="레이아웃 이름 (예: 기본 업무 3분할, 당직점검 배치)"
          value={newLayoutName}
          onChange={(e) => setNewLayoutName(e.target.value)}
          onPressEnter={handleSaveLayoutConfirm}
          autoFocus
        />
      </Modal>
    </>
  );
};
EOF
    cp "$TARGET_DIR/frontend/src/components/TopBar.tsx" "$TARGET_DIR/frontend/src/components/layout/TopBar.tsx" 2>/dev/null || true


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
          fontFamily: 'var(--app-font-family)',
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
import React, { useState, useEffect } from 'react';
import { Tag, Tooltip, Button } from 'antd';
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
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { MenuLevel_1, MenuLevel_3 } from '../../types';
import { menuLevel_1_List } from '../../mock/data';
import { useAppSetting } from '../../hooks/useAppSetting';

// ── 설계 문서(설계-layout.md)에 제시된 Lucide 규격 아이콘 컴포넌트 ──
const ChevronsDownIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="m7 6 5 5 5-5" />
    <path d="m7 13 5 5 5-5" />
  </svg>
);

const ChevronsUpIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="m17 11-5-5-5 5" />
    <path d="m17 18-5-5-5 5" />
  </svg>
);

const PinIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <line x1="12" y1="17" x2="12" y2="22" />
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
  </svg>
);

const PinOffIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 13, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M12 17v5" />
    <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" />
    <path d="m2 2 20 20" />
    <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" />
  </svg>
);

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
  const [fontSizeOffset, setFontSizeOffset] = useAppSetting('menu23_font_size', 0);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [isPanelHovered, setIsPanelHovered] = useState<boolean>(false);

  // 1차 메뉴 변경 시 서브 메뉴 그룹 접힘 상태 초기화 (모두 펼침)
  useEffect(() => {
    setCollapsedGroups(new Set());
  }, [activeMenuId]);

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
  // - 다른 1차 메뉴 아이콘이 클릭되면 무조건 해당 메뉴로 오픈
  const handleMenuLevel_1_Click = (menuId: string) => {
    if (activeMenuId === menuId) {
      onSelectMenuLevel_1(null);
    } else {
      onSelectMenuLevel_1(menuId);
    }
  };

  const activeMenuObj = menuLevel_1_List.find((m) => m.id === activeMenuId);

  // 3차 메뉴(MenuLevel_3) 항목 클릭 핸들러
  // - 선택된 메뉴 항목을 상위로 전달하여 탭 열기/활성화
  // - '고정(pinned)' 상태가 아니면 3차 메뉴 선택 시 메뉴23 패널을 자동으로 숨김 (설계-layout.md 규칙)
  const handleSelectMenuLevel_3_Item = (item: MenuLevel_3) => {
    if (activeMenuObj) {
      onSelectMenuLevel_3(item, activeMenuObj);
    }
    if (!pinned) {
      onSelectMenuLevel_1(null);
    }
  };

  // 개별 2차 메뉴 그룹 접기/펼치기 토글
  const handleToggleGroup = (groupCode: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupCode)) {
        next.delete(groupCode);
      } else {
        next.add(groupCode);
      }
      return next;
    });
  };

  // 모두 펼치기
  const handleExpandAll = () => {
    setCollapsedGroups(new Set());
  };

  // 모두 접기
  const handleCollapseAll = () => {
    if (activeMenuObj) {
      const allCodes = activeMenuObj.groups.map((g) => g.groupCode);
      setCollapsedGroups(new Set(allCodes));
    }
  };

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
          onMouseEnter={() => setIsPanelHovered(true)}
          onMouseLeave={() => setIsPanelHovered(false)}
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
              padding: '6px 0',
            }}
          >
            {activeMenuObj.groups.map((group, groupIndex) => {
              const isCollapsed = collapsedGroups.has(group.groupCode);
              const isFirstGroup = groupIndex === 0;

              return (
                <div key={group.groupCode} style={{ marginBottom: isCollapsed ? 4 : 8 }}>
                  {/* MenuLevel_2 헤더 */}
                  <div
                    onClick={() => handleToggleGroup(group.groupCode)}
                    style={{
                      backgroundColor: '#eef2f8',
                      color: '#2a3b5c',
                      fontWeight: 700,
                      fontSize: 12 + fontSizeOffset,
                      padding: '4px 8px 4px 10px',
                      borderTop: '1px solid #e1e7f0',
                      borderBottom: '1px solid #e1e7f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e4ecf7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#eef2f8';
                    }}
                  >
                    {/* 좌측: 펼침/접힘 화살표 및 그룹 제목 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        minWidth: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {isCollapsed ? (
                        <CaretRightOutlined style={{ fontSize: 10, color: '#627d98', flexShrink: 0 }} />
                      ) : (
                        <CaretDownOutlined style={{ fontSize: 10, color: '#627d98', flexShrink: 0 }} />
                      )}
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {group.groupTitle}
                      </span>
                    </div>

                    {/* 첫 번째 메뉴레벨2 우측: '모두펼치기', '모두접기', '고정' 3개 아이콘 */}
                    {isFirstGroup && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          flexShrink: 0,
                          marginLeft: 4,
                        }}
                      >
                        <Tooltip title="모두 펼치기" placement="top">
                          <Button
                            type="text"
                            size="small"
                            onClick={handleExpandAll}
                            style={{
                              width: 20,
                              height: 20,
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#627d98',
                            }}
                            icon={<ChevronsDownIcon size={13} />}
                          />
                        </Tooltip>

                        <Tooltip title="모두 접기" placement="top">
                          <Button
                            type="text"
                            size="small"
                            onClick={handleCollapseAll}
                            style={{
                              width: 20,
                              height: 20,
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#627d98',
                            }}
                            icon={<ChevronsUpIcon size={13} />}
                          />
                        </Tooltip>

                        <Tooltip
                          title={pinned ? '메뉴 고정 해제' : '메뉴 고정'}
                          placement="top"
                        >
                          <Button
                            type="text"
                            size="small"
                            onClick={() => onTogglePin(!pinned)}
                            style={{
                              width: 20,
                              height: 20,
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: pinned ? '#1677ff' : '#627d98',
                              backgroundColor: pinned ? '#e6f4ff' : 'transparent',
                              border: pinned ? '1px solid #91caff' : '1px solid transparent',
                              borderRadius: 3,
                            }}
                            icon={
                              pinned ? (
                                <PinIcon size={13} style={{ color: '#1677ff' }} />
                              ) : (
                                <PinOffIcon size={13} style={{ color: '#627d98' }} />
                              )
                            }
                          />
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  {/* MenuLevel_3 항목들 (펼쳐진 상태에서만 렌더링) */}
                  {!isCollapsed && (
                    <div style={{ padding: '2px 0' }}>
                      {group.items.map((item) => {
                        const isItemSelected = selectedMenuLevel_3_Code === item.code;
                        return (
                          <div
                            key={item.code}
                            onClick={() => handleSelectMenuLevel_3_Item(item)}
                            style={{
                              padding: '5px 12px 5px 18px',
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
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 컨트롤: 마우스 호버 시에만 나타나는 폰트 확대/축소 및 크기 초기화 */}
          <div
            style={{
              height: isPanelHovered ? 32 : 0,
              minHeight: isPanelHovered ? 32 : 0,
              opacity: isPanelHovered ? 1 : 0,
              overflow: 'hidden',
              borderTop: isPanelHovered ? '1px solid #e5e9f0' : '1px solid transparent',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isPanelHovered ? '0 10px' : '0 10px',
              fontSize: 11,
              color: '#6b7280',
              userSelect: 'none',
              flexShrink: 0,
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <span style={{ fontSize: 11 }}>글꼴 크기</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.min(prev + 1, 3))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4b5563',
                }}
                title="글꼴 확대"
              >
                <PlusOutlined style={{ fontSize: 9 }} />
              </button>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.max(prev - 1, -2))}
                style={{
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  borderRadius: 3,
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4b5563',
                }}
                title="글꼴 축소"
              >
                <MinusOutlined style={{ fontSize: 9 }} />
              </button>
              {fontSizeOffset !== 0 && (
                <button
                  onClick={() => setFontSizeOffset(0)}
                  style={{
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    borderRadius: 3,
                    padding: '0 4px',
                    height: 20,
                    cursor: 'pointer',
                    fontSize: 10,
                    color: '#6b7280',
                  }}
                  title="글꼴 기본 크기로 초기화"
                >
                  기본
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/EmployeePanel.tsx"
import React, { useState } from 'react';
import { Input, Avatar, Tooltip, Button } from 'antd';
import {
  UserOutlined,
  InfoCircleFilled,
  ReloadOutlined,
  RightOutlined,
  LeftOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { employeeList } from '../../mock/data';
import { useAppSetting } from '../../hooks/useAppSetting';

interface EmployeePanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const EmployeePanel: React.FC<EmployeePanelProps> = ({
  collapsed: propCollapsed,
  onToggleCollapse: propOnToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useAppSetting(
    'mypage_employee_collapsed',
    false
  );
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (propOnToggleCollapse) {
      propOnToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'busy'>('all');

  const onlineCount = employeeList.filter((e) => e.status === 'online').length;

  const filteredEmployees = employeeList.filter((emp) => {
    const matchesSearch =
      emp.name.includes(searchTerm) ||
      emp.position.includes(searchTerm) ||
      (emp.dept && emp.dept.includes(searchTerm));

    if (statusFilter === 'online') return matchesSearch && emp.status === 'online';
    if (statusFilter === 'busy') return matchesSearch && emp.status === 'busy';
    return matchesSearch;
  });

  // ── 접힘(Collapsed) 상태: 24px 슬림 바 ──
  if (isCollapsed) {
    return (
      <div
        onClick={toggleCollapse}
        title="임직원 접속 현황 펼치기"
        style={{
          width: 24,
          backgroundColor: '#f1f5f9',
          borderLeft: '1px solid #d9dfe8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          flexShrink: 0,
          cursor: 'pointer',
          padding: '8px 0',
          userSelect: 'none',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
      >
        <Tooltip title="임직원 패널 펼치기" placement="left">
          <Button
            type="text"
            size="small"
            icon={<LeftOutlined style={{ fontSize: 10, color: '#1677ff' }} />}
            style={{ width: 20, height: 20, padding: 0, marginBottom: 8 }}
          />
        </Tooltip>

        <TeamOutlined style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }} />

        {/* 온라인 인원 수 뱃지 */}
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 4px #22c55e',
            marginBottom: 8,
          }}
        />

        {/* 세로 쓰기 텍스트 */}
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            letterSpacing: 2,
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
          }}
        >
          임직원 ({onlineCount})
        </div>
      </div>
    );
  }

  // ── 펼침(Expanded) 상태: 190px 패널 ──
  return (
    <div
      style={{
        width: 190,
        backgroundColor: '#f8fafc',
        borderLeft: '1px solid #d9dfe8',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Panel Header with Collapse Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 8px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#fafbfc',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TeamOutlined style={{ color: '#1677ff', fontSize: 13 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
            임직원 현황
          </span>
          <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>
            ({onlineCount}명)
          </span>
        </div>

        <Tooltip title="임직원 패널 접기" placement="left">
          <Button
            type="text"
            size="small"
            icon={<RightOutlined style={{ fontSize: 10, color: '#64748b' }} />}
            onClick={toggleCollapse}
            style={{ width: 20, height: 20, padding: 0 }}
          />
        </Tooltip>
      </div>

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
                size={28}
                style={{ backgroundColor: '#94a3b8', color: '#fff' }}
                icon={<UserOutlined />}
              />
              <InfoCircleFilled
                style={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  fontSize: 10,
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

            {/* Status dot (Green = online, Red = busy/away) */}
            <div
              style={{
                width: 9,
                height: 9,
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
          <Tooltip title="온라인" placement="top">
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
          <Tooltip title="자리비움" placement="top">
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

        {/* Search input */}
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
import React, { useState, useEffect, useRef } from 'react';
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
  '2026-09-26': { holiday: '휴일(추석연휴)' },
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
  const calendarRef = useRef<HTMLDivElement>(null);

  // 이번 달(in-view) 날짜가 단 하루도 없는 다음 달 잉여 행(6번째 주 등) 자동 숨김
  useEffect(() => {
    const hideEmptyRows = () => {
      if (!calendarRef.current) return;
      const trList = calendarRef.current.querySelectorAll('.ant-picker-content tbody tr');
      trList.forEach((tr) => {
        const inViewCell = tr.querySelector('.ant-picker-cell-in-view');
        if (!inViewCell) {
          (tr as HTMLElement).style.display = 'none';
        } else {
          (tr as HTMLElement).style.display = '';
        }
      });
    };

    hideEmptyRows();
    const rafId = requestAnimationFrame(hideEmptyRows);
    return () => cancelAnimationFrame(rafId);
  }, [currentValue]);

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
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 2 }}>🔔</span> 일정표시
            </Button>
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 2 }}>⭐</span> 북마크
            </Button>
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#ef4444', marginRight: 2 }}>📅</span> 공모주
            </Button>
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#854d0e', marginRight: 2 }}>💼</span> 출퇴근(Beta)
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
    const isToday = date.isSame(dayjs('2026-09-16'), 'day');
    const dayOfWeek = date.day(); // 0 = Sun, 6 = Sat
    const dateKey = date.format('YYYY-MM-DD');
    const event = eventMap[dateKey];
    const isHoliday = Boolean(event?.holiday);

    // 공휴일 및 일요일: 빨간색, 토요일: 파란색, 평일: 진한 텍스트
    const dayColor = !isCurrentMonth
      ? '#cbd5e1'
      : isHoliday || dayOfWeek === 0
      ? '#dc2626'
      : dayOfWeek === 6
      ? '#2563eb'
      : '#1e293b';

    return (
      <div
        className={`mypage-calendar-day-cell ${isChosen ? 'is-chosen' : ''} ${isCurrentMonth ? 'is-current-month' : 'is-other-month'}`}
        style={{
          height: '100%',
          minHeight: 48,
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          padding: '4px 5px',
          boxSizing: 'border-box',
          // 선택된 셀은 짙은 빨간색 대신 눈이 편안한 소프트 블루 배경 + 2px 인셋 테두리 적용
          backgroundColor: isChosen
            ? '#eff6ff'
            : isToday
            ? '#f8fafc'
            : isCurrentMonth
            ? '#ffffff'
            : '#fafafa',
          boxShadow: isChosen ? 'inset 0 0 0 2px #1677ff' : 'none',
          color: '#334155',
          cursor: isCurrentMonth ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // 하단이 아닌 상단부터 차례대로 표시
          gap: 3,
          transition: 'background-color 0.12s, box-shadow 0.12s',
        }}
      >
        {/* 1. 셀 상단: 날짜 번호 + '오늘' 뱃지 + 건수 카운트 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', lineHeight: 1, marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                fontWeight: isChosen ? 800 : isHoliday || dayOfWeek === 0 ? 600 : 500,
                color: dayColor,
                fontSize: 12,
                lineHeight: '13px',
                display: 'inline-block',
              }}
            >
              {date.date()}
            </span>
            {isToday && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#1677ff',
                  backgroundColor: '#dbeafe',
                  padding: '1px 3px',
                  borderRadius: 2,
                  lineHeight: '11px',
                }}
              >
                오늘
              </span>
            )}
          </div>

          {event?.count && (
            <span
              style={{
                fontSize: 10,
                color: '#64748b',
                fontWeight: 500,
                lineHeight: '13px',
              }}
            >
              {event.count}
            </span>
          )}
        </div>

        {/* 2. 셀 상단 이어서 표시: 공휴일 배지 및 부서일정 항목들 */}
        {event?.holiday && (
          <div
            style={{
              backgroundColor: '#dc2626', // 공휴일 전용 빨간색 배경
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 4px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '13px',
            }}
          >
            {event.holiday}
          </div>
        )}

        {event?.badge && (
          <div
            style={{
              backgroundColor: '#1d63b8',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 500,
              padding: '2px 4px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '13px',
            }}
          >
            {event.badge}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={calendarRef}
      className="mypage-calendar-container"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        /* 캘린더 전체 및 내부 테이블 높이 가변 100% 확장 */
        .mypage-calendar-container .ant-picker-calendar {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
          min-height: 0 !important;
        }
        .mypage-calendar-container .ant-picker-panel {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
          min-height: 0 !important;
        }
        .mypage-calendar-container .ant-picker-date-panel {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
          min-height: 0 !important;
        }
        .mypage-calendar-container .ant-picker-body {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 0 !important;
          padding: 0 !important;
        }
        .mypage-calendar-container .ant-picker-content {
          height: 100% !important;
          width: 100% !important;
          border-collapse: collapse !important;
        }
        .mypage-calendar-container .ant-picker-content thead tr {
          border-bottom: 2px solid #cbd5e1 !important;
        }
        .mypage-calendar-container .ant-picker-content th {
          padding: 5px 0 !important;
          color: #334155 !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          background-color: #f8fafc !important;
          border-bottom: 1px solid #cbd5e1 !important;
        }
        .mypage-calendar-container .ant-picker-content th:first-child {
          color: #dc2626 !important;
        }
        .mypage-calendar-container .ant-picker-content th:last-child {
          color: #2563eb !important;
        }
        .mypage-calendar-container .ant-picker-content tbody {
          height: 100% !important;
        }
        .mypage-calendar-container .ant-picker-cell {
          padding: 0 !important;
          vertical-align: top !important;
          height: 1% !important; /* 남은 높이 균등 분할 */
        }
        .mypage-calendar-container .ant-picker-cell-inner {
          padding: 0 !important;
          border-radius: 0 !important;
          height: 100% !important;
          min-height: 48px !important;
          display: flex !important;
          flex-direction: column !important;
        }
        /* 이번 달 날짜가 단 하나도 없는 행(완전히 다음 달로만 채워진 6번째 주 등) 자동 숨김 */
        .mypage-calendar-container .ant-picker-content tbody tr:not(:has(.ant-picker-cell-in-view)) {
          display: none !important;
        }
      `}</style>
      <Calendar
        fullscreen={false}
        value={currentValue}
        onSelect={handleDateSelect}
        headerRender={renderHeader}
        fullCellRender={fullCellRender}
        style={{ height: '100%' }}
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
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/ScheduleGridBox.tsx"
import React, { useState } from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import { mockScheduleList } from '../../mock/data';
import { ScheduleItem } from '../../types';

interface ScheduleGridBoxProps {
  selectedDay: number;
}

export const ScheduleGridBox: React.FC<ScheduleGridBoxProps> = ({ selectedDay }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dept' | 'my' | 'away'>('all');

  const tabs = [
    { key: 'all', label: '전체', count: mockScheduleList.length },
    { key: 'dept', label: '부서일정', count: mockScheduleList.filter((i) => i.category === '부서일정').length },
    { key: 'my', label: '나의일정', count: mockScheduleList.filter((i) => i.category === '나의일정').length },
    { key: 'away', label: '자리비움', count: mockScheduleList.filter((i) => i.category === '자리비움').length },
    { key: 'work', label: '업무활동', count: 0 },
    { key: 'alert', label: '알림', count: 0 },
  ];

  const filteredData = mockScheduleList.filter((item) => {
    if (activeTab === 'dept') return item.category === '부서일정';
    if (activeTab === 'my') return item.category === '나의일정';
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
        <Tag
          color={val === '부서일정' ? 'blue' : val === '나의일정' ? 'cyan' : 'default'}
          style={{ margin: 0, fontSize: 11 }}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: '일정명',
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
      render: (val: string) => (
        <span
          style={{
            fontSize: 11,
            fontWeight: val === '완료' || val === '진행중' ? 600 : 400,
            color: val === '완료' ? '#22c55e' : val === '진행중' ? '#1677ff' : '#64748b',
          }}
        >
          {val || '-'}
        </span>
      ),
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
        height: '100%',
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
            ▶ 기준일 : 2026년 09월 {String(selectedDay).padStart(2, '0')}일 상세 일정
          </span>
          <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
            총 {filteredData.length}건
          </Tag>
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
          alignItems: 'center',
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

      <style>{`
        /* 테이블 row 높이 미세 축소: y축 패딩을 2px 줄여 컴팩트한 행 높이 제공 (기본 8px -> 6px) */
        .schedule-table .ant-table-thead > tr > th {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
        .schedule-table .ant-table-tbody > tr > td {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
        /* 행 마우스 호버 시 명확한 하이라이트 배경색 및 커서 제공 */
        .schedule-table .ant-table-tbody > tr:hover > td,
        .schedule-table .ant-table-tbody > tr.ant-table-row:hover > td {
          background-color: #e6f4ff !important;
          cursor: pointer;
        }
      `}</style>

      {/* Ant Design Table: 2개 Tr 높이(약 56px) 추가하여 약 8개 행 표시 (scroll y: 231px) */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Table<ScheduleItem>
          className="schedule-table"
          rowKey="id"
          dataSource={filteredData}
          columns={columns}
          size="small"
          pagination={false}
          scroll={{ y: 231 }} // 기존 약 6개 행에서 2개 Tr(약 56px) 확장하여 약 8개 행 스크롤 뷰
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/DayListBox.tsx"
import React, { useState } from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { mockDayList } from '../../mock/data';
import { DayListItem } from '../../types';

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
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/ApprovalGridBox.tsx"
import React, { useState } from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import { mockApprovalList } from '../../mock/data';
import { ApprovalItem } from '../../types';

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
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/ComplianceGridBox.tsx"
import React from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import { mockComplianceList } from '../../mock/data';
import { ComplianceItem } from '../../types';

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

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/MyPageGrids.tsx"
export { ScheduleGridBox } from './ScheduleGridBox';
export { DayListBox } from './DayListBox';
export { ApprovalGridBox } from './ApprovalGridBox';
export { ComplianceGridBox } from './ComplianceGridBox';
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/MyPageView.tsx"
import React, { useState } from 'react';
import { MyPageCalendar } from './MyPageCalendar';
import { ScheduleGridBox } from './ScheduleGridBox';
import { DayListBox } from './DayListBox';
import { ApprovalGridBox } from './ApprovalGridBox';
import { ComplianceGridBox } from './ComplianceGridBox';
import { EmployeePanel } from './EmployeePanel';

export const MyPageView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number>(16);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        padding: 6,
        gap: 6,
        backgroundColor: '#f0f2f5',
        boxSizing: 'border-box',
      }}
    >
      {/* ── 1. 좌측 컬럼 (48% 가용 너비): 캘린더 & 기준일 상세 일정 ── */}
      <div
        style={{
          flex: '0 0 48%',
          minWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* 상단: 월간 캘린더 (남은 높이를 유연하게 채우는 가변 셀 뷰 flex: 1) */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MyPageCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        {/* 하단: 기준일 상세 일정 그리드 (기존 280px + 2개 Tr 높이 56px = 336px 고정) */}
        <div style={{ height: 336, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ScheduleGridBox selectedDay={selectedDate} />
        </div>
      </div>

      {/* ── 2. 중앙 컬럼 (52% 가용 너비): Day List & 전자결재 & 법규공시 ── */}
      <div
        style={{
          flex: 1,
          minWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* 상단: Day List 박스 */}
        <div style={{ flex: 1.1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <DayListBox />
        </div>

        {/* 중단: 전자결재 박스 */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ApprovalGridBox />
        </div>

        {/* 하단: 법규보고공시 및 내규정보 박스 */}
        <div style={{ flex: 0.9, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ComplianceGridBox />
        </div>
      </div>

      {/* ── 3. 우측 컬럼 (190px 고정 / 접이식 토글 A안): 임직원 현황 ── */}
      <EmployeePanel />
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/components/mypage/index.ts"
export { MyPageView } from './MyPageView';
export { MyPageCalendar } from './MyPageCalendar';
export { ScheduleGridBox } from './ScheduleGridBox';
export { DayListBox } from './DayListBox';
export { ApprovalGridBox } from './ApprovalGridBox';
export { ComplianceGridBox } from './ComplianceGridBox';
export { EmployeePanel } from './EmployeePanel';
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
import { generateLargeAssetData } from '../mock/data';
import { LargeAssetItem } from '../types';

interface LargeDataViewProps {
  title?: string;
  menuCode?: string;
}

let cached10kStats: {
  total: number;
  totalPrice: string;
  normalCount: number;
  repairCount: number;
  discardCount: number;
} | null = null;

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
    if (total === 10000 && cached10kStats) {
      return cached10kStats;
    }
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

    const calculated = {
      total,
      totalPrice: (totalPrice / 100000000).toFixed(1), // 억원 단위
      normalCount,
      repairCount,
      discardCount,
    };
    if (total === 10000) {
      cached10kStats = calculated;
    }
    return calculated;
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
      },
      {
        field: 'name',
        headerName: '자산명 / 모델규격',
        width: 260,
        sortable: true,
      },
      {
        field: 'category',
        headerName: '자산분류',
        width: 140,
        sortable: true,
      },
      {
        field: 'dept',
        headerName: '관리부서',
        width: 120,
        sortable: true,
      },
      {
        field: 'manager',
        headerName: '담당자',
        width: 100,
        sortable: true,
      },
      {
        field: 'status',
        headerName: '상태',
        width: 110,
        sortable: true,
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
            filter: false,
            suppressHeaderMenuButton: true,
          }}
          pagination={false} // Virtual DOM scrolling for extreme performance!
        />
      </div>
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/doc/DocDraftManageView.tsx"
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, Button, Input, Select, Tag, Space, Modal, Form, message, Popconfirm, Badge } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SendOutlined,
  FileTextOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { mockDraftDocList } from '../../mock/data';
import { DraftDocItem } from '../../types';

export const DocDraftManageView: React.FC = () => {
  const gridRef = useRef<AgGridReact<DraftDocItem>>(null);
  const [rowData, setRowData] = useState<DraftDocItem[]>(() => [...mockDraftDocList]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalDoc, setDetailModalDoc] = useState<DraftDocItem | null>(null);
  const [form] = Form.useForm();

  // 통계 계산
  const stats = useMemo(() => {
    const total = rowData.length;
    const pending = rowData.filter((d) => d.status === '결재대기').length;
    const ongoing = rowData.filter((d) => d.status === '진행중').length;
    const approved = rowData.filter((d) => d.status === '승인완료').length;
    const rejected = rowData.filter((d) => d.status === '반려').length;
    const draft = rowData.filter((d) => d.status === '임시저장').length;
    return { total, pending, ongoing, approved, rejected, draft };
  }, [rowData]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return rowData.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [rowData, selectedCategory, selectedStatus]);

  // 새로고침 / 초기화
  const handleReload = () => {
    setRowData([...mockDraftDocList]);
    setQuickFilterText('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    message.success('기안서 목록이 새로고침되었습니다.');
  };

  // CSV 내보내기 (AgGrid Community 내장 기능)
  const handleExportCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `일반기안서목록_${new Date().toISOString().slice(0, 10)}.csv`,
      });
      message.info('CSV 내보내기가 완료되었습니다.');
    }
  }, []);

  // 선택 행 일괄 삭제
  const handleDeleteSelected = () => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('삭제할 문서를 선택해 주세요.');
      return;
    }
    const selectedIds = new Set(selectedNodes.map((n) => n.data?.id));
    setRowData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    message.success(`${selectedNodes.length}건의 기안서가 삭제되었습니다.`);
  };

  // 선택 행 일괄 결재상신 (임시저장 건 대상)
  const handleSubmitSelected = () => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('상신할 문서를 선택해 주세요.');
      return;
    }
    const draftNodes = selectedNodes.filter((n) => n.data?.status === '임시저장');
    if (draftNodes.length === 0) {
      message.warning('선택한 문서 중 [임시저장] 상태인 문서가 없습니다.');
      return;
    }
    const draftIds = new Set(draftNodes.map((n) => n.data?.id));
    setRowData((prev) =>
      prev.map((item) =>
        draftIds.has(item.id)
          ? { ...item, status: '결재대기' as const, draftDate: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
    message.success(`${draftNodes.length}건의 문서가 [결재대기] 상태로 일괄 상신되었습니다.`);
  };

  // 행 더블클릭 시 상세 모달 열기
  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<DraftDocItem>) => {
    if (event.data) {
      setDetailModalDoc(event.data);
    }
  };

  // 신규 기안서 작성 제출
  const handleCreateDraft = (isDirectSubmit: boolean) => {
    form.validateFields().then((values) => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const newDoc: DraftDocItem = {
        id: `dft-${Date.now()}`,
        docNo: `DFT-2026-${String(rowData.length + 1).padStart(4, '0')}`,
        draftDate: dateStr,
        category: values.category,
        title: values.title,
        dept: values.dept || 'IT개발실',
        drafter: values.drafter || '김도영',
        status: isDirectSubmit ? '결재대기' : '임시저장',
        approvalDate: '-',
        isUrgent: values.isUrgent || false,
        retentionPeriod: values.retentionPeriod || '3년',
        content: values.content,
      };

      setRowData((prev) => [newDoc, ...prev]);
      setIsModalOpen(false);
      form.resetFields();
      message.success(
        isDirectSubmit ? '기안서가 [결재대기] 상태로 상신되었습니다.' : '기안서가 [임시저장]되었습니다.'
      );
    });
  };

  // AG Grid 컬럼 정의
  const columnDefs: ColDef<DraftDocItem>[] = useMemo(
    () => [
      {
        field: 'docNo',
        headerName: '문서번호',
        width: 150,
        pinned: 'left',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        cellRenderer: (params: any) => (
          <span style={{ fontWeight: 600, color: '#1677ff', cursor: 'pointer' }}>
            {params.value}
          </span>
        ),
      },
      {
        field: 'draftDate',
        headerName: '기안일자',
        width: 110,
        sortable: true,
      },
      {
        field: 'category',
        headerName: '문서분류',
        width: 100,
        sortable: true,
        cellRenderer: (params: any) => {
          const cat = params.value;
          const color =
            cat === '일반기안'
              ? 'blue'
              : cat === '업무협조'
              ? 'cyan'
              : cat === '규정개정'
              ? 'purple'
              : cat === '인사총무'
              ? 'geekblue'
              : 'default';
          return <Tag color={color} style={{ margin: 0, fontSize: 11 }}>{cat}</Tag>;
        },
      },
      {
        field: 'title',
        headerName: '기안제목 (더블클릭 시 상세조회)',
        flex: 1,
        minWidth: 260,
        sortable: true,
        tooltipField: 'title',
        cellRenderer: (params: any) => {
          const isUrgent = params.data?.isUrgent;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
              {isUrgent && (
                <Tag color="error" style={{ margin: 0, fontSize: 10, padding: '0 3px', lineHeight: '16px' }}>
                  긴급
                </Tag>
              )}
              <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {params.value}
              </span>
            </div>
          );
        },
      },
      {
        field: 'dept',
        headerName: '기안부서',
        width: 120,
        sortable: true,
      },
      {
        field: 'drafter',
        headerName: '기안자',
        width: 90,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'status',
        headerName: '결재상태',
        width: 100,
        sortable: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          if (status === '승인완료') {
            return <Badge status="success" text={<span style={{ color: '#15803d', fontWeight: 600 }}>승인완료</span>} />;
          }
          if (status === '진행중') {
            return <Badge status="processing" text={<span style={{ color: '#1677ff', fontWeight: 600 }}>진행중</span>} />;
          }
          if (status === '결재대기') {
            return <Badge status="warning" text={<span style={{ color: '#d97706', fontWeight: 600 }}>결재대기</span>} />;
          }
          if (status === '반려') {
            return <Badge status="error" text={<span style={{ color: '#dc2626', fontWeight: 600 }}>반려</span>} />;
          }
          return <Badge status="default" text={<span style={{ color: '#64748b' }}>임시저장</span>} />;
        },
      },
      {
        field: 'retentionPeriod',
        headerName: '보존연한',
        width: 90,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'approvalDate',
        headerName: '최종결재일시',
        width: 140,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center', color: '#64748b' }),
      },
      {
        headerName: '상세보기',
        width: 85,
        pinned: 'right',
        cellRenderer: (params: any) => (
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            style={{ padding: 0, fontSize: 11 }}
            onClick={() => setDetailModalDoc(params.data)}
          >
            보기
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: '#f0f2f5',
        padding: 6,
        gap: 6,
      }}
    >
      {/* ── 1. Header Toolbar (사용법 2: 검색조건 + 팝업 등록형) ── */}
      <Card
        size="small"
        bodyStyle={{ padding: '8px 12px' }}
        style={{
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderRadius: 4,
          border: '1px solid #d9dfe8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          {/* 타이틀 및 상태 배지 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileTextOutlined style={{ color: '#1677ff', fontSize: 16 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>
                [1101] 일반 기안서 작성
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>전체 {stats.total}건</Tag>
              <Tag color="warning" style={{ margin: 0, fontSize: 11 }}>대기 {stats.pending}</Tag>
              <Tag color="processing" style={{ margin: 0, fontSize: 11 }}>진행 {stats.ongoing}</Tag>
              <Tag color="success" style={{ margin: 0, fontSize: 11 }}>승인 {stats.approved}</Tag>
              {stats.rejected > 0 && <Tag color="error" style={{ margin: 0, fontSize: 11 }}>반려 {stats.rejected}</Tag>}
            </div>
          </div>

          {/* 우측 검색 조건 및 4개 핵심 액션 버튼 */}
          <Space size={6} wrap>
            <Input
              placeholder="통합 검색 (문서번호, 제목, 기안자...)"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ width: 220, fontSize: 12 }}
              size="small"
              allowClear
            />

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 110 }}
              size="small"
              options={[
                { value: 'all', label: '전체 분류' },
                { value: '일반기안', label: '일반기안' },
                { value: '업무협조', label: '업무협조' },
                { value: '인사총무', label: '인사총무' },
                { value: '규정개정', label: '규정개정' },
                { value: '제휴제안', label: '제휴제안' },
              ]}
            />

            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 105 }}
              size="small"
              options={[
                { value: 'all', label: '전체 상태' },
                { value: '결재대기', label: '결재대기' },
                { value: '진행중', label: '진행중' },
                { value: '승인완료', label: '승인완료' },
                { value: '반려', label: '반려' },
                { value: '임시저장', label: '임시저장' },
              ]}
            />

            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReload}
              title="데이터 새로고침"
            >
              조회
            </Button>

            {/* 신규 등록 모달 열기 버튼 (사용법 2) */}
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              style={{ backgroundColor: '#1e3a5f' }}
            >
              신규 기안 등록
            </Button>

            {/* 선택 상신 */}
            <Button
              size="small"
              icon={<SendOutlined />}
              onClick={handleSubmitSelected}
            >
              결재 상신
            </Button>

            {/* 선택 삭제 (사용법 2) */}
            <Popconfirm
              title="선택한 기안서를 삭제하시겠습니까?"
              okText="삭제"
              cancelText="취소"
              onConfirm={handleDeleteSelected}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                삭제
              </Button>
            </Popconfirm>

            {/* CSV 내보내기 */}
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleExportCsv}
            >
              CSV
            </Button>
          </Space>
        </div>
      </Card>

      {/* ── 2. AG Grid Viewport-Fitted Container (Virtual Scrolling) ── */}
      <div
        className="ag-theme-alpine"
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #d9dfe8',
        }}
      >
        <AgGridReact<DraftDocItem>
          ref={gridRef}
          rowData={filteredData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          rowSelection="multiple"
          headerHeight={34}
          rowHeight={33}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: false,
            suppressHeaderMenuButton: true,
          }}
          pagination={false}
          onRowDoubleClicked={handleRowDoubleClicked}
        />
      </div>

      {/* ── 3. 신규 기안서 작성 팝업 모달 (사용법 2: 모달 팝업 등록형) ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e3a5f' }}>
            <FileTextOutlined />
            <span>신규 일반기안서 작성 및 상신</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={680}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>,
          <Button key="draft" onClick={() => handleCreateDraft(false)}>
            임시저장
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SendOutlined />}
            style={{ backgroundColor: '#1e3a5f' }}
            onClick={() => handleCreateDraft(true)}
          >
            결재 상신
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            category: '일반기안',
            dept: 'IT개발실',
            drafter: '김도영',
            retentionPeriod: '3년',
            isUrgent: false,
          }}
          style={{ marginTop: 12 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="category" label="문서분류" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: '일반기안', label: '일반기안' },
                  { value: '업무협조', label: '업무협조' },
                  { value: '인사총무', label: '인사총무' },
                  { value: '규정개정', label: '규정개정' },
                  { value: '제휴제안', label: '제휴제안' },
                ]}
              />
            </Form.Item>

            <Form.Item name="retentionPeriod" label="보존연한" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: '1년', label: '1년' },
                  { value: '3년', label: '3년' },
                  { value: '5년', label: '5년' },
                  { value: '영구', label: '영구' },
                ]}
              />
            </Form.Item>

            <Form.Item name="isUrgent" label="긴급 결재" valuePropName="checked">
              <Select
                options={[
                  { value: false, label: '일반' },
                  { value: true, label: '긴급 결재 요망' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="dept" label="기안부서" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="drafter" label="기안자" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </div>

          <Form.Item
            name="title"
            label="기안 제목"
            rules={[{ required: true, message: '기안서 제목을 입력해 주세요.' }]}
          >
            <Input placeholder="예: [IT인프라] 2026년 하반기 클라우드 전환 전산장비 확충의 건" />
          </Form.Item>

          <Form.Item
            name="content"
            label="기안 내용 / 사유"
            rules={[{ required: true, message: '상세 기안 내용을 입력해 주세요.' }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="1. 추진 배경 및 목적&#10;2. 주요 세부 실행 계획&#10;3. 기대 효과 및 소요 예산 등을 상세히 기술하십시오."
            />
          </Form.Item>

          {/* 결재선 프리뷰 박스 */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 600, color: '#334155' }}>지정 결재선:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
              <span>[기안] 김도영 이사</span>
              <span>➔</span>
              <span>[1차 검토] 김승주 차장</span>
              <span>➔</span>
              <span>[최종 승인] 나필순 상무</span>
            </div>
          </div>
        </Form>
      </Modal>

      {/* ── 4. 기안서 상세 모달 ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileTextOutlined style={{ color: '#1677ff' }} />
            <span>기안서 상세 조회 - {detailModalDoc?.docNo}</span>
          </div>
        }
        open={Boolean(detailModalDoc)}
        onCancel={() => setDetailModalDoc(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalDoc(null)}>
            확인
          </Button>,
        ]}
        width={650}
      >
        {detailModalDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, backgroundColor: '#f8fafc', padding: 10, borderRadius: 4, fontSize: 12 }}>
              <div><strong>문서분류:</strong> {detailModalDoc.category}</div>
              <div><strong>기안일자:</strong> {detailModalDoc.draftDate}</div>
              <div><strong>보존연한:</strong> {detailModalDoc.retentionPeriod}</div>
              <div><strong>기안자:</strong> {detailModalDoc.drafter} ({detailModalDoc.dept})</div>
              <div><strong>결재상태:</strong> <Tag color="blue">{detailModalDoc.status}</Tag></div>
              <div><strong>최종결재:</strong> {detailModalDoc.approvalDate}</div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>기안 제목</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', padding: '6px 8px', backgroundColor: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                {detailModalDoc.title}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>기안 본문 내용</div>
              <div style={{ minHeight: 120, padding: 12, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {detailModalDoc.content || '등록된 상세 본문 내용이 없습니다.'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/doc/DocExpenseManageView.tsx"
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, Button, Input, Tag, Space, message, Popconfirm, Statistic, Row, Col, Badge } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DollarCircleOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, CellValueChangedEvent } from 'ag-grid-community';
import { mockExpenseDocList } from '../../mock/data';
import { ExpenseDocItem } from '../../types';

export const DocExpenseManageView: React.FC = () => {
  const gridRef = useRef<AgGridReact<ExpenseDocItem>>(null);
  const [rowData, setRowData] = useState<ExpenseDocItem[]>(() => [...mockExpenseDocList]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [hasDirtyRows, setHasDirtyRows] = useState(false);

  // 상단 집계 통계
  const stats = useMemo(() => {
    let totalSupply = 0;
    let totalTax = 0;
    let totalSum = 0;
    for (const item of rowData) {
      totalSupply += Number(item.supplyAmount || 0);
      totalTax += Number(item.taxAmount || 0);
      totalSum += Number(item.totalAmount || 0);
    }
    return {
      count: rowData.length,
      totalSupply,
      totalTax,
      totalSum,
    };
  }, [rowData]);

  // AgGrid 하단 고정 집계 행 (Pinned Bottom Row Data: 실시간 합계 자동 계산)
  const pinnedBottomRowData = useMemo(() => {
    return [
      {
        id: 'pinned-summary',
        expenseDate: '',
        accountName: '【 총 합계 】',
        description: `총 ${stats.count}건 비용 집행`,
        merchant: '',
        supplyAmount: stats.totalSupply,
        taxAmount: stats.totalTax,
        totalAmount: stats.totalSum,
        paymentMethod: '' as any,
        evidenceStatus: '' as any,
        dept: '',
      },
    ];
  }, [stats]);

  // 1. [조회] 핸들러 (사용법 1)
  const handleReload = () => {
    setRowData([...mockExpenseDocList]);
    setHasDirtyRows(false);
    setQuickFilterText('');
    message.success('비용 품의서 데이터가 초기화 및 재조회되었습니다.');
  };

  // 2. [등록 / 행 추가] 핸들러 (사용법 1: 인라인 빈 행 생성 및 셀 편집 시작)
  const handleAddRow = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newId = `exp-new-${Date.now()}`;
    const newRow: ExpenseDocItem = {
      id: newId,
      expenseDate: today,
      accountName: '지급수수료',
      description: '신규 비용 지출 내역을 입력하세요',
      merchant: '신규 거래처',
      supplyAmount: 100000,
      taxAmount: 10000,
      totalAmount: 110000,
      paymentMethod: '법인카드',
      evidenceStatus: '미첨부',
      dept: 'IT개발실',
      isDirty: true,
    };

    setRowData((prev) => [newRow, ...prev]);
    setHasDirtyRows(true);
    message.info('신규 비용 행이 최상단에 추가되었습니다. 각 셀을 더블클릭하여 바로 수정하십시오.');
  };

  // 3. [저장] 핸들러 (사용법 1: 인라인 변경사항 일괄 저장)
  const handleSave = () => {
    setRowData((prev) => prev.map((r) => ({ ...r, isDirty: false })));
    setHasDirtyRows(false);
    message.success(`총 ${rowData.length}건의 비용 품의 내역이 데이터베이스에 성공적으로 저장되었습니다.`);
  };

  // 4. [삭제] 핸들러 (사용법 1: 선택 행 삭제)
  const handleDeleteSelected = () => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('삭제할 비용 항목을 선택해 주세요.');
      return;
    }
    const selectedIds = new Set(selectedNodes.map((n) => n.data?.id));
    setRowData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setHasDirtyRows(true);
    message.success(`${selectedNodes.length}건의 항목이 삭제되었습니다. [저장]을 눌러 반영하십시오.`);
  };

  // 5. [CSV 내보내기]
  const handleExportCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `비용품의서내역_${new Date().toISOString().slice(0, 10)}.csv`,
        exportedRows: 'all',
      });
      message.info('CSV 내보내기가 완료되었습니다.');
    }
  }, []);

  // 셀 값 변경 시 자동 계산 (공급가액 변경 시 부가세 10% 및 합계 실시간 반영)
  const handleCellValueChanged = (event: CellValueChangedEvent<ExpenseDocItem>) => {
    const field = event.colDef.field;
    const row = event.data;
    if (!row) return;

    if (field === 'supplyAmount') {
      const supply = Math.max(0, Number(row.supplyAmount) || 0);
      const tax = Math.round(supply * 0.1);
      const total = supply + tax;

      row.supplyAmount = supply;
      row.taxAmount = tax;
      row.totalAmount = total;
    }
    row.isDirty = true;
    setHasDirtyRows(true);

    // 그리드 갱신
    setRowData((prev) => [...prev]);
  };

  // 컬럼 정의
  const columnDefs: ColDef<ExpenseDocItem>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'No',
        width: 60,
        pinned: 'left',
        checkboxSelection: (params: any) => !params.node.rowPinned,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        valueGetter: (params: any) => {
          if (params.node.rowPinned) return '∑';
          return (params.node.rowIndex ?? 0) + 1;
        },
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'expenseDate',
        headerName: '집행일자',
        width: 120,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellClass: 'editable-cell',
      },
      {
        field: 'accountName',
        headerName: '계정과목 (선택)',
        width: 130,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['지급수수료', '회의비', '도서인쇄비', '소모품비', '여비교통비', '교육훈련비', '복리후생비'],
        },
        cellClass: 'editable-cell',
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return <strong>{params.value}</strong>;
          return <span style={{ fontWeight: 600, color: '#1e3a5f' }}>{params.value}</span>;
        },
      },
      {
        field: 'description',
        headerName: '적요 / 상세 사용 내역 (인라인 입력)',
        flex: 1,
        minWidth: 240,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellClass: 'editable-cell',
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return <strong>{params.value}</strong>;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {params.data?.isDirty && (
                <Badge status="processing" title="수정됨 (미저장)" />
              )}
              <span>{params.value}</span>
            </div>
          );
        },
      },
      {
        field: 'merchant',
        headerName: '가맹점 / 거래처',
        width: 160,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellClass: 'editable-cell',
      },
      {
        field: 'supplyAmount',
        headerName: '공급가액 (원)',
        width: 130,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        type: 'numericColumn',
        cellClass: 'editable-cell',
        valueFormatter: (params: any) => {
          const val = params.value;
          return val != null ? `${Number(val).toLocaleString()}원` : '0원';
        },
        cellStyle: () => ({ textAlign: 'right' }),
      },
      {
        field: 'taxAmount',
        headerName: '부가세 (10%)',
        width: 110,
        editable: false,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => {
          const val = params.value;
          return val != null ? `${Number(val).toLocaleString()}원` : '0원';
        },
        cellStyle: () => ({ textAlign: 'right', color: '#64748b' }),
      },
      {
        field: 'totalAmount',
        headerName: '합계금액 (원)',
        width: 140,
        editable: false,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => {
          const val = params.value;
          return val != null ? `${Number(val).toLocaleString()}원` : '0원';
        },
        cellStyle: (params: any): Record<string, string | number> => {
          if (params.node.rowPinned) {
            return { textAlign: 'right', fontWeight: 800, color: '#dc2626', fontSize: 13 };
          }
          return { textAlign: 'right', fontWeight: 700, color: '#1677ff' };
        },
      },
      {
        field: 'paymentMethod',
        headerName: '결제수단',
        width: 110,
        editable: (params: any) => !params.node.rowPinned,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['법인카드', '세금계산서', '개인카드', '현금영수증'],
        },
        cellClass: 'editable-cell',
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'evidenceStatus',
        headerName: '증빙상태',
        width: 100,
        editable: (params: any) => !params.node.rowPinned,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['첨부완료', '미첨부'],
        },
        cellClass: 'editable-cell',
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return null;
          const val = params.value;
          return (
            <Tag color={val === '첨부완료' ? 'success' : 'warning'} style={{ margin: 0, fontSize: 11 }}>
              {val}
            </Tag>
          );
        },
      },
      {
        field: 'dept',
        headerName: '귀속부서',
        width: 110,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
      },
    ],
    []
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: '#f0f2f5',
        padding: 6,
        gap: 6,
      }}
    >
      {/* ── 1. Header Toolbar (사용법 1: 조회 / 저장 / 등록 / 삭제 4대 버튼) ── */}
      <Card
        size="small"
        bodyStyle={{ padding: '8px 12px' }}
        style={{
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderRadius: 4,
          border: '1px solid #d9dfe8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          {/* 좌측 타이틀 및 저장 상태 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarCircleOutlined style={{ color: '#059669', fontSize: 16 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>
                [1102] 비용 품의서 작성 (인라인 편집 그리드)
              </span>
            </div>

            {hasDirtyRows ? (
              <Tag color="error" icon={<EditOutlined />} style={{ margin: 0, fontSize: 11 }}>
                수정된 내역 있음 (저장 필요)
              </Tag>
            ) : (
              <Tag color="success" icon={<CheckOutlined />} style={{ margin: 0, fontSize: 11 }}>
                모든 변경사항 저장됨
              </Tag>
            )}
          </div>

          {/* 우측 4대 핵심 버튼: 조회, 저장, 등록(행추가), 삭제 (사용법 1) */}
          <Space size={6} wrap>
            <Input
              placeholder="적요 / 계정과목 빠른 검색"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ width: 180, fontSize: 12 }}
              size="small"
              allowClear
            />

            {/* 1. 조회 버튼 */}
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReload}
              title="데이터 새로고침"
            >
              조회
            </Button>

            {/* 2. 저장 버튼 (사용법 1) */}
            <Button
              size="small"
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ backgroundColor: hasDirtyRows ? '#16a34a' : '#1e3a5f' }}
            >
              저장
            </Button>

            {/* 3. 등록(행추가) 버튼 (사용법 1) */}
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
              style={{ backgroundColor: '#2563eb' }}
            >
              등록 (행추가)
            </Button>

            {/* 4. 삭제 버튼 (사용법 1) */}
            <Popconfirm
              title="선택한 비용 항목을 삭제하시겠습니까?"
              okText="삭제"
              cancelText="취소"
              onConfirm={handleDeleteSelected}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                삭제
              </Button>
            </Popconfirm>

            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleExportCsv}
            >
              CSV
            </Button>
          </Space>
        </div>
      </Card>

      {/* ── 2. 비용 집계 통계 대시보드 바 ── */}
      <Row gutter={6} style={{ flexShrink: 0 }}>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#ffffff', borderColor: '#d9dfe8' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#64748b' }}>비용 품의 총 건수</span>}
              value={stats.count}
              suffix="건"
              valueStyle={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#ffffff', borderColor: '#d9dfe8' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#64748b' }}>공급가액 소계</span>}
              value={stats.totalSupply}
              suffix="원"
              valueStyle={{ fontSize: 16, fontWeight: 700, color: '#334155' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#ffffff', borderColor: '#d9dfe8' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#64748b' }}>부가세 세액 합계</span>}
              value={stats.totalTax}
              suffix="원"
              valueStyle={{ fontSize: 16, fontWeight: 700, color: '#64748b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>총 품의 집행금액 (합계)</span>}
              value={stats.totalSum}
              suffix="원"
              valueStyle={{ fontSize: 17, fontWeight: 800, color: '#16a34a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── 3. AG Grid Editable Table (Pinned Summary Row at Bottom) ── */}
      <div
        className="ag-theme-alpine"
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #d9dfe8',
        }}
      >
        <style>{`
          /* 인라인 편집 가능한 셀에 마우스 오버 시 연한 하이라이트 */
          .ag-theme-alpine .editable-cell:hover {
            background-color: #f8fafc !important;
            cursor: cell;
          }
          .ag-theme-alpine .ag-row-pinned {
            background-color: #f1f5f9 !important;
            font-weight: 700 !important;
            border-top: 2px solid #94a3b8 !important;
          }
        `}</style>
        <AgGridReact<ExpenseDocItem>
          ref={gridRef}
          rowData={rowData}
          pinnedBottomRowData={pinnedBottomRowData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          rowSelection="multiple"
          headerHeight={34}
          rowHeight={32}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: false,
            suppressHeaderMenuButton: true,
          }}
          pagination={false}
          singleClickEdit={false}
          stopEditingWhenCellsLoseFocus={true}
          onCellValueChanged={handleCellValueChanged}
        />
      </div>
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/doc/DocAssetAcquisitionView.tsx"
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, Button, Input, Tag, Space, message, Popconfirm, Badge, Modal, Form } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  LaptopOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, RowSelectedEvent, CellValueChangedEvent } from 'ag-grid-community';
import { mockAssetAcqMasterList, mockAssetAcqDetailList } from '../../mock/data';
import { AssetAcqMasterItem, AssetAcqDetailItem } from '../../types';

export const DocAssetAcquisitionView: React.FC = () => {
  // 마스터 상태
  const masterGridRef = useRef<AgGridReact<AssetAcqMasterItem>>(null);
  const [masterData, setMasterData] = useState<AssetAcqMasterItem[]>(() => [...mockAssetAcqMasterList]);
  const [selectedMasterId, setSelectedMasterId] = useState<string>('acq-m1');
  const [masterQuickFilter, setMasterQuickFilter] = useState('');
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [masterForm] = Form.useForm();

  // 디테일 상태
  const detailGridRef = useRef<AgGridReact<AssetAcqDetailItem>>(null);
  const [detailData, setDetailData] = useState<AssetAcqDetailItem[]>(() => [...mockAssetAcqDetailList]);
  const [detailQuickFilter, setDetailQuickFilter] = useState('');

  // 현재 선택된 마스터 품의 정보
  const selectedMaster = useMemo(() => {
    return masterData.find((m) => m.id === selectedMasterId) || masterData[0];
  }, [masterData, selectedMasterId]);

  // 현재 선택된 마스터에 종속된 디테일 자산 목록 (Master-Detail 연동)
  const currentDetailList = useMemo(() => {
    return detailData.filter((d) => d.masterId === selectedMaster?.id);
  }, [detailData, selectedMaster]);

  // 디테일 하단 실시간 Pinned Summary 행 (수량 합계 & 취득금액 합계)
  const detailPinnedBottomRowData = useMemo(() => {
    let totalQty = 0;
    let totalPriceSum = 0;
    for (const item of currentDetailList) {
      totalQty += Number(item.quantity || 0);
      totalPriceSum += Number(item.totalPrice || 0);
    }
    return [
      {
        id: 'detail-pinned-summary',
        masterId: '',
        assetCode: '∑ 합계',
        category: '',
        name: `${currentDetailList.length}개 품목`,
        spec: '',
        quantity: totalQty,
        unitPrice: 0,
        totalPrice: totalPriceSum,
        location: '',
        targetUser: '',
        note: '',
      },
    ];
  }, [currentDetailList]);

  // ── [마스터 그리드 핸들러] ──
  // 1. 마스터 새로고침
  const handleMasterReload = () => {
    setMasterData([...mockAssetAcqMasterList]);
    setDetailData([...mockAssetAcqDetailList]);
    message.success('자산취득 품의 목록 및 상세 내역이 재조회되었습니다.');
  };

  // 2. 마스터 저장
  const handleMasterSave = () => {
    message.success('자산취득 품의 마스터 및 상세 자산 정보가 모두 저장되었습니다.');
  };

  // 3. 마스터 신규 등록 모달 열기
  const handleOpenMasterModal = () => {
    setIsMasterModalOpen(true);
  };

  // 4. 마스터 신규 등록 완료
  const handleCreateMaster = () => {
    masterForm.validateFields().then((values) => {
      const today = new Date().toISOString().slice(0, 10);
      const newId = `acq-m-${Date.now()}`;
      const newMaster: AssetAcqMasterItem = {
        id: newId,
        docNo: `ACQ-2026-${String(masterData.length + 1).padStart(4, '0')}`,
        reqDate: today,
        title: values.title,
        dept: values.dept || 'IT개발실',
        requester: values.requester || '김도영',
        totalBudget: 0,
        itemCount: 0,
        status: '작성중',
      };
      setMasterData((prev) => [newMaster, ...prev]);
      setSelectedMasterId(newId);
      setIsMasterModalOpen(false);
      masterForm.resetFields();
      message.success('신규 품의가 생성되었습니다. 우측에서 취득 대상 자산들을 등록하십시오.');
    });
  };

  // 5. 마스터 삭제
  const handleMasterDelete = () => {
    if (!selectedMaster) return;
    setMasterData((prev) => prev.filter((m) => m.id !== selectedMaster.id));
    setDetailData((prev) => prev.filter((d) => d.masterId !== selectedMaster.id));
    const nextMaster = masterData.find((m) => m.id !== selectedMaster.id);
    if (nextMaster) {
      setSelectedMasterId(nextMaster.id);
    }
    message.success(`[${selectedMaster.docNo}] 품의 및 관련 자산 목록이 삭제되었습니다.`);
  };

  // 마스터 행 선택 이벤트
  const handleMasterRowSelected = (event: RowSelectedEvent<AssetAcqMasterItem>) => {
    if (event.node.isSelected() && event.data) {
      setSelectedMasterId(event.data.id);
    }
  };

  // ── [디테일 그리드 핸들러] ──
  // 1. 디테일 신규 자산 행추가 (인라인 등록)
  const handleAddDetailRow = () => {
    if (!selectedMaster) {
      message.warning('먼저 좌측에서 품의서를 선택해 주세요.');
      return;
    }
    const newDetailId = `acq-d-${Date.now()}`;
    const newDetail: AssetAcqDetailItem = {
      id: newDetailId,
      masterId: selectedMaster.id,
      assetCode: `AST-${String(currentDetailList.length + 1).padStart(3, '0')}`,
      category: 'PC/노트북',
      name: '신규 취득 자산명 입력',
      spec: '상세 사양 입력',
      quantity: 1,
      unitPrice: 1500000,
      totalPrice: 1500000,
      location: '본사 8F',
      targetUser: '지정 담당자',
    };

    const nextDetailList = [newDetail, ...detailData];
    setDetailData(nextDetailList);

    // 마스터의 총예산 및 품목 수 실시간 동기화 업데이트!
    syncMasterWithDetails(selectedMaster.id, nextDetailList);
    message.info('취득 대상 자산 항목이 추가되었습니다. 인라인으로 바로 수정하세요.');
  };

  // 2. 디테일 선택 항목 삭제
  const handleDeleteSelectedDetails = () => {
    const selectedNodes = detailGridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('삭제할 자산 항목을 선택해 주세요.');
      return;
    }
    const delIds = new Set(selectedNodes.map((n) => n.data?.id));
    const nextDetailList = detailData.filter((d) => !delIds.has(d.id));
    setDetailData(nextDetailList);

    // 마스터 재계산 동기화
    if (selectedMaster) {
      syncMasterWithDetails(selectedMaster.id, nextDetailList);
    }
    message.success(`${selectedNodes.length}건의 자산 항목이 삭제되었습니다.`);
  };

  // 디테일 셀 인라인 편집 시 자동 금액 계산 (수량 * 단가) 및 마스터 자동 동기화
  const handleDetailCellValueChanged = (event: CellValueChangedEvent<AssetAcqDetailItem>) => {
    const field = event.colDef.field;
    const row = event.data;
    if (!row) return;

    if (field === 'quantity' || field === 'unitPrice') {
      const qty = Math.max(1, Number(row.quantity) || 1);
      const unit = Math.max(0, Number(row.unitPrice) || 0);
      row.quantity = qty;
      row.unitPrice = unit;
      row.totalPrice = qty * unit;
    }

    const nextDetailList = [...detailData];
    setDetailData(nextDetailList);
    if (selectedMaster) {
      syncMasterWithDetails(selectedMaster.id, nextDetailList);
    }
  };

  // 마스터 총예산 및 자산품목수 실시간 동기화 함수
  const syncMasterWithDetails = (mId: string, allDetails: AssetAcqDetailItem[]) => {
    const items = allDetails.filter((d) => d.masterId === mId);
    const sum = items.reduce((acc, cur) => acc + Number(cur.totalPrice || 0), 0);
    setMasterData((prev) =>
      prev.map((m) =>
        m.id === mId ? { ...m, totalBudget: sum, itemCount: items.length } : m
      )
    );
  };

  // 디테일 CSV 내보내기
  const handleExportDetailCsv = useCallback(() => {
    if (detailGridRef.current?.api) {
      detailGridRef.current.api.exportDataAsCsv({
        fileName: `자산취득상세내역_${selectedMaster?.docNo || 'EXPORT'}.csv`,
        exportedRows: 'all',
      });
      message.info('상세 자산 목록 CSV 내보내기가 완료되었습니다.');
    }
  }, [selectedMaster]);

  // ── 컬럼 정의 ──
  // 마스터 컬럼
  const masterColumnDefs: ColDef<AssetAcqMasterItem>[] = useMemo(
    () => [
      {
        field: 'docNo',
        headerName: '품의번호',
        width: 135,
        pinned: 'left',
        sortable: true,
        cellRenderer: (params: any) => (
          <span style={{ fontWeight: 600, color: '#1677ff' }}>{params.value}</span>
        ),
      },
      {
        field: 'reqDate',
        headerName: '기안일자',
        width: 105,
        sortable: true,
      },
      {
        field: 'title',
        headerName: '품의명',
        flex: 1,
        minWidth: 160,
        sortable: true,
        tooltipField: 'title',
        cellStyle: () => ({ fontWeight: 500 }),
      },
      {
        field: 'totalBudget',
        headerName: '총예산',
        width: 125,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => `${Number(params.value || 0).toLocaleString()}원`,
        cellStyle: () => ({ textAlign: 'right', fontWeight: 700, color: '#059669' }),
      },
      {
        field: 'itemCount',
        headerName: '품목수',
        width: 75,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
        valueFormatter: (params: any) => `${params.value}건`,
      },
      {
        field: 'status',
        headerName: '상태',
        width: 90,
        cellRenderer: (params: any) => {
          const s = params.value;
          const color = s === '집행완료' ? 'success' : s === '승인완료' ? 'blue' : s === '결재대기' ? 'warning' : 'default';
          return <Tag color={color} style={{ margin: 0, fontSize: 11 }}>{s}</Tag>;
        },
      },
    ],
    []
  );

  // 디테일 컬럼
  const detailColumnDefs: ColDef<AssetAcqDetailItem>[] = useMemo(
    () => [
      {
        field: 'assetCode',
        headerName: '자산코드',
        width: 90,
        pinned: 'left',
        checkboxSelection: (params: any) => !params.node.rowPinned,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        cellStyle: () => ({ textAlign: 'center', fontWeight: 600 }),
      },
      {
        field: 'category',
        headerName: '분류',
        width: 110,
        editable: (params: any) => !params.node.rowPinned,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['IT서버', 'PC/노트북', '네트워크장비', '사무용기기', 'SW라이선스'],
        },
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return null;
          const cat = params.value;
          const color = cat === 'IT서버' ? 'geekblue' : cat === 'PC/노트북' ? 'blue' : cat === 'SW라이선스' ? 'purple' : 'default';
          return <Tag color={color} style={{ margin: 0, fontSize: 11 }}>{cat}</Tag>;
        },
      },
      {
        field: 'name',
        headerName: '취득 자산명 (인라인 편집)',
        flex: 1,
        minWidth: 170,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return <strong>{params.value}</strong>;
          return <span style={{ fontWeight: 500 }}>{params.value}</span>;
        },
      },
      {
        field: 'spec',
        headerName: '모델명 / 상세 규격',
        width: 180,
        editable: (params: any) => !params.node.rowPinned,
        tooltipField: 'spec',
      },
      {
        field: 'quantity',
        headerName: '수량',
        width: 75,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        type: 'numericColumn',
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'unitPrice',
        headerName: '단가 (원)',
        width: 115,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => {
          if (params.node.rowPinned) return '';
          return `${Number(params.value || 0).toLocaleString()}원`;
        },
        cellStyle: () => ({ textAlign: 'right' }),
      },
      {
        field: 'totalPrice',
        headerName: '취득금액 (수량×단가)',
        width: 135,
        editable: false,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => `${Number(params.value || 0).toLocaleString()}원`,
        cellStyle: (params: any): Record<string, string | number> => {
          if (params.node.rowPinned) {
            return { textAlign: 'right', fontWeight: 800, color: '#dc2626', fontSize: 12 };
          }
          return { textAlign: 'right', fontWeight: 700, color: '#1677ff' };
        },
      },
      {
        field: 'location',
        headerName: '설치/배치장소',
        width: 120,
        editable: (params: any) => !params.node.rowPinned,
      },
      {
        field: 'targetUser',
        headerName: '담당/사용자',
        width: 100,
        editable: (params: any) => !params.node.rowPinned,
        cellStyle: () => ({ textAlign: 'center' }),
      },
    ],
    []
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: '#f0f2f5',
        padding: 6,
        gap: 6,
      }}
    >
      {/* ── 1. 통합 탑바 ── */}
      <Card
        size="small"
        bodyStyle={{ padding: '8px 12px' }}
        style={{
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderRadius: 4,
          border: '1px solid #d9dfe8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LaptopOutlined style={{ color: '#0284c7', fontSize: 16 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>
              [1103] 자산 취득 품의서 (마스터-디테일 좌우 연동 그리드)
            </span>
            <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
              마스터: {masterData.length}건 / 디테일 자산: {detailData.length}개
            </Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
            <span>선택된 품의:</span>
            <Tag color="blue" style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
              {selectedMaster ? `${selectedMaster.docNo} - ${selectedMaster.title}` : '선택 없음'}
            </Tag>
          </div>
        </div>
      </Card>

      {/* ── 2. 좌우 2분할 마스터-디테일 본체 (사용법 3) ── */}
      <div style={{ flex: 1, display: 'flex', gap: 6, minHeight: 0, overflow: 'hidden' }}>
        {/* ── [좌측 마스터 영역 (46% 너비)]: 자산취득 품의 마스터 목록 ── */}
        <div
          style={{
            flex: '0 0 46%',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 360,
            overflow: 'hidden',
          }}
        >
          {/* 마스터 액션 바 (사용법 1: 조회, 저장, 등록, 삭제) */}
          <Card
            size="small"
            bodyStyle={{ padding: '6px 10px' }}
            style={{ flexShrink: 0, border: '1px solid #d9dfe8', borderRadius: 4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#1e3a5f' }}>
                  ▶ 품의 마스터
                </span>
                <Badge count={masterData.length} overflowCount={999} style={{ backgroundColor: '#1677ff' }} />
              </div>

              <Space size={4}>
                <Input
                  placeholder="품의명/번호 검색"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={masterQuickFilter}
                  onChange={(e) => setMasterQuickFilter(e.target.value)}
                  style={{ width: 130, fontSize: 11 }}
                  size="small"
                  allowClear
                />
                <Button size="small" icon={<ReloadOutlined />} onClick={handleMasterReload}>
                  조회
                </Button>
                <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleMasterSave} style={{ backgroundColor: '#1e3a5f' }}>
                  저장
                </Button>
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={handleOpenMasterModal} style={{ backgroundColor: '#2563eb' }}>
                  등록
                </Button>
                <Popconfirm title="선택한 품의를 삭제하시겠습니까?" okText="삭제" cancelText="취소" onConfirm={handleMasterDelete}>
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    삭제
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          </Card>

          {/* 마스터 AG Grid */}
          <div
            className="ag-theme-alpine"
            style={{
              flex: 1,
              minHeight: 0,
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #d9dfe8',
            }}
          >
            <AgGridReact<AssetAcqMasterItem>
              ref={masterGridRef}
              rowData={masterData}
              columnDefs={masterColumnDefs}
              quickFilterText={masterQuickFilter}
              rowSelection="single"
              headerHeight={34}
              rowHeight={32}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: false,
                suppressHeaderMenuButton: true,
              }}
              pagination={false}
              onRowSelected={handleMasterRowSelected}
            />
          </div>
        </div>

        {/* ── [우측 디테일 영역 (54% 너비)]: 선택된 품의의 취득 자산 목록 ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 420,
            overflow: 'hidden',
          }}
        >
          {/* 디테일 액션 바 (사용법 1 스타일: 상세 추가, 삭제, 저장, CSV) */}
          <Card
            size="small"
            bodyStyle={{ padding: '6px 10px' }}
            style={{ flexShrink: 0, border: '1px solid #d9dfe8', borderRadius: 4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#1e3a5f' }}>
                  ▶ 상세 취득 자산 목록
                </span>
                <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
                  {currentDetailList.length}건
                </Tag>
                <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  (품의: {selectedMaster?.docNo})
                </span>
              </div>

              <Space size={4}>
                <Input
                  placeholder="자산명/규격 검색"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={detailQuickFilter}
                  onChange={(e) => setDetailQuickFilter(e.target.value)}
                  style={{ width: 140, fontSize: 11 }}
                  size="small"
                  allowClear
                />
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={handleAddDetailRow} style={{ backgroundColor: '#2563eb' }}>
                  자산 추가
                </Button>
                <Popconfirm title="선택한 자산 항목을 삭제하시겠습니까?" okText="삭제" cancelText="취소" onConfirm={handleDeleteSelectedDetails}>
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    자산 삭제
                  </Button>
                </Popconfirm>
                <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleMasterSave} style={{ backgroundColor: '#1e3a5f' }}>
                  저장
                </Button>
                <Button size="small" icon={<DownloadOutlined />} onClick={handleExportDetailCsv}>
                  CSV
                </Button>
              </Space>
            </div>
          </Card>

          {/* 디테일 AG Grid (인라인 편집 및 하단 Pinned 합계 행) */}
          <div
            className="ag-theme-alpine"
            style={{
              flex: 1,
              minHeight: 0,
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #d9dfe8',
            }}
          >
            <style>{`
              .ag-theme-alpine .ag-row-pinned {
                background-color: #f8fafc !important;
                font-weight: 700 !important;
                border-top: 2px solid #cbd5e1 !important;
              }
            `}</style>
            <AgGridReact<AssetAcqDetailItem>
              ref={detailGridRef}
              rowData={currentDetailList}
              pinnedBottomRowData={detailPinnedBottomRowData}
              columnDefs={detailColumnDefs}
              quickFilterText={detailQuickFilter}
              rowSelection="multiple"
              headerHeight={34}
              rowHeight={32}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: false,
                suppressHeaderMenuButton: true,
              }}
              pagination={false}
              singleClickEdit={false}
              stopEditingWhenCellsLoseFocus={true}
              onCellValueChanged={handleDetailCellValueChanged}
            />
          </div>
        </div>
      </div>

      {/* ── 3. 신규 자산취득품의 마스터 등록 모달 ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e3a5f' }}>
            <LaptopOutlined />
            <span>신규 자산 취득 품의서 등록</span>
          </div>
        }
        open={isMasterModalOpen}
        onCancel={() => {
          setIsMasterModalOpen(false);
          masterForm.resetFields();
        }}
        onOk={handleCreateMaster}
        okText="품의 등록"
        cancelText="취소"
        width={540}
      >
        <Form
          form={masterForm}
          layout="vertical"
          initialValues={{
            dept: 'IT개발실',
            requester: '김도영',
          }}
          style={{ marginTop: 12 }}
        >
          <Form.Item name="title" label="품의명" rules={[{ required: true, message: '품의명을 입력하세요.' }]}>
            <Input placeholder="예: 2026년 하반기 전산실 네트워크 스위치 및 방화벽 고도화의 건" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="dept" label="신청부서" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="requester" label="기안자" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/pages/doc/index.ts"
export { DocDraftManageView } from './DocDraftManageView';
export { DocExpenseManageView } from './DocExpenseManageView';
export { DocAssetAcquisitionView } from './DocAssetAcquisitionView';
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/App.tsx"
import { useState, useEffect, useRef } from 'react';
import { message, Dropdown, MenuProps, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import {
  Layout,
  Model,
  Actions,
  TabNode,
  TabSetNode,
  BorderNode,
  ITabSetRenderValues,
  IJsonModel,
  DockLocation,
} from 'flexlayout-react';
import './flexlayout-custom.css';

import { TopBar } from './components/TopBar';
import { LeftMenuBar } from './components/LeftMenuBar';
import { StatusBar } from './components/StatusBar';
import { MyPageView } from './components/mypage';
import { LargeDataView } from './components/LargeDataView';
import { DocDraftManageView, DocExpenseManageView, DocAssetAcquisitionView } from './pages/doc';
import { MenuLevel_1, MenuLevel_3 } from './types';
import { appSettingsStorage, SavedLayoutItem } from './utils/storage';
import { useAppSetting } from './hooks/useAppSetting';
import { getFontOption, applyGlobalFont, FontFamilyId } from './utils/font';

// ── 기본 레이아웃 정의 (초기 상태: My Page 1개 탭) ──
const defaultLayoutJson: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabSetEnableMaximize: false, // FlexLayout 기본 최대화 버튼 미노출 (onRenderTabSet에서 커스텀 버튼 렌더)
    tabSetEnableClose: true, // 탭셋 닫기/삭제 허용
    tabSetEnableCloseButton: false, // FlexLayout 기본 닫기 버튼 미노출 (onRenderTabSet에서 커스텀 버튼 렌더)
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

// 로컬 스토리지에 저장된 레이아웃 정제 (0개 탭 자동 소멸, 최대화 해제, 분할 허용 강제 적용)
function sanitizeLayoutJson(json: IJsonModel): IJsonModel {
  if (!json.global) {
    json.global = {};
  }
  json.global.tabSetEnableClose = true;
  json.global.tabSetEnableCloseButton = false;
  json.global.tabSetEnableDeleteWhenEmpty = true;
  json.global.tabEnableScrollbars = false; // 외곽 스크롤 방지
  json.global.tabSetEnableMaximize = false; // FlexLayout 기본 최대화 버튼 방지
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
      if (node.maximized) delete node.maximized; // 저장된 최대화 상태 초기 해제
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

// 로컬 스토리지(asseterp_settings)에서 저장된 레이아웃 복원 또는 기본 레이아웃 로드
function getInitialModel(): Model {
  const savedLayout = appSettingsStorage.get('flexlayout_model');
  if (savedLayout) {
    try {
      const m = Model.fromJson(sanitizeLayoutJson(savedLayout));
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

export default function App() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>('duty');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedMenuLevel_3_Code, setSelectedMenuLevel_3_Code] = useState<string>('1495');

  // ── 글꼴 설정 상태 (asseterp_settings 단일 저장소 연동) ──
  const [fontFamily, setFontFamily] = useAppSetting('font_family', 'pretendard');
  const currentFontOpt = getFontOption(fontFamily);

  useEffect(() => {
    applyGlobalFont(fontFamily);
  }, [fontFamily]);

  // ── FlexLayout 모델 상태 ──
  const [model, setModel] = useState<Model>(() => getInitialModel());

  // ── 저장된 명명 레이아웃 목록 상태 ──
  const [savedLayouts, setSavedLayouts] = useState<SavedLayoutItem[]>(() =>
    appSettingsStorage.getSavedLayouts()
  );

  // ── 탭 헤더 컨텍스트 메뉴 상태 ──
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    tabNode: TabNode | null;
  }>({ open: false, x: 0, y: 0, tabNode: null });

  const handleSelectMenuLevel_1 = (menuId: string | null) => {
    setActiveMenuId(menuId);
  };

  // ── 메뉴 클릭 및 화면번호 검색 시: 활성화된 탭셋(TabSet)에 새 탭 추가 또는 기존 탭 활성화 ──
  const handleSelectMenuLevel_3 = (item: MenuLevel_3, _parent: MenuLevel_1) => {
    setSelectedMenuLevel_3_Code(item.code);
    const tabId = `tab-${item.code}`;

    const existingNode = model.getNodeById(tabId);
    if (existingNode) {
      // 이미 열려 있는 탭이면 해당 탭 선택
      model.doAction(Actions.selectTab(tabId));
    } else {
      // 현재 활성화된 탭셋(없으면 첫 번째 탭셋)에 탭 추가
      const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
      const targetTabsetId = activeTabset ? activeTabset.getId() : 'main-tabset';

      const componentType =
        item.code === '1101'
          ? 'doc-1101'
          : item.code === '1102'
          ? 'doc-1102'
          : item.code === '1103'
          ? 'doc-1103'
          : 'largedata';

      model.doAction(
        Actions.addTab(
          {
            type: 'tab',
            name: `${item.code} ${item.title}`,
            component: componentType,
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
  };

  // ── 레이아웃 변경 시 자동 로컬 스토리지(asseterp_settings) 디바운스 비동기 저장 ──
  const saveLayoutTimerRef = useRef<number | null>(null);
  const handleModelChange = (newModel: Model) => {
    if (saveLayoutTimerRef.current) {
      window.clearTimeout(saveLayoutTimerRef.current);
    }
    saveLayoutTimerRef.current = window.setTimeout(() => {
      appSettingsStorage.set('flexlayout_model', newModel.toJson());
    }, 200);
  };

  // ── 단축키 F4: 최대화 및 복원 토글 ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        const maxTs = model.getMaximizedTabset();
        if (maxTs) {
          model.doAction(Actions.maximizeToggle(maxTs.getId()));
        } else {
          const target = model.getActiveTabset() || model.getFirstTabSet();
          if (target) {
            model.doAction(Actions.maximizeToggle(target.getId()));
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [model]);

  // ── 컨텍스트 메뉴 외부 클릭 시 닫기 ──
  useEffect(() => {
    if (!contextMenu.open) return;
    const handleOutsideClick = () => {
      setContextMenu((prev) => ({ ...prev, open: false }));
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [contextMenu.open]);

  // ── 탭셋 내부의 모든 닫기 가능 탭 일괄 닫기 ──
  const handleCloseAllInTabSet = (tabset: TabSetNode) => {
    const children = tabset.getChildren().filter((c): c is TabNode => c instanceof TabNode);
    const closeableTabs = children.filter((t) => t.isCloseable());
    if (closeableTabs.length === 0) {
      message.info('닫을 수 있는 탭이 없습니다.');
      return;
    }
    closeableTabs.forEach((tab) => {
      model.doAction(Actions.deleteTab(tab.getId()));
    });
  };

  // ── TabSet 우측 툴바 버튼 커스텀 렌더: '모든 탭 닫기' & '최대화/복원(F4)' ──
  const onRenderTabSet = (tabSetNode: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
    if (!(tabSetNode instanceof TabSetNode)) return;
    const isMax = tabSetNode.isMaximized();

    renderValues.buttons.push(
      <button
        key="close-all"
        type="button"
        title="모든 탭 닫기"
        className="flexlayout-toolbar-custom-btn"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          handleCloseAllInTabSet(tabSetNode);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x"
          aria-hidden="true"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>,
      <button
        key="max-toggle"
        type="button"
        title={isMax ? '복원(F4)' : '최대화(F4)'}
        className="flexlayout-toolbar-custom-btn"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          model.doAction(Actions.maximizeToggle(tabSetNode.getId()));
        }}
      >
        {isMax ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: 14, height: 14, strokeWidth: 2.5 }}
          >
            <path
              stroke="var(--color-icon)"
              d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: 14, height: 14, strokeWidth: 2.5 }}
          >
            <path
              stroke="var(--color-icon)"
              d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
            ></path>
          </svg>
        )}
      </button>
    );
  };

  // ── 탭 헤더 우클릭 시 컨텍스트 메뉴 표시 ──
  const handleContextMenu = (node: any, event: React.MouseEvent<HTMLElement>) => {
    if (node instanceof TabNode) {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({
        open: true,
        x: event.clientX,
        y: event.clientY,
        tabNode: node,
      });
    }
  };

  // ── 컨텍스트 메뉴 아이템 목록 생성 ──
  const getContextMenuItems = (): MenuProps['items'] => {
    const targetTab = contextMenu.tabNode;
    if (!targetTab) return [];

    const parent = targetTab.getParent();
    const siblings = parent
      ? parent.getChildren().filter((c): c is TabNode => c instanceof TabNode)
      : [];
    const currentIndex = siblings.findIndex((s) => s.getId() === targetTab.getId());

    const rightSiblings = currentIndex >= 0 ? siblings.slice(currentIndex + 1) : [];
    const otherSiblings = currentIndex >= 0 ? siblings.filter((_, i) => i !== currentIndex) : [];

    const canCloseCurrent = targetTab.isCloseable();
    const canCloseRight = rightSiblings.some((s) => s.isCloseable());
    const canCloseOthers = otherSiblings.some((s) => s.isCloseable());
    const canCloseAll = siblings.some((s) => s.isCloseable());

    return [
      {
        key: 'close-current',
        label: '이 탭 닫기',
        disabled: !canCloseCurrent,
        onClick: () => {
          if (canCloseCurrent) {
            model.doAction(Actions.deleteTab(targetTab.getId()));
          }
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        key: 'close-right',
        label: '오른쪽 모든 탭 닫기',
        disabled: !canCloseRight,
        onClick: () => {
          rightSiblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        key: 'close-others',
        label: '다른 탭 모두 닫기',
        disabled: !canCloseOthers,
        onClick: () => {
          otherSiblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        type: 'divider',
      },
      {
        key: 'close-all',
        label: '전체 탭 닫기',
        disabled: !canCloseAll,
        danger: true,
        onClick: () => {
          siblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
    ];
  };


  // ── 명명 레이아웃 저장/불러오기/삭제/초기화 핸들러 ──
  const handleSaveNamedLayout = (name: string) => {
    const item = appSettingsStorage.saveLayout(name, model.toJson());
    setSavedLayouts(appSettingsStorage.getSavedLayouts());
    message.success(`'${item.name}' 레이아웃이 저장되었습니다.`);
  };

  const handleLoadNamedLayout = (item: SavedLayoutItem) => {
    try {
      const sanitized = sanitizeLayoutJson(item.modelJson);
      const m = Model.fromJson(sanitized);
      setModel(m);
      appSettingsStorage.set('flexlayout_model', sanitized);
      message.success(`'${item.name}' 레이아웃을 불러왔습니다.`);
    } catch (e) {
      message.error('레이아웃 불러오기에 실패했습니다.');
      console.error(e);
    }
  };

  const handleDeleteNamedLayout = (id: string) => {
    appSettingsStorage.deleteSavedLayout(id);
    setSavedLayouts(appSettingsStorage.getSavedLayouts());
    message.info('레이아웃이 삭제되었습니다.');
  };

  const handleResetLayout = () => {
    appSettingsStorage.remove('flexlayout_model');
    setModel(Model.fromJson(defaultLayoutJson));
    message.info('기본 레이아웃으로 초기화되었습니다.');
  };

  // ── FlexLayout Tab 컴포넌트 렌더러 (factory) ──
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = (node.getConfig() as { code?: string; title?: string }) || {};

    if (component === 'mypage') {
      return <MyPageView />;
    }

    const code = config.code || node.getId().replace('tab-', '');

    // 1101 일반기안서 작성
    if (code === '1101' || component === 'doc-1101') {
      return <DocDraftManageView />;
    }

    // 1102 비용품의서 작성
    if (code === '1102' || component === 'doc-1102') {
      return <DocExpenseManageView />;
    }

    // 1103 자산취득품의서
    if (code === '1103' || component === 'doc-1103') {
      return <DocAssetAcquisitionView />;
    }

    // 기본 대용량 데이터 뷰 (AgGrid: 외부 스크롤 없이 AgGrid 내부 가상 스크롤만 동작하도록 격리)
    return (
      <div style={{ flex: 1, overflow: 'hidden', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
        <LargeDataView
          title={config.title || node.getName()}
          menuCode={code}
        />
      </div>
    );
  };

  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          fontFamily: currentFontOpt.cssFamily,
        },
      }}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          sidebarPinned={sidebarPinned}
          onToggleSidebarPin={() => setSidebarPinned(!sidebarPinned)}
          onOpenScreen={handleSelectMenuLevel_3}
          savedLayouts={savedLayouts}
          onSaveNamedLayout={handleSaveNamedLayout}
          onLoadNamedLayout={handleLoadNamedLayout}
          onDeleteNamedLayout={handleDeleteNamedLayout}
          onResetLayout={handleResetLayout}
          currentFontId={fontFamily as FontFamilyId}
          onChangeFont={(id) => setFontFamily(id)}
        />

        {/* ── Body Container with LeftMenuBar & FlexLayout ── */}
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, backgroundColor: '#eef2f6' }}>
            {/* FlexLayout Viewport */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Layout
                model={model}
                factory={factory}
                onModelChange={handleModelChange}
                onRenderTabSet={onRenderTabSet}
                onContextMenu={handleContextMenu}
                realtimeResize
              />

              {/* 탭 헤더 우클릭 컨텍스트 메뉴 */}
              <Dropdown
                menu={{ items: getContextMenuItems() }}
                open={contextMenu.open}
                onOpenChange={(open) => !open && setContextMenu((prev) => ({ ...prev, open: false }))}
                trigger={['contextMenu']}
              >
                <div
                  style={{
                    position: 'fixed',
                    left: contextMenu.x,
                    top: contextMenu.y,
                    width: 1,
                    height: 1,
                    pointerEvents: 'none',
                    zIndex: 9999,
                  }}
                />
              </Dropdown>
            </div>
          </div>
        </div>

        {/* ── Status Bar (System Health, Message, Clock) ── */}
        <StatusBar />
      </div>
    </ConfigProvider>
  );
}
EOF
    cp "$TARGET_DIR/frontend/src/components/layout/LeftMenuBar.tsx" "$TARGET_DIR/frontend/src/components/LeftMenuBar.tsx" 2>/dev/null || true
    cp "$TARGET_DIR/frontend/src/components/layout/StatusBar.tsx" "$TARGET_DIR/frontend/src/components/StatusBar.tsx" 2>/dev/null || true
    cp "$TARGET_DIR/frontend/src/components/common/grid/LargeDataView.tsx" "$TARGET_DIR/frontend/src/components/LargeDataView.tsx" 2>/dev/null || true
    cp "$TARGET_DIR/frontend/src/pages/mypage/MyPageCalendar.tsx" "$TARGET_DIR/frontend/src/components/mypage/MyPageCalendar.tsx" 2>/dev/null || true


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
import { appSettingsStorage } from '../../utils/storage';

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
  const savedLayout = appSettingsStorage.get('flexlayout_model');
  if (savedLayout) {
    try {
      const m = Model.fromJson(sanitizeLayoutJson(savedLayout));
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

  // ── 레이아웃 변경 시 자동 로컬 스토리지(asseterp_settings) 저장 ──
  const handleModelChange = (newModel: Model) => {
    appSettingsStorage.set('flexlayout_model', newModel.toJson());
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
    appSettingsStorage.set('flexlayout_model', model.toJson());
    message.success('현재 화면 분할 및 탭 레이아웃이 저장되었습니다.');
  };

  // ── 레이아웃 기본값으로 초기화 ──
  const handleResetLayout = () => {
    appSettingsStorage.remove('flexlayout_model');
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
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import App from './App.tsx';

// AG Grid Community 전체 모듈 등록
ModuleRegistry.registerModules([AllCommunityModule]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

    cat << 'EOF' > "$TARGET_DIR/frontend/src/App.tsx"
import { useState, useEffect, useRef } from 'react';
import { message, Dropdown, MenuProps, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import {
  Layout,
  Model,
  Actions,
  TabNode,
  TabSetNode,
  BorderNode,
  ITabSetRenderValues,
  IJsonModel,
  DockLocation,
} from 'flexlayout-react';
import './flexlayout-custom.css';

import { TopBar } from './components/TopBar';
import { LeftMenuBar } from './components/LeftMenuBar';
import { StatusBar } from './components/StatusBar';
import { MyPageView } from './components/mypage';
import { LargeDataView } from './components/LargeDataView';
import { DocDraftManageView, DocExpenseManageView, DocAssetAcquisitionView } from './pages/doc';
import { MenuLevel_1, MenuLevel_3 } from './types';
import { appSettingsStorage, SavedLayoutItem } from './utils/storage';
import { useAppSetting } from './hooks/useAppSetting';
import { getFontOption, applyGlobalFont, FontFamilyId } from './utils/font';

// ── 기본 레이아웃 정의 (초기 상태: My Page 1개 탭) ──
const defaultLayoutJson: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabSetEnableMaximize: false, // FlexLayout 기본 최대화 버튼 미노출 (onRenderTabSet에서 커스텀 버튼 렌더)
    tabSetEnableClose: true, // 탭셋 닫기/삭제 허용
    tabSetEnableCloseButton: false, // FlexLayout 기본 닫기 버튼 미노출 (onRenderTabSet에서 커스텀 버튼 렌더)
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

// 로컬 스토리지에 저장된 레이아웃 정제 (0개 탭 자동 소멸, 최대화 해제, 분할 허용 강제 적용)
function sanitizeLayoutJson(json: IJsonModel): IJsonModel {
  if (!json.global) {
    json.global = {};
  }
  json.global.tabSetEnableClose = true;
  json.global.tabSetEnableCloseButton = false;
  json.global.tabSetEnableDeleteWhenEmpty = true;
  json.global.tabEnableScrollbars = false; // 외곽 스크롤 방지
  json.global.tabSetEnableMaximize = false; // FlexLayout 기본 최대화 버튼 방지
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
      if (node.maximized) delete node.maximized; // 저장된 최대화 상태 초기 해제
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

// 로컬 스토리지(asseterp_settings)에서 저장된 레이아웃 복원 또는 기본 레이아웃 로드
function getInitialModel(): Model {
  const savedLayout = appSettingsStorage.get('flexlayout_model');
  if (savedLayout) {
    try {
      const m = Model.fromJson(sanitizeLayoutJson(savedLayout));
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

export default function App() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>('duty');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(true);
  const [selectedMenuLevel_3_Code, setSelectedMenuLevel_3_Code] = useState<string>('1495');

  // ── 글꼴 설정 상태 (asseterp_settings 단일 저장소 연동) ──
  const [fontFamily, setFontFamily] = useAppSetting('font_family', 'pretendard');
  const currentFontOpt = getFontOption(fontFamily);

  useEffect(() => {
    applyGlobalFont(fontFamily);
  }, [fontFamily]);

  // ── FlexLayout 모델 상태 ──
  const [model, setModel] = useState<Model>(() => getInitialModel());

  // ── 저장된 명명 레이아웃 목록 상태 ──
  const [savedLayouts, setSavedLayouts] = useState<SavedLayoutItem[]>(() =>
    appSettingsStorage.getSavedLayouts()
  );

  // ── 탭 헤더 컨텍스트 메뉴 상태 ──
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    tabNode: TabNode | null;
  }>({ open: false, x: 0, y: 0, tabNode: null });

  const handleSelectMenuLevel_1 = (menuId: string | null) => {
    setActiveMenuId(menuId);
  };

  // ── 메뉴 클릭 및 화면번호 검색 시: 활성화된 탭셋(TabSet)에 새 탭 추가 또는 기존 탭 활성화 ──
  const handleSelectMenuLevel_3 = (item: MenuLevel_3, _parent: MenuLevel_1) => {
    setSelectedMenuLevel_3_Code(item.code);
    const tabId = `tab-${item.code}`;

    const existingNode = model.getNodeById(tabId);
    if (existingNode) {
      // 이미 열려 있는 탭이면 해당 탭 선택
      model.doAction(Actions.selectTab(tabId));
    } else {
      // 현재 활성화된 탭셋(없으면 첫 번째 탭셋)에 탭 추가
      const activeTabset = model.getActiveTabset() || model.getFirstTabSet();
      const targetTabsetId = activeTabset ? activeTabset.getId() : 'main-tabset';

      const componentType =
        item.code === '1101'
          ? 'doc-1101'
          : item.code === '1102'
          ? 'doc-1102'
          : item.code === '1103'
          ? 'doc-1103'
          : 'largedata';

      model.doAction(
        Actions.addTab(
          {
            type: 'tab',
            name: `${item.code} ${item.title}`,
            component: componentType,
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
  };

  // ── 레이아웃 변경 시 자동 로컬 스토리지(asseterp_settings) 디바운스 비동기 저장 ──
  const saveLayoutTimerRef = useRef<number | null>(null);
  const handleModelChange = (newModel: Model) => {
    if (saveLayoutTimerRef.current) {
      window.clearTimeout(saveLayoutTimerRef.current);
    }
    saveLayoutTimerRef.current = window.setTimeout(() => {
      appSettingsStorage.set('flexlayout_model', newModel.toJson());
    }, 200);
  };

  // ── 단축키 F4: 최대화 및 복원 토글 ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        const maxTs = model.getMaximizedTabset();
        if (maxTs) {
          model.doAction(Actions.maximizeToggle(maxTs.getId()));
        } else {
          const target = model.getActiveTabset() || model.getFirstTabSet();
          if (target) {
            model.doAction(Actions.maximizeToggle(target.getId()));
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [model]);

  // ── 컨텍스트 메뉴 외부 클릭 시 닫기 ──
  useEffect(() => {
    if (!contextMenu.open) return;
    const handleOutsideClick = () => {
      setContextMenu((prev) => ({ ...prev, open: false }));
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [contextMenu.open]);

  // ── 탭셋 내부의 모든 닫기 가능 탭 일괄 닫기 ──
  const handleCloseAllInTabSet = (tabset: TabSetNode) => {
    const children = tabset.getChildren().filter((c): c is TabNode => c instanceof TabNode);
    const closeableTabs = children.filter((t) => t.isCloseable());
    if (closeableTabs.length === 0) {
      message.info('닫을 수 있는 탭이 없습니다.');
      return;
    }
    closeableTabs.forEach((tab) => {
      model.doAction(Actions.deleteTab(tab.getId()));
    });
  };

  // ── TabSet 우측 툴바 버튼 커스텀 렌더: '모든 탭 닫기' & '최대화/복원(F4)' ──
  const onRenderTabSet = (tabSetNode: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
    if (!(tabSetNode instanceof TabSetNode)) return;
    const isMax = tabSetNode.isMaximized();

    renderValues.buttons.push(
      <button
        key="close-all"
        type="button"
        title="모든 탭 닫기"
        className="flexlayout-toolbar-custom-btn"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          handleCloseAllInTabSet(tabSetNode);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x"
          aria-hidden="true"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>,
      <button
        key="max-toggle"
        type="button"
        title={isMax ? '복원(F4)' : '최대화(F4)'}
        className="flexlayout-toolbar-custom-btn"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          model.doAction(Actions.maximizeToggle(tabSetNode.getId()));
        }}
      >
        {isMax ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: 14, height: 14, strokeWidth: 2.5 }}
          >
            <path
              stroke="var(--color-icon)"
              d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ width: 14, height: 14, strokeWidth: 2.5 }}
          >
            <path
              stroke="var(--color-icon)"
              d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
            ></path>
          </svg>
        )}
      </button>
    );
  };

  // ── 탭 헤더 우클릭 시 컨텍스트 메뉴 표시 ──
  const handleContextMenu = (node: any, event: React.MouseEvent<HTMLElement>) => {
    if (node instanceof TabNode) {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({
        open: true,
        x: event.clientX,
        y: event.clientY,
        tabNode: node,
      });
    }
  };

  // ── 컨텍스트 메뉴 아이템 목록 생성 ──
  const getContextMenuItems = (): MenuProps['items'] => {
    const targetTab = contextMenu.tabNode;
    if (!targetTab) return [];

    const parent = targetTab.getParent();
    const siblings = parent
      ? parent.getChildren().filter((c): c is TabNode => c instanceof TabNode)
      : [];
    const currentIndex = siblings.findIndex((s) => s.getId() === targetTab.getId());

    const rightSiblings = currentIndex >= 0 ? siblings.slice(currentIndex + 1) : [];
    const otherSiblings = currentIndex >= 0 ? siblings.filter((_, i) => i !== currentIndex) : [];

    const canCloseCurrent = targetTab.isCloseable();
    const canCloseRight = rightSiblings.some((s) => s.isCloseable());
    const canCloseOthers = otherSiblings.some((s) => s.isCloseable());
    const canCloseAll = siblings.some((s) => s.isCloseable());

    return [
      {
        key: 'close-current',
        label: '이 탭 닫기',
        disabled: !canCloseCurrent,
        onClick: () => {
          if (canCloseCurrent) {
            model.doAction(Actions.deleteTab(targetTab.getId()));
          }
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        key: 'close-right',
        label: '오른쪽 모든 탭 닫기',
        disabled: !canCloseRight,
        onClick: () => {
          rightSiblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        key: 'close-others',
        label: '다른 탭 모두 닫기',
        disabled: !canCloseOthers,
        onClick: () => {
          otherSiblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
      {
        type: 'divider',
      },
      {
        key: 'close-all',
        label: '전체 탭 닫기',
        disabled: !canCloseAll,
        danger: true,
        onClick: () => {
          siblings.forEach((tab) => {
            if (tab.isCloseable()) {
              model.doAction(Actions.deleteTab(tab.getId()));
            }
          });
          setContextMenu((prev) => ({ ...prev, open: false }));
        },
      },
    ];
  };


  // ── 명명 레이아웃 저장/불러오기/삭제/초기화 핸들러 ──
  const handleSaveNamedLayout = (name: string) => {
    const item = appSettingsStorage.saveLayout(name, model.toJson());
    setSavedLayouts(appSettingsStorage.getSavedLayouts());
    message.success(`'${item.name}' 레이아웃이 저장되었습니다.`);
  };

  const handleLoadNamedLayout = (item: SavedLayoutItem) => {
    try {
      const sanitized = sanitizeLayoutJson(item.modelJson);
      const m = Model.fromJson(sanitized);
      setModel(m);
      appSettingsStorage.set('flexlayout_model', sanitized);
      message.success(`'${item.name}' 레이아웃을 불러왔습니다.`);
    } catch (e) {
      message.error('레이아웃 불러오기에 실패했습니다.');
      console.error(e);
    }
  };

  const handleDeleteNamedLayout = (id: string) => {
    appSettingsStorage.deleteSavedLayout(id);
    setSavedLayouts(appSettingsStorage.getSavedLayouts());
    message.info('레이아웃이 삭제되었습니다.');
  };

  const handleResetLayout = () => {
    appSettingsStorage.remove('flexlayout_model');
    setModel(Model.fromJson(defaultLayoutJson));
    message.info('기본 레이아웃으로 초기화되었습니다.');
  };

  // ── FlexLayout Tab 컴포넌트 렌더러 (factory) ──
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = (node.getConfig() as { code?: string; title?: string }) || {};

    if (component === 'mypage') {
      return <MyPageView />;
    }

    const code = config.code || node.getId().replace('tab-', '');

    // 1101 일반기안서 작성
    if (code === '1101' || component === 'doc-1101') {
      return <DocDraftManageView />;
    }

    // 1102 비용품의서 작성
    if (code === '1102' || component === 'doc-1102') {
      return <DocExpenseManageView />;
    }

    // 1103 자산취득품의서
    if (code === '1103' || component === 'doc-1103') {
      return <DocAssetAcquisitionView />;
    }

    // 기본 대용량 데이터 뷰 (AgGrid: 외부 스크롤 없이 AgGrid 내부 가상 스크롤만 동작하도록 격리)
    return (
      <div style={{ flex: 1, overflow: 'hidden', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
        <LargeDataView
          title={config.title || node.getName()}
          menuCode={code}
        />
      </div>
    );
  };

  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          fontFamily: currentFontOpt.cssFamily,
        },
      }}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          sidebarPinned={sidebarPinned}
          onToggleSidebarPin={() => setSidebarPinned(!sidebarPinned)}
          onOpenScreen={handleSelectMenuLevel_3}
          savedLayouts={savedLayouts}
          onSaveNamedLayout={handleSaveNamedLayout}
          onLoadNamedLayout={handleLoadNamedLayout}
          onDeleteNamedLayout={handleDeleteNamedLayout}
          onResetLayout={handleResetLayout}
          currentFontId={fontFamily as FontFamilyId}
          onChangeFont={(id) => setFontFamily(id)}
        />

        {/* ── Body Container with LeftMenuBar & FlexLayout ── */}
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, backgroundColor: '#eef2f6' }}>
            {/* FlexLayout Viewport */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Layout
                model={model}
                factory={factory}
                onModelChange={handleModelChange}
                onRenderTabSet={onRenderTabSet}
                onContextMenu={handleContextMenu}
                realtimeResize
              />

              {/* 탭 헤더 우클릭 컨텍스트 메뉴 */}
              <Dropdown
                menu={{ items: getContextMenuItems() }}
                open={contextMenu.open}
                onOpenChange={(open) => !open && setContextMenu((prev) => ({ ...prev, open: false }))}
                trigger={['contextMenu']}
              >
                <div
                  style={{
                    position: 'fixed',
                    left: contextMenu.x,
                    top: contextMenu.y,
                    width: 1,
                    height: 1,
                    pointerEvents: 'none',
                    zIndex: 9999,
                  }}
                />
              </Dropdown>
            </div>
          </div>
        </div>

        {/* ── Status Bar (System Health, Message, Clock) ── */}
        <StatusBar />
      </div>
    </ConfigProvider>
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
