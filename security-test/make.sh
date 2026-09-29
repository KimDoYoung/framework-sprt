#!/usr/bin/env bash
#============================================================================
# make.sh - Security-Test 프로젝트 마스터 관리 스크립트
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

info()   { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()   { echo -e "${YELLOW}[WARN]${NC}  $*"; }
header() { echo -e "\n${CYAN}${BOLD}══ $* ══${NC}\n"; }

do_init() {
    header "프로젝트 환경 점검 및 의존성 설치"
    
    info "데이터 디렉토리 생성 (${HOME}/tmp/asseterp-data/{logs,uploads})..."
    mkdir -p "${HOME}/tmp/asseterp-data/logs" "${HOME}/tmp/asseterp-data/uploads"

    info "Frontend 패키지 설치..."
    (cd "$SCRIPT_DIR/frontend" && npm install)

    info "Backend 컴파일 점검..."
    (cd "$SCRIPT_DIR/backend" && gradle compileJava)

    info "초기 설정 완료!"
}

do_db_check() {
    header "데이터베이스 (PostgreSQL app_user) 확인"
    PGPASSWORD=kalpa987! psql -h localhost -U kdy987 -d asseterpdb -c "SELECT user_id, company_id, username, password, full_name, role FROM app_user;"
}

do_build_all() {
    header "전체 빌드 (Frontend + Backend)"
    (cd "$SCRIPT_DIR/frontend" && npm run build)
    (cd "$SCRIPT_DIR/backend" && gradle compileJava)
    info "전체 빌드 완료!"
}

do_deploy() {
    "$SCRIPT_DIR/deploy.sh"
}

print_menu() {
    echo -e "${CYAN}${BOLD}[ Security-Test Master Manager (make.sh) ]${NC}"
    echo "  1) init     - 초기 의존성 설치 및 환경 설정"
    echo "  2) build    - Frontend + Backend 전체 빌드"
    echo "  3) deploy   - WAR 패키징 및 Tomcat 배포 (deploy.sh)"
    echo "  4) db       - PostgreSQL app_user 데이터 확인"
    echo "  5) be-run   - Backend Spring Boot 실행 (./bm.sh run)"
    echo "  6) fe-run   - Frontend Vite 실행 (./fm.sh run)"
    echo "  q) 종료"
    echo ""
}

main() {
    local cmd="${1:-}"
    if [[ -z "$cmd" ]]; then
        print_menu
        read -rp "명령을 선택하세요: " choice
        case "$choice" in
            1|init)    do_init ;;
            2|build)   do_build_all ;;
            3|deploy)  do_deploy ;;
            4|db)      do_db_check ;;
            5|be-run)  "$SCRIPT_DIR/bm.sh" run ;;
            6|fe-run)  "$SCRIPT_DIR/fm.sh" run ;;
            q|Q)       exit 0 ;;
            *) echo "잘못된 입력입니다."; exit 1 ;;
        esac
    else
        case "$cmd" in
            init)    do_init ;;
            build)   do_build_all ;;
            deploy)  do_deploy ;;
            db)      do_db_check ;;
            be-run)  "$SCRIPT_DIR/bm.sh" run ;;
            fe-run)  "$SCRIPT_DIR/fm.sh" run ;;
            *) echo "지원하지 않는 명령어: $cmd"; exit 1 ;;
        esac
    fi
}

main "$@"
