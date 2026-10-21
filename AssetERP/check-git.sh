#!/usr/bin/env bash
#============================================================================
# check-git.sh - AS-IS 원본(YUNHEE_ASIS_SRC_DIR) git pull 후 바뀌었으면 index-src 재실행
#   ./check-git.sh             pull, 색인 기준과 다르면 재색인
#   ./check-git.sh --force     변경이 없어도 재색인
#   ./check-git.sh --no-index  pull만 (재색인 안 함)
# 완료 화면 변경 점검은 변환을 모두 끝낸 뒤 따로 한다:
#   yunhee drift --all --done-only --base baseline
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INDEX_DIR="AssetERP/docs/as-is/src"
MENUS_TSV="AssetERP/docs/as-is/menus.tsv"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $*"; }
die()  { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

FORCE=0
DO_INDEX=1
for arg in "$@"; do
    case "$arg" in
        --force)    FORCE=1 ;;
        --no-index) DO_INDEX=0 ;;
        *) die "알 수 없는 옵션: $arg (--force, --no-index)" ;;
    esac
done

# 원본 경로: yunhee value (0.4.6~)
SRC="$(yunhee value YUNHEE_ASIS_SRC_DIR 2>/dev/null || true)"
[[ -n "$SRC" ]] || die "YUNHEE_ASIS_SRC_DIR를 yunhee value로 읽지 못했습니다"
SRC="${SRC/#\~/$HOME}"
[[ -d "$SRC/.git" ]] || die "git 저장소가 아닙니다: $SRC"

if [[ -n "$(git -C "$SRC" status --porcelain)" ]]; then
    die "원본에 로컬 변경이 있어 pull하지 않습니다: $SRC"
fi

before="$(git -C "$SRC" rev-parse HEAD)"
info "pull: $SRC ($(git -C "$SRC" rev-parse --abbrev-ref HEAD))"
git -C "$SRC" pull --ff-only --quiet
after="$(git -C "$SRC" rev-parse HEAD)"

if [[ "$before" == "$after" ]]; then
    info "원본 변경 없음 (${after:0:7})"
else
    info "원본 변경: ${before:0:7} → ${after:0:7}"
    git -C "$SRC" diff --shortstat "$before" "$after"
fi

# 색인 기준 커밋(_source.json)과 비교 — pull만 하고 재색인 못 한 경우도 잡는다
indexed=""
if [[ -f "$REPO_ROOT/$INDEX_DIR/_source.json" ]]; then
    indexed="$(sed -n 's/.*"commit": *"\([0-9a-f]*\)".*/\1/p' "$REPO_ROOT/$INDEX_DIR/_source.json" | head -1)"
fi

if [[ "$indexed" == "$after" && "$FORCE" -eq 0 ]]; then
    info "색인이 최신입니다 (${after:0:7}) — 재색인 안 함"
    exit 0
fi

if [[ "$DO_INDEX" -eq 0 ]]; then
    warn "색인 기준(${indexed:0:7})이 HEAD(${after:0:7})와 다릅니다 — --no-index라 재색인하지 않았습니다"
    exit 0
fi

info "재색인: 색인 기준 ${indexed:0:7} → ${after:0:7}"
cd "$REPO_ROOT"
yunhee index-src -t "$INDEX_DIR" --menus "$MENUS_TSV"
info "완료. 변환 완료 후 일괄 점검: (cd AssetERP && yunhee drift --all --done-only --base baseline)"
