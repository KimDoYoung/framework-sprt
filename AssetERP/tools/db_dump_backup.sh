#!/usr/bin/env bash
# db_dump_backup: 로컬 asseterpdb 를 pg_dump(custom 형식)로 통째로 백업한다. 쓰기 시험·대량 변경 전에 받아 둔다.
# 사용: ./tools/db_dump_backup.sh [옵션]   (AssetERP 폴더 어디서든 됨)
#   (옵션 없음)      AssetERP/data/backup/db/asseterpdb-<YYYYMMDD-HHMMSS>.dump 로 저장. 폴더가 없으면 만든다
#   --out <folder>   저장 폴더 지정(없으면 만든다). 파일 이름은 그대로 asseterpdb-<YYYYMMDD-HHMMSS>.dump
#   --list           저장 폴더의 백업 목록만 보여 주고 끝낸다
#   -h, --help       이 도움말
# 환경변수(기본값): DB_CONTAINER=omen_postgres  DB_USER=kdy987  DB_NAME=asseterpdb
# 받은 뒤 pg_restore -l 로 덤프가 읽히는지 확인한다. 중간에 실패하면 반쪽 파일을 남기지 않는다.
# 복원(되돌리기): 백엔드(8080)를 끈 뒤 아래를 실행한다. 접속이 남아 있으면 막힌다.
#   docker exec -i omen_postgres pg_restore -U kdy987 -d asseterpdb --clean --if-exists --no-owner < <덤프 파일>
# data/backup/ 은 .gitignore 대상이다(커밋하지 않는다).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTAINER="${DB_CONTAINER:-omen_postgres}"
DBUSER="${DB_USER:-kdy987}"
DBNAME="${DB_NAME:-asseterpdb}"
OUT="$ROOT/data/backup/db"
LIST=0

while [[ $# -gt 0 ]]; do
    case "$1" in
        --out)
            [[ $# -ge 2 && -n "$2" ]] || { echo "[ERROR] --out 에는 폴더가 필요합니다." >&2; exit 2; }
            OUT="$2"; shift ;;
        --list) LIST=1 ;;
        -h|--help) sed -n '2,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "모르는 옵션: $1 (--help)" >&2; exit 2 ;;
    esac
    shift
done

if [[ $LIST == 1 ]]; then
    ls -lh "$OUT"/${DBNAME}-*.dump 2>/dev/null || echo "백업이 없습니다: $OUT"
    exit 0
fi

command -v docker >/dev/null || { echo "[ERROR] docker 가 없습니다." >&2; exit 1; }
docker ps --format '{{.Names}}' | grep -qx "$CONTAINER" || { echo "[ERROR] 컨테이너 $CONTAINER 가 실행 중이 아닙니다." >&2; exit 1; }

mkdir -p "$OUT"
STAMP="$(date +%Y%m%d-%H%M%S)"
FILE="$OUT/${DBNAME}-${STAMP}.dump"
TMP="$FILE.part"
trap 'rm -f "$TMP"' EXIT

echo "==> 백업: $DBNAME ($CONTAINER) → $FILE"
docker exec "$CONTAINER" pg_dump -U "$DBUSER" -Fc "$DBNAME" >"$TMP"
[[ -s "$TMP" ]] || { echo "[ERROR] 덤프가 비었습니다." >&2; exit 1; }

# 덤프가 읽히는지(목차) 확인
N="$(docker exec -i "$CONTAINER" pg_restore -l <"$TMP" | grep -vc '^;' || true)"
[[ "$N" -gt 0 ]] || { echo "[ERROR] 덤프를 읽을 수 없습니다(목차 0)." >&2; exit 1; }

mv "$TMP" "$FILE"
trap - EXIT
echo "==> 완료: $(du -h "$FILE" | cut -f1), 객체 ${N}개"
echo "    복원: docker exec -i $CONTAINER pg_restore -U $DBUSER -d $DBNAME --clean --if-exists --no-owner < $FILE"
