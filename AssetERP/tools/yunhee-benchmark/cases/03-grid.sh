ID=03 CASE_REV=1 CAT=분석 FAST=1 NEEDS=""
DESC="그리드 모양(Sys27_Tab_LoginManage): 컬럼 순서·제목·폭"
# 소스에 그 제목 글자가 있는지(환각 컬럼이 없는지) — 화면 의존 파일 전체에서 찾는다
chk_titles_in_source() {
  local t f ok bad=0
  while read -r t; do
    ok=0
    for f in $(screen_deps Sys27_Tab_LoginManage); do
      grep -qF "\"$t\"" "$SRC/$f" 2>/dev/null && { ok=1; break; }
    done
    [ $ok = 1 ] || { echo "제목이 소스에 없음: $t"; bad=1; }
  done < <(awk -F'|' '/^\| [0-9]+ \|/{t=$5; gsub(/^ +| +$/,"",t); if(t!="No"&&t!="선택")print t}' "$YH_ONLY")
  return $bad
}
case_run() {
  yh analysis grid Sys27_Tab_LoginManage -s "$SRC" --src-index "$IDX"
  base_screen Sys27_Tab_LoginManage
  expect "그리드 유형" '유형: `MultiGrid`'
  expect "행번호·체크 포함 10컬럼(0~9)" '^\| 9 \|'
  expect "신청일 컬럼 위치·폭" '^\| 2 \| openDateString \| 200 \| 신청일 '
  expect "Mac 주소 컬럼 폭 250" '^\| 6 \| macAddress \| 250 \| Mac 주소 '
  expect "승인여부는 체크박스" '^\| 8 \| confirmYn \| 50 \| 승인여부 \| addBoolean'
  forbid "오류 출력" '\[ERROR\]|Traceback|오류:'
  indep "모든 제목이 소스에 있음" chk_titles_in_source
}
