ID=18 CASE_REV=1 CAT=취약 FAST=1 NEEDS=""
DESC="[취약 036-4] analysis model 이 *01·*02 별칭 getter 를 별칭으로 표시함(Sch03_DeadlineModel)"
chk_src_alias() {
  local f; f=$(find "$SRC" -name 'Sch03_DeadlineModel.java' -print -quit)
  [ -n "$f" ] && grep -q 'dayWeekName01 = this.dayWeekName' "$f"
}
case_run() {
  yh analysis model Sch03_DeadlineModel -s "$SRC" --src-index "$IDX"
  base_file "$(find "$SRC" -name 'Sch03_DeadlineModel.java' -print -quit)"
  expect "기본 속성은 나옴(현재 통과)" 'dayWeekName '
  expect "dayWeekName01 이 별칭으로 표시" 'dayWeekName01[^\n]*(별칭|alias)'
  expect "별칭 대상 dayWeekName" 'dayWeekName01[^\n]*dayWeekName[^0-9]'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "소스 getter 가 this.dayWeekName 을 돌려줌(기대 타당성)" chk_src_alias
}
