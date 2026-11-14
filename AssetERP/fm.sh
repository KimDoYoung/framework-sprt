#!/usr/bin/env bash
#============================================================================
# fm.sh - Frontend 관리 스크립트 (run, compile 간소화 버전)
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()   { echo -e "${GREEN}[INFO]${NC}  $*"; }
header() { echo -e "\n${CYAN}${BOLD}══ $* ══${NC}\n"; }

REQUIRED_NODE_MIN=20   # Vite 6 기준 (Node 18은 EOL)

check_node() {
    if ! command -v node &>/dev/null; then
        echo -e "${RED}[ERROR]${NC} node가 존재하지 않습니다. Node ${REQUIRED_NODE_MIN} 이상을 설치하세요."
        exit 1
    fi
    if ! command -v npm &>/dev/null; then
        echo -e "${RED}[ERROR]${NC} npm이 존재하지 않습니다."
        exit 1
    fi

    # 예: v22.23.5
    local ver major
    ver="$(node -v)"
    major="${ver#v}"
    major="${major%%.*}"

    if [[ ! "$major" =~ ^[0-9]+$ ]] || (( major < REQUIRED_NODE_MIN )); then
        echo -e "${RED}[ERROR]${NC} Node ${REQUIRED_NODE_MIN} 이상이 필요합니다. 현재: ${ver:-알 수 없음} ($(command -v node))"
        echo "        nvm 등으로 Node ${REQUIRED_NODE_MIN} 이상으로 바꾼 뒤 다시 실행하세요."
        exit 1
    fi
}

do_run() {
    header "Frontend - Vite 개발 서버 실행"
    check_node
    cd "$FRONTEND_DIR"
    npm run dev
}

do_compile() {
    header "Frontend - 빌드 및 컴파일 (TypeScript + Vite)"
    check_node
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
