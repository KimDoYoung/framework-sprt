#!/usr/bin/env bash
#============================================================================
# check-git.sh - AS-IS 원본(YUNHEE_ASIS_SRC_DIR) git pull 후 바뀌었으면 index-src 재실행
#   ./check-git.sh                  pull, 색인 기준과 다르면 재색인
#   ./check-git.sh --force          변경이 없어도 재색인
#   ./check-git.sh --no-index       pull만 (재색인 안 함)
#   ./check-git.sh --db-index[=true|false]
#                                   DB 색인(dbml → index-db)도 다시 만듦 (기본 false)
#                                   DB 색인을 다시 만들면 소스 색인도 다시 만든다
#                                   (소스 색인의 테이블 링크·⚠DB없음 판정이 DB 색인을 쓴다)
#   ./check-git.sh -h | --help      도움말
# 완료 화면 변경 점검은 변환을 모두 끝낸 뒤 따로 한다:
#   yunhee drift --all --done-only --base baseline
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INDEX_DIR="AssetERP/docs/as-is/src"
DB_INDEX_DIR="AssetERP/docs/as-is/db"
DBML_FILE=".yunhee/asseterp-dbml.md"
DB_ENV="YUNHEE_DB"
MENUS_TSV="AssetERP/docs/as-is/menus.tsv"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $*"; }
die()  { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

usage() {
    cat <<USAGE
사용법: ./check-git.sh [--force] [--no-index] [--db-index[=true|false]] [-h|--help]

AS-IS 원본(YUNHEE_ASIS_SRC_DIR)을 git pull 하고, 색인 기준 커밋과 다르면 소스 색인을 다시 만든다.

옵션:
  --force                  원본 변경이 없어도 소스 색인을 다시 만든다
  --no-index               pull만 하고 소스 색인은 다시 만들지 않는다
  --db-index[=true|false]  DB 색인도 다시 만든다 (기본 false, 값 없이 쓰면 true)
                             yunhee dbml $DB_ENV -o $DBML_FILE
                             yunhee index-db $DBML_FILE -t $DB_INDEX_DIR
                           DB 색인을 다시 만들면 소스 색인도 다시 만든다(--no-index가 아니면)
  -h, --help               이 도움말

완료 화면 변경 점검은 변환을 모두 끝낸 뒤 따로 한다:
  (cd AssetERP && yunhee drift --all --done-only --base baseline)
USAGE
}

FORCE=0
DO_INDEX=1
DB_INDEX=0
for arg in "$@"; do
    case "$arg" in
        -h|--help)  usage; exit 0 ;;
        --force)    FORCE=1 ;;
        --no-index) DO_INDEX=0 ;;
        --db-index|--db-index=true)  DB_INDEX=1 ;;
        --db-index=false)            DB_INDEX=0 ;;
        --db-index=*) die "--db-index 값은 true 또는 false: $arg" ;;
        *) usage >&2; die "알 수 없는 옵션: $arg" ;;
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

# DB 색인 (선택) — 소스 색인보다 먼저 만든다
if [[ "$DB_INDEX" -eq 1 ]]; then
    cd "$REPO_ROOT"
    info "DB 스키마 → DBML: $DB_ENV → $DBML_FILE"
    yunhee dbml "$DB_ENV" -o "$DBML_FILE"
    info "DB 색인: $DBML_FILE → $DB_INDEX_DIR"
    yunhee index-db "$DBML_FILE" -t "$DB_INDEX_DIR"
    FORCE=1   # 소스 색인이 DB 색인을 참조하므로 다시 만든다
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
    if [[ "$DB_INDEX" -eq 1 ]]; then
        warn "DB 색인은 새로 만들었지만 --no-index라 소스 색인은 그대로입니다(테이블 링크가 옛 DB 기준)"
    else
        warn "색인 기준(${indexed:0:7})이 HEAD(${after:0:7})와 다릅니다 — --no-index라 재색인하지 않았습니다"
    fi
    exit 0
fi

info "재색인: 색인 기준 ${indexed:0:7} → ${after:0:7}"
cd "$REPO_ROOT"
yunhee index-src -t "$INDEX_DIR" --menus "$MENUS_TSV"
info "완료. 변환 완료 후 일괄 점검: (cd AssetERP && yunhee drift --all --done-only --base baseline)"
