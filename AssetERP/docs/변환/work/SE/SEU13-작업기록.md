# SEU13 ExcelUpload `fltBookInitUpload` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분석 | 원본 `fltBookInitUpload` L2621-2761. 호출은 `Flt13_Lookup_BookInit`(최초원장 등록 창) [엑셀업로드] `excelUpload()` L597-616 하나뿐(`companyId`·`personId`=로그인 사원·`stdDate`=창의 기준일). 열 0 계좌번호(지수 표기면 `BigDecimal.toPlainString`) · 1 종목명 · 2 종목유형(`5.0`→`5`) · 3 종목코드 · 4 보유수량(Double) · 5 보유금액(Long). 줄마다: `flt03_account.selectByAccountNo`(본인 계좌, `TO_DECRYPTS(계좌번호) LIKE`)가 **정확히 1건일 때만** 처리 → `flt05_item_type.selectByItemType`(기준일 유효) → 시세 종목유형(`stk_price_yn`)이면 종목코드 12자리 필수 → `flt13_book_init.excelInsert` → `flt11_book.insertByFlt13`(기준일+1일 아님, 초기원장 행으로 보유원장 생성) → DB 함수 `f_insert_floorTrBook`(`flt10_tr.insertFloorTrBook`, 기준일+1일~오늘 보유원장 생성) 결과가 `'Y'`가 아니면 그 메시지로 중단 |
| 2026-11-04 | 확인 | TOBE에 **호출 화면 `Flt13_Lookup_BookInit`이 없다**(`work/I/I01·I02-결과확인`에 "다음 단계", 8버튼·18이벤트·그리드 1). 업로드가 쓰는 5개 SQL 중 `flt13_book_init`·`flt11_book.insertByFlt13`·`f_insert_floorTrBook` 호출은 TOBE 매퍼에 없고, 창의 사전 검사(`checkPreTr`: 기준일 이전 거래 `flt10_tr.countByTrDate`·정기보고 상신문서 검사, L618-)와 `flt13_book_init.delete`도 아직 없다 |
| 2026-11-04 | 결정 | **구현을 미루고 상태를 `대기`(화면 선행)로 둔다.** 이 업로드는 창의 사전 검사·기준일·삭제와 한 묶음으로 동작하고, 화면 없이 API만 만들면 호출처가 없는 코드가 되며 보유원장을 만드는 DB 함수를 화면 없이 확인하기 어렵다. I 시리즈 2단계(`Flt13_Lookup_BookInit`)를 변환할 때 이 분기를 같이 만든다(이 기록을 그 ID 분석 입력으로 쓴다). 사용자가 API만 먼저 원하면 알려 달라 |
| 2026-11-04 | 메모(구현할 때) | ① 계좌번호는 암호화 컬럼이라 `TO_DECRYPTS(...)` 비교(`flt03_account.selectByAccountNo`는 `LIKE`) ② 계좌가 0건·2건 이상이면 AS-IS는 조용히 그 줄을 건너뛴다(오류 메시지 없음) ③ 종목코드 12자리 오류는 `setResult` 없이 `response.getWriter().write`로 바로 쓰고 끝낸다(앞 줄은 commit 전이라 버려짐) ④ 종목유형 정보가 없으면 `itemTypeModel`이 null이라 NPE ⑤ `insertByFlt13`의 `TRUNC(amt/qty)`는 수량 0이면 0 나눗셈 오류 ⑥ 한 줄마다 `f_insert_floorTrBook`을 부르고 마지막에만 commit(TOBE는 한 트랜잭션이라 같음) |

## 비용
묶음 세션(SEU03 참고). 코드 변경 없음.
