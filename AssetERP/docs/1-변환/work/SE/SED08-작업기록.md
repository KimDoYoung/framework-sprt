# SED08 ExcelDownload `ast06IpoList` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | TOBE: `AstTrFinanceController` `GET …/ipo-excel` → `AstTrFinanceService.downloadIpoExcel`. **판정: 완료** |
| 2026-11-04 | 대조 | 원본 L2079-2318과 TOBE를 줄 단위로 대조: 14열(일자·거래유형·거래처·종목유형·종목·거래수량·거래단가·거래금액·수수료·결제금액·확약기간·예금계좌·적요·등록자) 이름·폭 같음, 정수 서식 열 {5,7,8,9}, 소수 서식 열 6, 고정 조건은 `windowClassName Ast06_Tab_TrIPO`만 SED07과 다르고 나머지 같음, 파일명 `공모주청약(시작 ~ 끝)`. .xls→.xlsx |
| 2026-11-04 | 확인 | `GET …/ipo-excel` → HTTP 200. 미확인: 셀 값 비교 |

## 비용
엑셀·업로드 대조 묶음 세션(SED04~08·SEU). 코드 변경 없음.
