# SED01 ExcelDownload `empList` — 작업방법

## AS-IS → TOBE
- 원본: `ExcelDownload.getEmpList` L76-248. 호출 화면 `Emp00_Tab_TransInfo`(C01) [다운로드] `excelDownload()` L297-323 → `ExcelDownload?actionCode=empList&companyId&findText&transDate&transCode`. 툴바에서 관리자 제한 없음(엑셀업로드만 관리자).
- 처리: `emp00_trans_info.selectByText`(isSeparateAddTitle=true, 검색어 `%…%`) 결과를 시트 `sheet1`에. 머리글 16열(본부(부서)·성명·사번·등기임원·직위·직책·사원구분·전문인력·입사일·퇴사일·계약만료일·내선번호·휴대폰·이메일·생년월일·성별), 폭 7000/3000/…/2000, 얇은 테두리·세로 가운데·줄바꿈. 파일 `사원정보.xls`.
- 값: 등기임원 true→"임원", 전문인력 true→"✓", 날짜는 `yyyy-MM-dd`, null은 빈칸.
- TOBE: `GET /api/v1/emp/trans-infos/excel?transDate&searchText&transCode` (`EmpTransInfoController.excelTransInfos` → `EmpTransInfoService.downloadExcel` → `EmpTransInfoExcelWriter`). 조회는 화면 [조회]와 같은 `searchTransInfos(separateAddTitle=true)`. 회사는 로그인 사용자 것(AS-IS는 요청 `companyId` — 로그인 회사와 같은 값).
- 프론트: `empApi.downloadTransInfosExcel`, `Emp00_Tab_TransInfo.tsx`의 [다운로드](전엔 비활성 "2단계").

## SQL 이식
없음(화면 변환 C01에서 옮긴 `selectByText` 재사용).

## 공통 절차와 다른 점
- `.xls` → `.xlsx`(W06·X17 선례). 파일명 `사원정보.xlsx`.
- AS-IS는 입사일이 null이면 서버 오류(NPE)로 실패하지만 TOBE는 빈칸으로 둔다(사원 입사일은 필수 입력이라 실제론 안 생김).
