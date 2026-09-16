#!/usr/bin/env bash
#============================================================================
# deploy.sh - 프론트엔드 빌드 산출물을 백엔드 static으로 통합 및 WAR 배포 패키징
#============================================================================
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
STATIC_DIR="$BACKEND_DIR/src/main/resources/static"
TOMCAT_WEBAPPS_DIR="/data/docker/t3600-tomcat/webapps"

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
        info "WAR 파일을 $TOMCAT_WEBAPPS_DIR 에 복사합니다..."
        rm -rf "$TOMCAT_WEBAPPS_DIR/antdesign" "$TOMCAT_WEBAPPS_DIR/$WAR_NAME"
        cp "$WAR_PATH" "$TOMCAT_WEBAPPS_DIR/"
        info "복사 완료: $TOMCAT_WEBAPPS_DIR/$WAR_NAME"
        echo ""
        header "🚀 Tomcat 배포 완료!"
        echo -e "  접속 URL: ${BOLD}${CYAN}http://localhost:8082/antdesign${NC}"
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
