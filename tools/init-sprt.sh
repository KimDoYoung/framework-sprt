#!/usr/bin/env bash
#============================================================================
# init-sprt.sh - AssetERP 차세대 테스트 프로젝트 초기화 스크립트
#
# 위치: tools/init-sprt.sh
# 실행: mkdir antdesign && cd antdesign && ../tools/init-sprt.sh
#
# 디렉토리 구조와 꼭 필요한 설정/스크립트 파일만 생성한다(빈 앱 셸).
# 실제 화면 소스는 추후 antdesign/ 에서 git archive로 가져오는 방식으로 전환 예정.
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

# ── 기존 프로젝트 덮어쓰기 방지 ─────────────────────────────────────────────
for existing in frontend backend bm.sh fm.sh deploy.sh; do
    if [[ -e "$TARGET_DIR/$existing" ]]; then
        error "이미 '$existing' 이(가) 존재합니다. 기존 프로젝트를 덮어쓰지 않도록 빈 디렉토리에서 실행하세요."
        exit 1
    fi
done

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
echo -e "${YELLOW}[1/3]${NC} 프로젝트 명칭을 입력하세요 [기본값: ${BOLD}${DEFAULT_APP_NAME}${NC}]:"
read -r INPUT_NAME
APP_NAME="${INPUT_NAME:-$DEFAULT_APP_NAME}"

echo -e "\n${YELLOW}[2/3]${NC} 패키지 설치(npm install)를 지금 진행할까요?"
echo "  1) 예 (권장)"
echo "  2) 아니오 (나중에 cd frontend && npm install)"
read -rp "선택 [1/2, 기본 1]: " INSTALL_OPT
INSTALL_OPT="${INSTALL_OPT:-1}"

echo -e "\n${YELLOW}[3/3]${NC} 프로젝트 [${BOLD}${APP_NAME}${NC}] 생성을 진행하시겠습니까? (y/n) [기본: y]:"
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
mkdir -p "$TARGET_DIR/backend/src/test/java/com/asseterp/test"
mkdir -p "$TARGET_DIR/frontend/public"
mkdir -p "$TARGET_DIR/frontend/src/components/mypage"
mkdir -p "$TARGET_DIR/frontend/src/hooks"
mkdir -p "$TARGET_DIR/frontend/src/mock"
mkdir -p "$TARGET_DIR/frontend/src/pages/doc"
mkdir -p "$TARGET_DIR/frontend/src/types"
mkdir -p "$TARGET_DIR/frontend/src/utils"
touch "$TARGET_DIR/backend/src/main/resources/static/.gitkeep"

info "docs/, backend/, frontend/ 기본 디렉토리 생성 완료"

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
*.tsbuildinfo
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

info "README.md 생성 완료: # ${APP_NAME}"

cat << EOF > "$TARGET_DIR/docs/README.md"
# ${APP_NAME} Documentation

문서 디렉토리입니다. 아키텍처 및 상세 설계 문서를 이곳에 보관합니다.
EOF

# ── 4. Frontend 파일 구성 ──────────────────────────────────────────────────
# 설정 파일과 빈 앱 셸만 생성한다. 실제 화면 소스(App.tsx, components/ 등)는
# 추후 antdesign/ 에서 git archive로 가져오는 방식으로 전환 예정.
header "4. 프론트엔드 기본 설정 생성 (Ant Design)"

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

# base: './' — WAR를 /${APP_NAME} 컨텍스트로 배포할 때 정적 리소스 경로가 깨지지 않도록 상대 경로 사용
cat << 'EOF' > "$TARGET_DIR/frontend/vite.config.ts"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
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

cat << EOF > "$TARGET_DIR/frontend/src/App.tsx"
import { ConfigProvider, Result } from 'antd';
import koKR from 'antd/locale/ko_KR';

// 빈 앱 셸 - TopBar / LeftMenuBar / FlexLayout / StatusBar 구성으로 교체할 자리
export default function App() {
  return (
    <ConfigProvider locale={koKR}>
      <Result status="info" title="${APP_NAME}" subTitle="AssetERP 차세대 프로토타입 - 초기 골격" />
    </ConfigProvider>
  );
}
EOF

