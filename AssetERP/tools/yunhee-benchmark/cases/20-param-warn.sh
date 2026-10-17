ID=20 CASE_REV=1 CAT=취약 FAST=1 NEEDS="db"
DESC="[취약 036-6] analysis sql --param 에 매퍼가 모르는 이름을 주면 경고함(sch03_deadline.selectByClassTreeId, infoId ≠ classTreeId)"
chk_param_is_unknown() {   # 이 SQL 의 파라미터 목록에 infoId 가 없다 (기대 타당성)
  yunhee analysis sql sch03_deadline.selectByClassTreeId -s "$SRC" --src-index "$IDX" 2>&1 | grep -q '파라미터\*\*: classTreeId' \
    && ! yunhee analysis sql sch03_deadline.selectByClassTreeId -s "$SRC" --src-index "$IDX" 2>&1 | grep -q 'infoId'
}
case_run() {
  yh analysis sql sch03_deadline.selectByClassTreeId --param infoId=24762 --count -s "$SRC" --src-index "$IDX"
  expect "알 수 없는 파라미터 경고" '알 수 없는 파라미터'
  expect "틀린 이름을 알려 줌" 'infoId'
  expect "맞는 이름을 알려 줌" 'classTreeId'
  forbid "Traceback" 'Traceback'
  indep "infoId 는 이 SQL 의 파라미터가 아님(기대 타당성)" chk_param_is_unknown
}
