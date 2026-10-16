ID=06 CASE_REV=1 CAT=SQL FAST=1 NEEDS="db"
DESC="AS-IS SQL 펼치기(sys27_login_manage.selectByText): 파라미터·테이블·줄 위치"
chk_tables_exist() {
  local t bad=0 n
  for t in $(sed -n 's/^- \*\*테이블\*\*: //p' "$YH_ONLY" | tr -d ','); do
    n=$(_dbcount "select count(*) from information_schema.tables where table_schema='public' and table_name='$t'")
    [ "$n" = 1 ] || { echo "DB에 없는 테이블: $t"; bad=1; }
  done
  return $bad
}
chk_statement_line() {   # "(…xml:64)" 의 64번째 줄에 statement id가 있다
  local xml ln
  xml=$(find "$SRC" -path '*mapper/sys27_login_manage.xml' -print -quit)
  ln=$(sed -n 's/.*sys27_login_manage\.xml:\([0-9]*\)).*/\1/p' "$YH_ONLY" | head -1)
  [ -n "$xml" ] && [ -n "$ln" ] && sed -n "${ln}p" "$xml" | grep -q 'selectByText'
}
case_run() {
  yh analysis sql sys27_login_manage.selectByText -s "$SRC" --src-index "$IDX"
  base_file "$(find "$SRC" -path '*mapper/sys27_login_manage.xml' -print -quit)"
  expect "파라미터" '파라미터\*\*: companyId, personId'
  expect "테이블" '테이블\*\*: sys27_login_manage, sys01_company'
  expect "ORDER BY" 'sys27_open_date, sys27_place_cd, sys27_mac_address'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "테이블이 DB에 실제 있음" chk_tables_exist
  indep "statement 줄 번호가 매퍼 XML과 맞음" chk_statement_line
}
