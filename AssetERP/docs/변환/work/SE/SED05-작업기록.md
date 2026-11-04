# SED05 ExcelDownload `biz01List` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | TOBE: `BizLimitCheckController` `GET /api/v1/biz/limit-checks/excel?yearText&provideRcvType` → `BizLimitCheckService.downloadExcel`. **판정: 완료** |
| 2026-11-04 | 대조 | L07에서 대조: HSSF(.xls) 유지, 시트 3개 "0_인별 1회 초과건"·"1_인별 연간 초과건"·"2_회사별 연간 초과건"(`BizLimitCheckService` L96·111·121에서 문구 확인), 제목 회색·굵은 테두리·금액 `#,##0`. AS-IS가 받는 `overCheck`·`limitCheck`·`limit1~3`·`personId`는 SQL에서 안 쓰거나 주석 처리돼(L07 작업기록 ①, 2025.08.19 "무조건 회사한도 초과건만") TOBE는 받지 않는다 |
| 2026-11-04 | 확인 | `yunhee api GET …/excel?yearText=2025` → HTTP 200, 응답 머리가 `.xls`(OLE) 시그니처. 미확인: 셀 값 한 칸씩 비교 |

## 비용
엑셀·업로드 대조 묶음 세션(SED04~08·SEU). 코드 변경 없음.
