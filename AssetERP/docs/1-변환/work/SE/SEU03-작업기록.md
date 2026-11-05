# SEU03 ExcelUpload `empUpload` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분석 | `yunhee cat ExcelUpload.java:2300-2469·1168·1298`, `Emp00_Tab_TransInfo.java:196-250·325-342`, `analysis sql`로 6개 SQL. TOBE에는 [엑셀업로드]가 "2단계"로 빠져 있었다 → 신규 구현 |
| 2026-11-04 | 구현 | `EmpTransInfoUploadService`(신규), `EmpTransInfoMapper`+XML(`selectCodeByCode2`·`selectOrgCodeIdByOrgCode`), 컨트롤러 `POST /trans-infos/excel`, 프론트 API·버튼 |
| 2026-11-04 | 확인 | compile·`tsc -b` 통과. `EmpTransInfoUploadDbTest` 3개 통과(asseterpdb 28000사, `@MybatisTest` 롤백): ① 두 명 업로드 → emp01(이름 공백 제거·숫자 사번)·emp02·emp03(발령 100·구분 10·직위 650·직책 250·발령일=입사일)·emp35(1/100) 확인 ② 없는 코드(XX)·없는 조직·중복 사번 → 줄 번호 메시지, 앞줄도 취소 ③ 일반 사용자 거부. 시험 뒤 `ZZ-*`·`990001` 행 0개(롤백 확인) |
| 2026-11-04 | 미확인 | 화면에서 실제 파일 올리기(변환 중 브라우저 시험 안 함, `userId<0` 계정은 회사관리자). `.xls`(HSSF)·날짜 셀 형식은 `WorkbookFactory`가 처리하나 시험은 `.xlsx` 문자열 날짜만. 배포 후 `yunhee api POST /trans-infos/excel`(파일 없이)은 라우트가 잡혀 400으로 응답했고, 실제 파일 업로드는 사원 행이 남아 하지 않았다 |
| 2026-11-04 | 원본-이상한점 | ① 단계마다 commit해 도중 실패 시 앞 사원·앞 단계 행이 남는다(첫 사원은 person만 있고 trans·deduct 없을 수도) ② 코드·조직을 못 찾으면 NPE ③ 이름 `null`이면 `"%"`를 넣으려는 죽은 코드(`replaceAll` 뒤라 도달 불가) ④ `getPhysicalNumberOfRows()`를 마지막 줄 번호처럼 써서 중간에 빈 줄이 있으면 뒤 줄을 놓친다(TOBE도 같게 둠) ⑤ 사번 중복 검사가 없다 ⑥ 응답 메시지가 화면에 안 보인다 |
| 2026-11-04 | 제안 | 업로드 템플릿(열 순서)을 화면에서 받을 수 있게 하면 좋다. 원본도 [템플릿]을 툴바에서 뺐다(L94 주석)라 하지 않았다 |

## 비용
묶음 세션(SEU03·08·13, 시작 비용 공유). 빌드·시험: compile 2/0, tsc 2/0, test 3개(처음 1개 실패 — 시험 데이터 코드 '99'가 실제 코드였음, 'XX'로 고침).
