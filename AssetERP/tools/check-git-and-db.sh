#!/usr/bin/env bash
#============================================================================
# tools/check-git-and-db.sh - AS-IS 원본(git)과 DB 변경을 받아 색인(소스·DB·메뉴)을 다시 만든다
#   tools/check-git-and-db.sh               pull, 소스 색인 기준과 다르면 소스 색인 재실행
#   tools/check-git-and-db.sh --src-index   변경이 없어도 소스 색인 재실행 (옛 --force)
#   tools/check-git-and-db.sh --menu-tsv    menus.tsv 다시 뽑기 (+ 소스 색인)
#   tools/check-git-and-db.sh --db-index    DB 색인(dbml → index-db) + menus.tsv + 소스 색인
#   tools/check-git-and-db.sh --all         위 셋 모두 (= --db-index)
#   tools/check-git-and-db.sh --no-index    pull만 (색인 안 함)
#   tools/check-git-and-db.sh -h | --help   도움말
# 다음 단계: 변경반영 문서(변경반영-대장) 만들기
#   tools/make-change-docs.sh   (docs/3-변경반영/README.md)
#============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # AssetERP/tools
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"                       # AssetERP
REPO_ROOT="$(cd "$APP_DIR/.." && pwd)"
cd "$APP_DIR"   # yunhee value 가 AssetERP/.env.yunhee 를 읽도록
INDEX_DIR="AssetERP/docs/as-is/src"
DB_INDEX_DIR="AssetERP/docs/as-is/db"
DBML_FILE="AssetERP/.yunhee/asseterp-dbml.md"
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
사용법: tools/check-git-and-db.sh [--src-index] [--menu-tsv] [--db-index] [--all] [--no-index] [-h|--help]

AS-IS 원본(YUNHEE_ASIS_SRC_DIR)을 git pull 하고, 옵션에 따라 DB 색인·메뉴 목록·소스 색인을 다시 만든다.
옵션이 없으면 pull 후 소스 색인 기준 커밋(_source.json)과 HEAD가 다를 때만 소스 색인을 다시 만든다.

옵션:
  --src-index   원본 변경이 없어도 소스 색인을 다시 만든다 (옛 --force도 받는다)
                  yunhee index-src -t $INDEX_DIR --menus $MENUS_TSV
  --menu-tsv    메뉴 목록을 DB(sys06_menu)에서 다시 뽑는다. 소스 색인도 다시 만든다(메뉴 → 화면 연결)
                  yunhee sql --builtin menus -o tsv --no-header --out $MENUS_TSV
  --db-index    DB 색인을 다시 만든다. 메뉴 목록·소스 색인도 함께 다시 만든다
                (소스 색인의 테이블 링크·⚠DB없음 판정이 DB 색인을 쓴다)
                  yunhee dbml $DB_ENV -o $DBML_FILE
                  yunhee index-db $DBML_FILE -t $DB_INDEX_DIR
  --all         --db-index + --menu-tsv + --src-index (DB를 복원했거나 DB가 많이 바뀌었을 때)
  --no-index    pull만 하고 색인은 하나도 만들지 않는다 (다른 색인 옵션과 같이 쓸 수 없다)
  -h, --help    이 도움말

순서: git pull → DB 색인 → menus.tsv → 소스 색인
DB는 docker localhost asseterpdb($DB_ENV, AssetERP/.env.yunhee)만 쓴다.

다음 단계 — 변경반영 문서(변경반영-대장) 만들기:
  (cd AssetERP && tools/make-change-docs.sh)
USAGE
}

SRC_INDEX=0
MENU_TSV=0
DB_INDEX=0
NO_INDEX=0
for arg in "$@"; do
    case "$arg" in
        -h|--help)            usage; exit 0 ;;
        --src-index|--force)  SRC_INDEX=1 ;;
        --menu-tsv)           MENU_TSV=1 ;;
        --db-index)           DB_INDEX=1 ;;
        --all)                DB_INDEX=1; MENU_TSV=1; SRC_INDEX=1 ;;
        --no-index)           NO_INDEX=1 ;;
        *) usage >&2; die "알 수 없는 옵션: $arg" ;;
    esac
done

# 의존: DB 색인 → 메뉴 목록 → 소스 색인
[[ "$DB_INDEX" -eq 1 ]] && MENU_TSV=1
[[ "$MENU_TSV" -eq 1 ]] && SRC_INDEX=1
if [[ "$NO_INDEX" -eq 1 && "$SRC_INDEX" -eq 1 ]]; then
    die "--no-index는 --src-index·--menu-tsv·--db-index·--all과 같이 쓸 수 없습니다"
fi

# 원본 경로: yunhee value (0.4.6~)
SRC="$(yunhee value YUNHEE_ASIS_SRC_DIR 2>/dev/null || true)"
[[ -n "$SRC" ]] || die "YUNHEE_ASIS_SRC_DIR를 yunhee value로 읽지 못했습니다"
SRC="${SRC/#\~/$HOME}"
[[ -d "$SRC/.git" ]] || die "git 저장소가 아닙니다: $SRC"

if [[ -n "$(git -C "$SRC" status --porcelain)" ]]; then
    die "원본에 로컬 변경이 있어 pull하지 않습니다: $SRC"
fi

# 1) git pull
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

if [[ "$NO_INDEX" -eq 1 ]]; then
    info "--no-index: 색인은 만들지 않습니다"
    exit 0
fi

cd "$REPO_ROOT"

# 2) DB 색인
if [[ "$DB_INDEX" -eq 1 ]]; then
    info "DB 스키마 → DBML: $DB_ENV → $DBML_FILE"
    yunhee dbml "$DB_ENV" -o "$DBML_FILE"
    info "DB 색인: $DBML_FILE → $DB_INDEX_DIR"
    yunhee index-db "$DBML_FILE" -t "$DB_INDEX_DIR"
fi

# 3) 메뉴 목록 — 임시 파일로 받고, 비어 있지 않을 때만 바꾼다
if [[ "$MENU_TSV" -eq 1 ]]; then
    tmp="$MENUS_TSV.part"
    trap 'rm -f "$REPO_ROOT/$tmp"' EXIT
    old_n=0; [[ -f "$MENUS_TSV" ]] && old_n="$(wc -l <"$MENUS_TSV")"
    info "메뉴 목록: sys06_menu → $MENUS_TSV"
    yunhee sql --builtin menus -o tsv --no-header --out "$tmp"
    [[ -s "$tmp" ]] || die "메뉴 목록이 비었습니다 — $MENUS_TSV 는 그대로 둡니다"
    mv "$tmp" "$MENUS_TSV"
    trap - EXIT
    info "메뉴 목록: ${old_n}행 → $(wc -l <"$MENUS_TSV")행"
fi

# 4) 소스 색인 — 색인 기준 커밋(_source.json)과 비교. pull만 하고 재색인 못 한 경우도 잡는다
indexed=""
if [[ -f "$INDEX_DIR/_source.json" ]]; then
    indexed="$(sed -n 's/.*"commit": *"\([0-9a-f]*\)".*/\1/p' "$INDEX_DIR/_source.json" | head -1)"
fi

if [[ "$indexed" == "$after" && "$SRC_INDEX" -eq 0 ]]; then
    info "소스 색인이 최신입니다 (${after:0:7}) — 재색인 안 함"
    exit 0
fi

info "소스 색인: 기준 ${indexed:0:7} → ${after:0:7}"
yunhee index-src -t "$INDEX_DIR" --menus "$MENUS_TSV"
info "완료. 다음: (cd AssetERP && tools/make-change-docs.sh)  — 변경반영-대장에 이어 붙임"
