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