info "frontend/ 설정 및 빈 앱 셸 생성 완료"

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

# 접속정보는 환경변수로 주입한다 (비밀번호를 파일에 남기지 않음)
cat << 'EOF' > "$TARGET_DIR/backend/src/main/resources/application.properties"
spring.application.name=__APP_NAME__-backend
server.port=8080
spring.application.version=0.0.1

# Database (PostgreSQL) - DB_URL / DB_USERNAME / DB_PASSWORD 환경변수로 주입
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/asseterpdb}
spring.datasource.username=${DB_USERNAME:}
spring.datasource.password=${DB_PASSWORD:}

# Redis
spring.data.redis.host=${REDIS_HOST:localhost}
spring.data.redis.port=${REDIS_PORT:6379}
EOF
sed -i "s|__APP_NAME__|$APP_NAME|g" "$TARGET_DIR/backend/src/main/resources/application.properties"

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

info "backend/ 설정 생성 완료"

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
TOMCAT_WEBAPPS_DIR="${TOMCAT_WEBAPPS_DIR:-/data/docker/t3600-tomcat/webapps}"

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

header "Step 1: 프론트엔드 빌드 (Ant Design UI)"
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
    header "Step 4: Tomcat webapps 복사 및 배포"
    if [[ -d "$TOMCAT_WEBAPPS_DIR" ]]; then
        # 기존 war 및 디렉터리 정리 (root 권한으로 생성된 압축 해제 디렉터리는 권한 에러 무시)
        rm -rf "$TOMCAT_WEBAPPS_DIR/__APP_NAME__" 2>/dev/null || true
        rm -f "$TOMCAT_WEBAPPS_DIR/$WAR_NAME"
        cp "$WAR_PATH" "$TOMCAT_WEBAPPS_DIR/"
        info "복사 완료: $TOMCAT_WEBAPPS_DIR/$WAR_NAME"
        echo ""
        header "🚀 Tomcat 배포 완료!"
        echo -e "  접속 URL: ${BOLD}${CYAN}http://localhost:8082/__APP_NAME__${NC}"
    else
        warn "배포 디렉토리($TOMCAT_WEBAPPS_DIR)가 존재하지 않아 복사를 건너뜁니다."
    fi
    echo ""
    echo -e "  ${CYAN}[안내]${NC}"
    echo -e "  - 로컬 직접 실행 테스트: ${BOLD}java -jar ${WAR_PATH}${NC}"
else
    echo -e "${RED}[ERROR]${NC} WAR 파일 생성에 실패했습니다: $BACKEND_DIR/build/libs"
    exit 1
fi
EOF
sed -i "s|__APP_NAME__|$APP_NAME|g" "$TARGET_DIR/deploy.sh"
chmod +x "$TARGET_DIR/deploy.sh"

# ── 7. 패키지 설치 실행 분기 ───────────────────────────────────────────────
if [[ "$INSTALL_OPT" == "1" ]]; then
    header "7. 프론트엔드 의존성(npm) 설치 진행 중..."
    cd "$TARGET_DIR/frontend"
    npm install
    info "npm install 완료!"
    if npx tsc -b --noEmit; then
        info "TypeScript 타입체크 통과"
    else
        warn "TypeScript 타입체크 실패 - 위 에러를 확인하세요."
    fi
fi

header "🎉 초기화 작업 완료!"
echo -e "생성된 프로젝트: ${BOLD}${APP_NAME}${NC}"
echo -e "  - README.md: 기술스택 표 및 프로젝트명 기입 완료"
echo -e "  - .gitignore: 백엔드/프론트엔드/IDE 통합 제외 설정 완료"
echo -e "  - 프론트엔드: ${BOLD}./fm.sh run${NC} (http://localhost:5173)"
echo -e "  - 백엔드:     ${BOLD}./bm.sh run${NC} (http://localhost:8080)"
echo -e "  - 통합 배포:  ${BOLD}./deploy.sh${NC}"
