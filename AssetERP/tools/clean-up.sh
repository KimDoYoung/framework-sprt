#!/usr/bin/env bash
#============================================================================
# clean-up.sh - 쌓인 작업 산출물 지우기
#
# 위치: AssetERP/tools/clean-up.sh (어디서 실행해도 AssetERP 기준 경로를 쓴다)
#
#   --backup-db       data/backup/db 의 *.dump 파일을 모두 지운다
#   --screen-capture  .yunhee/screen-capture 하위를 모두 지운다(폴더는 남김)
#   --all             위 둘 다
#   -y, --yes         확인 없이 지운다
#   -h, --help        도움말
#============================================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DB_DIR="$ROOT/data/backup/db"
CAPTURE_DIR="$ROOT/.yunhee/screen-capture"

usage() {
    sed -n '4,11p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

do_db=0
do_cap=0
yes=0

[[ $# -eq 0 ]] && { usage; exit 1; }
for arg in "$@"; do
    case "$arg" in
        --backup-db)      do_db=1 ;;
        --screen-capture) do_cap=1 ;;
        --all)            do_db=1; do_cap=1 ;;
        -y|--yes)         yes=1 ;;
        -h|--help)        usage; exit 0 ;;
        *) echo "알 수 없는 옵션: $arg" >&2; usage; exit 1 ;;
    esac
done
(( do_db || do_cap )) || { echo "지울 대상을 고르세요(--backup-db / --screen-capture / --all)" >&2; exit 1; }

confirm() {
    (( yes )) && return 0
    read -r -p "$1 [y/N] " ans
    [[ "$ans" == [yY]* ]]
}

if (( do_db )); then
    if [[ -d "$BACKUP_DB_DIR" ]]; then
        mapfile -t dumps < <(find "$BACKUP_DB_DIR" -maxdepth 1 -type f -name '*.dump')
        if (( ${#dumps[@]} == 0 )); then
            echo "[backup-db] 지울 dump 없음: $BACKUP_DB_DIR"
        else
            echo "[backup-db] ${#dumps[@]}개 ($(du -ch "${dumps[@]}" | tail -1 | cut -f1)):"
            printf '  %s\n' "${dumps[@]##*/}"
            if confirm "[backup-db] 지울까요?"; then
                rm -f -- "${dumps[@]}"
                echo "[backup-db] 지움"
            else
                echo "[backup-db] 건너뜀"
            fi
        fi
    else
        echo "[backup-db] 폴더 없음: $BACKUP_DB_DIR"
    fi
fi

if (( do_cap )); then
    if [[ -d "$CAPTURE_DIR" ]]; then
        count=$(find "$CAPTURE_DIR" -mindepth 1 -maxdepth 1 | wc -l)
        if (( count == 0 )); then
            echo "[screen-capture] 지울 것 없음: $CAPTURE_DIR"
        else
            echo "[screen-capture] 항목 ${count}개 ($(du -sh "$CAPTURE_DIR" | cut -f1)): $CAPTURE_DIR"
            if confirm "[screen-capture] 지울까요?"; then
                find "$CAPTURE_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
                echo "[screen-capture] 지움"
            else
                echo "[screen-capture] 건너뜀"
            fi
        fi
    else
        echo "[screen-capture] 폴더 없음: $CAPTURE_DIR"
    fi
fi
