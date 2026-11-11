#!/usr/bin/env bash
#============================================================================
# tools/make-change-docs.sh - check-git.sh 다음에 돌려 변경반영 문서(반영대장)를 만든다
#   tools/check-git.sh                 AS-IS 받아오기 + 색인
#   tools/make-change-docs.sh          바뀐 것을 SQL ID·메서드 단위로 나눠 반영대장에 이어 붙임
#   tools/make-change-docs.sh --dry-run    대장에 쓰지 않고 새로 붙을 줄만 보여 줌
#   tools/make-change-docs.sh --reuse      drift를 다시 돌리지 않고 지난 결과(.yunhee/drift-today.json) 사용
#   tools/make-change-docs.sh --since 2026-10-16   새 파일·DB 스크립트를 찾을 시작일
#   tools/make-change-docs.sh -h | --help
# 규칙·상태는 docs/3-변경반영/README.md. 처리한 줄(반영·해당없음·보류·넘김)은 건드리지 않는다.
# yunhee drift-unit / drift-list(수정사항054)가 생기면 그 명령으로 바꾼다.
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # AssetERP/tools
cd "$SCRIPT_DIR/.."                                         # AssetERP — 아래 경로는 여기 기준
DRIFT_JSON=".yunhee/drift-today.json"
LEDGER="docs/3-변경반영/반영대장.md"

RED='\033[0;31m'; GREEN='\033[0;32m'; NC='\033[0m'
info() { echo -e "${GREEN}[INFO]${NC}  $*"; }
die()  { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

usage() {
    cat <<USAGE
사용법: tools/make-change-docs.sh [--dry-run] [--reuse] [--since YYYY-MM-DD] [-h|--help]

check-git.sh 다음에 돌린다. 완료 화면(기준선) 이후 AS-IS 변경을 SQL ID·메서드 단위로 나눠
${LEDGER} 에 '대기'로 이어 붙인다.

옵션:
  --dry-run       대장에 쓰지 않고 새로 붙을 줄만 보여 줌
  --reuse         drift를 다시 돌리지 않고 ${DRIFT_JSON} 사용
  --since DATE    새 파일·DB 스크립트를 찾을 시작일 (기본: 기준선의 가장 이른 기록일)
  -h, --help      이 도움말
USAGE
}

DRY=(); REUSE=false; SINCE=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run) DRY=(--dry-run) ;;
        --reuse)   REUSE=true ;;
        --since)   [[ $# -ge 2 ]] || die "--since 에 날짜가 필요합니다"; SINCE=(--since "$2"); shift ;;
        -h|--help) usage; exit 0 ;;
        *) die "모르는 옵션: $1 (--help)" ;;
    esac
    shift
done

[[ -f "$LEDGER" ]] || die "대장이 없습니다: $LEDGER"
command -v yunhee >/dev/null || die "yunhee 가 없습니다"

# AS-IS 원본 위치: yunhee value YUNHEE_ASIS_SRC_DIR (check-git.sh 와 같음)
SRC="${YUNHEE_ASIS_SRC_DIR:-$(yunhee value YUNHEE_ASIS_SRC_DIR 2>/dev/null || true)}"
export YUNHEE_ASIS_SRC_DIR="${SRC/#\~/$HOME}"
[[ -n "$SRC" && -d "$YUNHEE_ASIS_SRC_DIR/.git" ]] || die "AS-IS 원본(YUNHEE_ASIS_SRC_DIR)을 찾지 못했습니다: ${YUNHEE_ASIS_SRC_DIR:-}"

if [[ "$REUSE" == false || ! -f "$DRIFT_JSON" ]]; then
    info "완료 화면 변경 감지 (yunhee drift --all --done-only --base baseline) …"
    mkdir -p .yunhee
    yunhee drift --all --done-only --base baseline --ignore-space -o json > "$DRIFT_JSON" 2>/dev/null \
        || die "yunhee drift 실패"
fi

info "단위 나누기·화면 찾기·대장 반영 …"
python3 -I tools/make_change_docs.py "$DRIFT_JSON" "${DRY[@]}" "${SINCE[@]}"
if [[ ${#DRY[@]} -eq 0 ]]; then
    info "대장: $LEDGER  (대기 건수: $(grep -cE '^\| CH-.*\| 대기 \|' "$LEDGER"))"
fi
