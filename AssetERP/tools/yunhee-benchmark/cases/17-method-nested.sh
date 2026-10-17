ID=17 CASE_REV=1 CAT=취약 FAST=1 NEEDS=""
DESC="[취약 036-3] analysis method 요약이 핸들러 안의 조회창 열기와 문자열 인자를 보여 줌(Ics10_Edit_Checklist.settings)"
chk_src_has_open() {
  local f; f=$(find "$SRC" -name 'Ics10_Edit_Checklist.java' -print -quit)
  [ -n "$f" ] && grep -q 'lookup.open("deadline"' "$f"
}
case_run() {
  yh analysis method Ics10_Edit_Checklist.settings -s "$SRC" --src-index "$IDX"
  base_file "$(find "$SRC" -name 'Ics10_Edit_Checklist.java' -print -quit)"
  expect "서비스 호출은 나옴(현재 통과)" 'sch\.Sch05_RelateIcs\.modelUpdate'
  expect "조회창 클래스" 'Ics01_Lookup_SelectMulti'
  expect "조회창 인자 \"deadline\"" '"deadline"'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "소스에 lookup.open(\"deadline\" 이 있음(기대 타당성)" chk_src_has_open
}
