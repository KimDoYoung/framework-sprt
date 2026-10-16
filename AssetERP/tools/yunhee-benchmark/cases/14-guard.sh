ID=14 CASE_REV=1 CAT=훅 FAST=1 NEEDS=""
DESC="직접 읽기·psql 차단 훅 시험(15건)"
case_run() {
  local out ok fail
  out=$("$ROOT/../.claude/hooks/yunhee-guard.test.sh" 2>&1) || true
  ok=$(grep -c '^OK' <<<"$out"); fail=$(grep -c '^FAIL' <<<"$out")
  echo "$out" >>"$YH_ONLY"; echo "$out" >>"$YH_OUT"
  R_OK=$ok; R_TOT=$((ok+fail))
  [ "$fail" -gt 0 ] && _note_fail "훅 시험 실패 ${fail}건"
}
