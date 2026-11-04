# SED06 ExcelDownload `biz22List` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | TOBE: `BizFeeChargeController` `GET /api/v1/biz/fee-charges/calcs/excel` → `BizFeeChargeExcelService`. **판정: 완료** |
| 2026-11-04 | 대조 | EE33에서 구현·시험: `BizFeeChargeFileDbTest`의 계산상세 엑셀 시험(병합 7·합계 = 구간일수 합)이 POI로 열어 값을 확인했고, AS-IS의 이상한 점(합계 숫자 칸 서식이 다른 스타일에 두 번 들어가 서식 없음)도 그대로 옮겼다(EE33-작업기록 5번). `GET …/calcs/excel` → HTTP 200(`.xls` 시그니처) |
| 2026-11-04 | 확인 | 미확인: AS-IS 출력과 한 칸씩 비교, ICAM 발생보수 연결 뒤 펀드 내역 블록(EE21 미완 항목) |

## 비용
엑셀·업로드 대조 묶음 세션(SED04~08·SEU). 코드 변경 없음.
