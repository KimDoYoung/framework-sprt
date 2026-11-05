# SEU03 ExcelUpload `empUpload` — 작업방법

## AS-IS → TOBE
- 원본: `ExcelUpload.empUpload` L2300-2469. 호출 `Emp00_Tab_TransInfo` [엑셀업로드] `excelUpload()` L325-342 — 회사관리자(`LoginUser.getIsManager()` = `userId<0`)에게만 보이고, 파일을 고르면 바로 전송, 완료 후 `retrieve()`(결과 메시지는 화면에 안 보임).
- 처리: 첫 시트 2번째 줄부터(`rowIndex < getPhysicalNumberOfRows()`) 한 줄 = 사원 한 명. 열 0 사번 · 1 이름(공백 모두 제거) · 2 사원구분 · 3 입사일 · 4 이메일 · 5 휴대폰 · 6 직책 · 7 직위 · 8 발령구분 · 9 조직코드 · 10 회사번호 · 11 내선번호. 줄마다 `emp01_person.excelInsert` → `emp02_others.insert` → 코드 조회(`sys09_code.selectByCode2` ×4, `org00_org_info.selectByOrgCode`) → `emp03_trans.insert`(발령일=입사일) → `emp35_deduct.insert`(보험 true·기본공제 1·원천징수 100) → `emp36_add_deduct.insert`(회사 0의 AddDeductType 코드마다, 수 0).
- 메시지: 성공 "사원정보를 업로드하였습니다.", 줄 없음 "`n`행의 자료을 읽을 수 없습니다. "(원문 오타 그대로), 첫 칸 없음 "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다."
- TOBE: `POST /api/v1/emp/trans-infos/excel` (폼 항목 `excelUpload`) → `EmpTransInfoController.uploadTransInfosExcel` → `EmpTransInfoUploadService.upload`. 프론트 `empApi.uploadTransInfosExcel`, `Emp00_Tab_TransInfo.tsx`(회사관리자만 [엑셀업로드] + `FileUpdownForm`, 끝나면 재조회).

## SQL 이식
- 새로 옮긴 것: `sys09_code.selectByCode2`(코드 값만) → `EmpTransInfoMapper.selectCodeByCode2`, `org00_org_info.selectByOrgCode` → `selectOrgCodeIdByOrgCode`(조건 그대로, `LIMIT 1` 추가).
- 재사용: C01의 `selectNextId`·`insertOthers`·`insertPerson`(`excelInsert`와 같은 열 + 안 쓰는 열은 null)·`insertTrans`·`insertDeduct`·`selectAddDeductTypes`·`insertAddDeduct`(모두 AS-IS 같은 INSERT 확인됨).

## 공통 절차와 다른 점
- 단계마다 commit하던 것을 **한 트랜잭션**으로(`createTransInfo`와 같은 방침). 실패하면 이번 업로드가 통째로 취소된다.
- AS-IS가 NPE·DB 오류로 끝나던 경우를 줄 번호가 있는 메시지로 바꿨다: 입사일 읽기 실패, 사번 비었거나 중복(DB 유일 인덱스 위반이던 것), 코드·조직을 못 찾음. 나머지 처리는 같다.
- 응답은 `ApiResponse<Integer>`(등록한 사원 수) + 메시지. 화면은 AS-IS처럼 성공 메시지를 띄우지 않고 오류만 보인다(Fnd01 선례).
