ID=07 CASE_REV=1 CAT=DB FAST=1 NEEDS="db"
DESC="테이블 구조(sys06_menu): 컬럼 수·주석"
chk_col_count() {
  local dbn yn
  dbn=$(_dbcount "select count(*) from information_schema.columns where table_schema='public' and table_name='sys06_menu'")
  yn=$(grep -Ec '^  "[a-z0-9_]+" "' "$YH_ONLY")
  [ -n "$dbn" ] && [ "$dbn" = "$yn" ] || { echo "컬럼 수 불일치: DB=$dbn yunhee=$yn"; return 1; }
}
case_run() {
  yh table sys06_menu
  # 수작업 기준선: sys06_menu가 든 도메인 DBML 파일 전체
  base_file $(grep -l '^Table "public"."sys06_menu"' "$ROOT"/docs/as-is/db/tables/*.md 2>/dev/null)
  expect "테이블 머리" 'Table "public"."sys06_menu"'
  expect "PK 컬럼" '"sys06_menu_id" "numeric" \[pk'
  expect "한글 주석(화면안내)" "note: '화면안내'"
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "컬럼 수가 DB(information_schema)와 같음" chk_col_count
}
