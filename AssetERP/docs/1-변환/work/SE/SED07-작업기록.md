# SED07 ExcelDownload `ast06FinanceList` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | TOBE: `AstTrFinanceController` `GET …/finance-excel` → `AstTrFinanceService.downloadFinanceExcel`. **판정: 완료** |
| 2026-11-04 | 대조 | 원본 L1832-2077과 TOBE 코드를 줄 단위로 대조: 머리글 15열 이름·폭(3000·7000·9000·4000·8000·4000·4000·4000·3000·3000·4000·3000·6000·9000·2000)·연노랑 머리글·얇은 테두리, 정수 서식 열 {5,7,8,9,10}, 소수 서식 열 6(`###,###,##0.#0`), 미수/미지급 Y/N, null은 0·빈칸, 고정 조건 `assetType 1·abroType 1·payCode %·windowClassName Ast06_Tab_TrFinance·corpId null`, 파일명 `금융상품거래처리(시작 ~ 끝)` 모두 같다(.xls→.xlsx) |
| 2026-11-04 | 확인 | `GET …/finance-excel`(2025-01-01~2026-12-31) → HTTP 200. `Ast06_Tab_TrForFinance`(W07)도 같은 API를 쓴다(원본도 같은 액션, 이상한점 #123). 미확인: 셀 값 비교 |

## 비용
엑셀·업로드 대조 묶음 세션(SED04~08·SEU). 코드 변경 없음.
