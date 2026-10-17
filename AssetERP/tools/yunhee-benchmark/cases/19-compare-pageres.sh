ID=19 CASE_REV=1 CAT=취약 FAST=1 NEEDS="db tomcat"
DESC="[취약 036-5] compare 가 PageRes({total,rows}) 응답의 rows 를 행으로 셈(/ics/laws/lookup — E03 배포본 필요)"
case_run() {
  yh compare GET /api/v1/ics/laws/lookup -p limit=50 -p offset=0 \
     --sql ics01_class_tree.selectByTypeCodePaging --param typeCode=IT --param companyId=0 \
     --param 'lawSearch=%%' --param 'statuteSearch=%%' --param advisYn=false --param detailSearchYn=false \
     --param limit=50 --param offset=0
  expect "API rows 가 SQL rows 와 같은 50" 'API rows=50, SQL rows=50'
  expect "total 을 따로 보여 줌" 'total=[0-9]+'
  forbid "래퍼 객체를 행 1개로 셈" 'API rows=1,'
  forbid "오류 출력" '\[ERROR\]|Traceback'
}
