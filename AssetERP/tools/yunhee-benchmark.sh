#!/usr/bin/env bash
# yunhee 가치 측정(벤치마크): ① 토큰 절감(추정) ② 정확성. 결과는 누적한다.
# 설계: docs/work/yunhee-benchmark-설계.md   시나리오: tools/yunhee-benchmark/cases/*.sh   (회귀 시험 yunhee-0.x-check.sh와 다름)
#
# 사용 (AssetERP 폴더 어디서든):
#   tools/yunhee-benchmark.sh                  # 전체 시나리오
#   tools/yunhee-benchmark.sh --fast           # FAST=1 시나리오만 (Qwen·느린 것 제외)
#   tools/yunhee-benchmark.sh 03 grid          # id/범주/이름에 포함된 시나리오만
#   tools/yunhee-benchmark.sh --list           # 시나리오 목록과 개정(rev)
#   tools/yunhee-benchmark.sh --no-save        # results.tsv·runs/ 에 쓰지 않음(시험 실행)
#   tools/yunhee-benchmark.sh --history        # 버전별 추세
#   tools/yunhee-benchmark.sh --compare 0.3.7 0.3.8   # 두 버전 비교(case_rev 같은 것만)
#   tools/yunhee-benchmark.sh --reindex        # 고정 소스 색인을 다시 만든다
# 데이터를 바꾸지 않는다(조회·EXPLAIN·롤백, 임시 폴더만).
set -uo pipefail
cd "$(dirname "$0")/.."                      # AssetERP
ROOT=$(pwd); BENCH=$ROOT/tools/yunhee-benchmark; LIB=$BENCH/lib.sh
RES=$ROOT/docs/work/yunhee-benchmark; WORK=$ROOT/.yunhee/bench
SUITE_REV=1
export ROOT LIB WORK SUITE_REV
mkdir -p "$RES/runs" "$WORK/out"

FAST=0; SAVE=1; LIST=0; HIST=0; CMP=(); REINDEX=0; SEL=()
while [ $# -gt 0 ]; do case $1 in
  --fast) FAST=1;; --no-save) SAVE=0;; --list) LIST=1;; --history) HIST=1;; --reindex) REINDEX=1;;
  --compare) CMP=("${2:?버전 둘}" "${3:?버전 둘}"); shift 2;;
  -h|--help) sed -n 2,14p "$0"; exit 0;;
  *) SEL+=("$1");; esac; shift; done

