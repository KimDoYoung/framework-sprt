#!/usr/bin/env bash
# yunhee-benchmark 공용 함수. cases/*.sh 가 source 한 뒤 쓴다. 설계: docs/work/yunhee-benchmark-설계.md
#
# 시나리오(cases/NN-*.sh)가 정의하는 것
#   ID=01a CASE_REV=1 CAT=분석 DESC="…" FAST=1 NEEDS=""      # NEEDS: db | realsrc | tomcat (없으면 SKIP)
#   case_run()  — 아래 함수로 명령 실행·기준선·채점을 한다
# 쓰는 함수
#   yh <yunhee 인자…>           yunhee 실행. 출력은 $YH_OUT에 쌓이고 시간이 합산된다 (yunhee 명령에만 쓴다)
#   yh_llm                      이 시나리오가 Qwen을 부른다고 표시
#   base_file <경로…>           수작업 기준선: yunhee 없이 읽었을 파일(전체)
#   base_screen <화면>          화면의 클래스 목록 + 의존 파일(색인 source 절)을 기준선에 넣는다
#   expect <이름> <정규식>      출력에 있어야 함 (재현율)
#   forbid <이름> <정규식>      출력에 있으면 안 됨 (정밀도)
#   indep  <이름> <명령…>       yunhee와 다른 경로로 센 값과 맞는지 (명령이 0이면 통과, 정밀도)
#   skip <사유>                 시나리오를 건너뜀(점수에서 뺌)

# 토큰 추정: ascii/4 + 비ascii(한글 등)/1.5. 파일 인자 또는 stdin. 절대값이 아니라 같은 식으로 잰 버전 간 비교용.
tokest() {
  python3 -I -c '
import sys
n=0.0
def add(b):
    global n
    s=b.decode("utf-8","replace")
    a=sum(1 for c in s if ord(c)<128)
    n+=a/4+(len(s)-a)/1.5
if len(sys.argv)>1:
    for p in sys.argv[1:]:
        try: add(open(p,"rb").read())
        except OSError: pass
else:
    add(sys.stdin.buffer.read())
print(int(n+0.5))' "$@"
}

_now() { date +%s.%N; }
_secs() { awk -v a="$1" -v b="$2" 'BEGIN{printf "%.2f", b-a}'; }

yh() {
  local t0 t1 tmp; tmp=$(mktemp)
  t0=$(_now); yunhee "$@" >"$tmp" 2>&1; _RC=$?; t1=$(_now)
  SECS=$(awk -v s="${SECS:-0}" -v d="$(_secs "$t0" "$t1")" 'BEGIN{printf "%.2f", s+d}')
  { echo "\$ yunhee $*"; cat "$tmp"; echo; } >>"$YH_OUT"
  cat "$tmp" >>"$YH_ONLY"   # 토큰 계산은 명령 줄 없이 출력만
  rm -f "$tmp"; return 0
}
yh_llm() { LLM=1; }

base_file() { local f; for f in "$@"; do if [ -f "$f" ]; then echo "$f" >>"$BASE_LIST"; else echo "⚠ 기준선 파일 없음: $f" >>"$YH_OUT"; fi; done; }

# 화면의 클래스(--list 표 첫 열) → 소스에서 파일 찾기, + 색인 source 절의 의존 파일(경로 기준)
screen_classes() { yunhee analysis screen "$1" --list --src-index "$IDX" 2>/dev/null | awk -F'|' '/^\| /&&$2!~/클래스|:---|합계/{gsub(/^ +| +$/,"",$2); sub(/ \(.*/,"",$2); print $2}' ; }
screen_deps() { yunhee analysis screen "$1" --section source --src-index "$IDX" 2>/dev/null | sed -n 's/^- `\([^`]*\)`:.*/\1/p'; }
base_screen() {
  local s=$1 c f
  for c in $(screen_classes "$s"); do
    f=$(find "$SRC" -name "$c.java" -print -quit 2>/dev/null); [ -n "$f" ] && echo "$f" >>"$BASE_LIST"
  done
  for f in $(screen_deps "$s"); do [ -f "$SRC/$f" ] && echo "$SRC/$f" >>"$BASE_LIST"; done
}

_note_fail() { NOTES="${NOTES:+$NOTES; }$1"; }
expect() { R_TOT=$((R_TOT+1)); if grep -Eq -- "$2" "$YH_ONLY"; then R_OK=$((R_OK+1)); else _note_fail "없음:$1"; fi; }
forbid() { P_TOT=$((P_TOT+1)); if grep -Eq -- "$2" "$YH_ONLY"; then _note_fail "금지:$1"; else P_OK=$((P_OK+1)); fi; }
indep()  { local name=$1; shift; P_TOT=$((P_TOT+1)); if "$@" >>"$YH_OUT" 2>&1; then P_OK=$((P_OK+1)); else _note_fail "독립:$name"; fi; }
skip()   { echo "SKIP	$1" >"$RESULT"; exit 0; }

