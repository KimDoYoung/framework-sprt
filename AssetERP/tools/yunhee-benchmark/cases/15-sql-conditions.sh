ID=15 CASE_REV=1 CAT=취약 FAST=1 NEEDS=""
DESC="[취약 036-1] SQL 펼치기(-o sql)가 <choose>/<if> 안의 조건을 보존함(ics10_checklist.selectByAdmin)"
chk_xml_has_cond() {   # 소스 XML에는 대분류·중분류 조건이 실제로 있다 (기대가 맞는지 확인)
  local xml; xml=$(find "$SRC" -path '*mapper/ics10_checklist.xml' -print -quit)
  [ -n "$xml" ] && grep -q 'ics21_checklist_l_class_id = #{checklistLClassId}' "$xml" && grep -q 'ics23_checklist_m_class_id = #{checklistMClassId}' "$xml"
}
case_run() {
  yh analysis sql ics10_checklist.selectByAdmin -o sql -s "$SRC" --src-index "$IDX"
  base_file "$(find "$SRC" -path '*mapper/ics10_checklist.xml' -print -quit)"
  # 조건 블록의 파라미터 이름(checklistLClassId·checklistMClassId)이 출력에 남아야 한다. 중분류 칼럼 비교(ics23_… = ics10_…)는 CTE 조인에도 있어 판별이 안 된다
  expect "대분류 조건(checklistLClassId)이 출력에 있음" 'checklistLClassId'
  expect "중분류 조건(checklistMClassId)이 출력에 있음" 'checklistMClassId'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "소스 XML에 그 조건이 있음(기대 타당성)" chk_xml_has_cond
}