[ $HIST = 1 ] && { python3 -I "$BENCH/report.py" history "$RES/results.tsv"; exit $?; }
[ ${#CMP[@]} = 2 ] && { python3 -I "$BENCH/report.py" compare "$RES/results.tsv" "${CMP[0]}" "${CMP[1]}"; exit $?; }

shopt -s nullglob
source "$LIB"
CASES=("$BENCH"/cases/*.sh)
meta() { ( unset ID CASE_REV CAT DESC FAST NEEDS RETIRED; case_run() { :; }; source "$1"; echo "$ID|$CASE_REV|$CAT|${FAST:-0}|${NEEDS:--}|${RETIRED:--}|$DESC" ); }
if [ $LIST = 1 ]; then
  printf '%-5s %-4s %-6s %-5s %-9s %s\n' ID rev 범주 FAST NEEDS 설명
  for f in "${CASES[@]}"; do IFS='|' read -r i r c fa n rt d < <(meta "$f"); printf '%-5s %-4s %-6s %-5s %-9s %s%s\n' "$i" "$r" "$c" "$fa" "$n" "$d" "$([ "$rt" != - ] && echo " [RETIRED $rt]")"; done
  exit 0
fi

command -v yunhee >/dev/null || { echo "yunhee가 없다"; exit 2; }
VER=$(yunhee --version 2>/dev/null | awk '{print $2}'); HOST=$(hostname)
PIN=$(tr -d '[:space:]' <"$BENCH/PIN")

# ── 고정 소스 색인: 저장소 밖(~/.cache)에 둔다 — 안에 두면 yunhee가 바깥 저장소의 git 정보를 읽는다(수정사항034 후보) ──
REAL_SRC=${YUNHEE_ASIS_SRC_DIR:-$HOME/work/IDMS-IC}; WORK_IDX=$ROOT/docs/as-is/src
CACHE=$HOME/.cache/yunhee-bench/$PIN; SRC=$CACHE/src; IDX=$CACHE/index
export REAL_SRC WORK_IDX SRC IDX VER HOST PIN
if [ ! -f "$IDX/_index.json" ] || [ "$(cat "$CACHE/.version" 2>/dev/null)" != "$VER" ] || [ $REINDEX = 1 ]; then
  if [ -d "$REAL_SRC/.git" ] && git -C "$REAL_SRC" cat-file -e "$PIN^{commit}" 2>/dev/null; then
    echo "… 고정 소스 색인 만들기 (PIN ${PIN:0:7}, yunhee $VER, 약 1분) → $CACHE"
    rm -rf "$CACHE"; mkdir -p "$SRC"
    git -C "$REAL_SRC" archive "$PIN" application/src/main/java | tar -x -C "$SRC"
    margs=(); [ -f "$ROOT/docs/as-is/menus.tsv" ] && margs+=(--menus "$ROOT/docs/as-is/menus.tsv")
    [ -d "$ROOT/docs/as-is/db" ] && margs+=(--db-index "$ROOT/docs/as-is/db")
    ( cd "$ROOT/.." && yunhee index-src "$SRC" -t "$IDX" "${margs[@]}" >"$WORK/index-src.log" 2>&1 ) || { echo "❌ index-src 실패 ($WORK/index-src.log)"; exit 2; }
    echo "$VER" >"$CACHE/.version"
  else
    echo "⚠ 원본 저장소($REAL_SRC)에서 PIN ${PIN:0:7} 커밋을 찾을 수 없다 — 소스 의존 시나리오는 건너뜀"
    mkdir -p "$IDX"
  fi
fi

echo "yunhee $VER · host=$HOST · PIN=${PIN:0:7} · suite_rev=$SUITE_REV"
TS=$(date '+%Y-%m-%d %H:%M'); ROWS=$(mktemp); : >"$ROWS"
printf '%-5s %-5s %-7s %8s %7s %7s %6s %7s  %s\n' ID rev 범주 base토큰 yh토큰 비율 초 점수 비고
n_run=0
for f in "${CASES[@]}"; do
  IFS='|' read -r i r c fa n rt d < <(meta "$f")
  [ "$rt" != - ] && continue
  [ $FAST = 1 ] && [ "$fa" != 1 ] && continue
  if [ ${#SEL[@]} -gt 0 ]; then m=0; for s in "${SEL[@]}"; do [[ "$i $c $d $(basename "$f")" == *"$s"* ]] && m=1; done; [ $m = 0 ] && continue; fi
  line=$(run_case_file "$f")
  IFS=$'\t' read -r st _id _rev _cat btok ytok ratio secs llm rok rtot pok ptot score note <<<"$line"
  if [ "$st" = OK ]; then
    n_run=$((n_run+1))
    printf '%-5s %-5s %-7s %8s %7s %7s %6s %7s  %s\n' "$i" "$r" "$c" "$btok" "$ytok" "$ratio" "$secs" "$score" "$note"
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$TS" "$HOST" "$VER" "${PIN:0:7}" "$SUITE_REV" "$i" "$r" "$c" "$btok" "$ytok" "$ratio" "$secs" "$llm" "$rok" "$rtot" "$pok" "$ptot" "$score" "$note" >>"$ROWS"
  else
    printf '%-5s %-5s %-7s  %s\n' "$i" "$r" "$c" "$st $_id"
  fi
done

# ── 요약 ──
python3 -I "$BENCH/report.py" summary "$ROWS" | tee "$WORK/last-summary.txt"
if [ $SAVE = 1 ] && [ "$n_run" -gt 0 ]; then
  HDR='ts	host	yunhee	src	suite_rev	case	case_rev	cat	base_tok	yh_tok	ratio	secs	llm	r_ok	r_total	p_ok	p_total	score	note'
  [ -f "$RES/results.tsv" ] || echo "$HDR" >"$RES/results.tsv"
  cat "$ROWS" >>"$RES/results.tsv"
  python3 -I "$BENCH/report.py" run-md "$ROWS" "$VER" "$HOST" "$PIN" "$RES/results.tsv" >"$RES/runs/$(date +%Y%m%d-%H%M)-$VER.md"
  echo "→ 누적: docs/work/yunhee-benchmark/results.tsv (+${n_run}줄), runs/$(date +%Y%m%d-%H%M)-$VER.md"
fi
rm -f "$ROWS"