# ── 시나리오 공용 검사 (독립 계산: yunhee 출력이 아니라 소스·DB에서 직접 센다) ──
_java() { find "$SRC" -name "$1.java" -print -quit 2>/dev/null; }
# $YH_ONLY의 "클래스 | 줄 수 | 버튼 …" 표 행: "클래스<TAB>버튼"
_list_rows() { awk -F'|' '/^\| /&&$2!~/클래스|:---|합계/{c=$2; b=$4; gsub(/^ +| +$/,"",c); sub(/ \(.*/,"",c); gsub(/ /,"",b); print c"\t"b}' "$YH_ONLY"; }
chk_classes_exist() { local c b f bad=0; while IFS=$'\t' read -r c b; do f=$(_java "$c"); [ -n "$f" ] || { echo "소스에 없음: $c"; bad=1; }; done < <(_list_rows); return $bad; }
# 버튼 수 ≥ 소스의 `new ColorButtonBar(` 직접 생성 수 (누락 확인).
# 등호로 비교하지 않는다: 부모 클래스·헬퍼가 만드는 버튼을 yunhee가 더 세므로 소스 직접 생성 수는 하한일 뿐이다(2026-10-17 시험에서 확인).
chk_button_counts() {
  local c b f n bad=0
  while IFS=$'\t' read -r c b; do
    f=$(_java "$c"); [ -n "$f" ] || continue
    n=$(grep -c 'new ColorButtonBar(' "$f")
    [ "$b" -ge "$n" ] || { echo "버튼 누락 의심 $c: yunhee=$b < 소스 직접 생성=$n"; bad=1; }
  done < <(_list_rows)
  return $bad
}
check_screen_list() {
  local s=$1
  yh analysis screen "$s" --list --src-index "$IDX"
  base_screen "$s"
  expect "클래스 목록 머리" '클래스 목록 \([0-9]+개\)'
  expect "화면 자신 행" "\\| $s \\|"
  expect "합계 행" '\*\*합계\*\*'
  forbid "오류 출력" '\[ERROR\]|Traceback|오류:'
  indep "목록의 모든 클래스가 소스에 있음" chk_classes_exist
  indep "버튼 수가 소스 직접 생성(new ColorButtonBar) 수 이상(누락 없음)" chk_button_counts
}
# yunhee sql 한 줄 결과의 count 값
_dbcount() { yunhee sql "$1" 2>/dev/null | sed -n 's/.*count=\([0-9]*\).*/\1/p' | head -1; }

# 시나리오 한 개를 하위 셸에서 실행하고 결과 한 줄을 $RESULT에 쓴다
run_case_file() {
  local file=$1 id tmp
  tmp=$(mktemp -d)
  (
    unset ID CASE_REV CAT DESC FAST NEEDS; case_run() { :; }
    source "$file"
    export ID CASE_REV CAT DESC
    YH_OUT=$tmp/out.txt; YH_ONLY=$tmp/only.txt; BASE_LIST=$tmp/base.txt; RESULT=$tmp/result
    : >"$YH_OUT"; : >"$YH_ONLY"; : >"$BASE_LIST"
    SECS=0; LLM=0; R_OK=0; R_TOT=0; P_OK=0; P_TOT=0; NOTES=""
    case "${NEEDS:-}" in
      *db*)      yunhee sql "select 1" >/dev/null 2>&1 || skip "DB 접속 안 됨" ;;&
      *realsrc*) [ -d "$REAL_SRC/.git" ] && [ -f "$WORK_IDX/_source.json" ] || skip "원본 git 저장소·작업 색인 없음" ;;&
      *tomcat*)  yunhee api GET /api/v1/sys/menus >/dev/null 2>&1 || skip "Tomcat 배포본 응답 없음" ;;
    esac
    case_run
    sort -u "$BASE_LIST" -o "$BASE_LIST"
    local base_tok=0 yh_tok ratio=- score=-
    # shellcheck disable=SC2046  # 경로에 공백 없음(소스·저장소 경로)
    [ -s "$BASE_LIST" ] && base_tok=$(tokest $(cat "$BASE_LIST"))
    yh_tok=$(tokest <"$YH_ONLY")
    [ "$base_tok" -gt 0 ] && ratio=$(awk -v y="$yh_tok" -v b="$base_tok" 'BEGIN{printf "%.4f", y/b}')
    local tot=$((R_TOT+P_TOT)); [ "$tot" -gt 0 ] && score=$(awk -v o=$((R_OK+P_OK)) -v t="$tot" 'BEGIN{printf "%.4f", o/t}')
    printf 'OK\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
      "$ID" "$CASE_REV" "$CAT" "$base_tok" "$yh_tok" "$ratio" "$SECS" "$LLM" "$R_OK" "$R_TOT" "$P_OK" "$P_TOT" "$score" "$NOTES" >"$RESULT"
    cp "$YH_OUT" "$WORK/out/$ID.txt"
  )
  if [ -f "$tmp/result" ]; then cat "$tmp/result"; else echo "FAIL	시나리오가 결과를 쓰지 못함($file)"; fi
  rm -rf "$tmp"
}
