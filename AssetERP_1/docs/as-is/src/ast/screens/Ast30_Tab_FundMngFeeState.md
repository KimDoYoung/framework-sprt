# Ast30_Tab_FundMngFeeState

- 종류: 화면
- 메뉴: 관리회계 > 30. 펀드운용보수관리 > 펀드보수원장 (#1216)
- 파일: `client/vi/ast/Ast30_Tab_FundMngFeeState.java`
- 함께 쓰는 클래스 1개:
  - `Ast30_Lookup_FeeDetail` `client/vi/ast/Ast30_Lookup_FeeDetail.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Icam10_Lookup_FundCode`](../../icam/components/Icam10_Lookup_FundCode.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast30_BookFundFee.selectFundFeeBook` | Ast30_Tab_FundMngFeeState:236 | [`Ast30_BookFundFee.java:54`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectFundFeeBook`](../../ast/sql/ast30_book_fund_fee.md) |
| `icam.Icam10_Fee.selectByFundCode` | Ast30_Lookup_FeeDetail:128 | [`Icam10_Fee.java:35`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.selectByFundCode`](../../icam/sql/icam10_fee.md) |
| `sys.Sys99_Print.insertRdFundMngFeeState` | Ast30_Tab_FundMngFeeState:170 | [`Sys99_Print.java:1997`](../../sys/services/Sys99_Print.md) | [`ast30_book_fund_fee.selectFundFeeBook`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_calc_dual_fund_fee`, `f_nvl`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast30_Tab_FundMngFeeState (`client/vi/ast/Ast30_Tab_FundMngFeeState.java`, 251줄)

- 레이아웃: north=buttonBar, center=grid
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 펀드: {fundName} 검색: {searchText} {retrieveButton} {downloadButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="펀드", `fundCode` TextField, `fundName` LookupTriggerField 빈칸="전체", `lookupFund` Icam10_Lookup_FundCode, `lookupRmk` Ast30_Lookup_FeeDetail
- 그리드 `grid` (buildGrid()):
  - holdDate 100 "보유일자" Date
  - fundCode 80 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - preFee 120 "전일잔액" Long
  - diffFee 120 "증감액" Long
  - fee 120 "당일잔액" Long
  - monthOccFee 120 "당월 발생액" Long
  - occFee 120 "당일 발생액" Long
  - drawFee 120 "당일 인출액" Long
  - unRcvFee 120 "유보분" Long

#### 이벤트
[E0] 화면 열림 (생성자 L61-97) → setting(), retrieve()
[E1] fundName.TriggerClick [result != null] (L112) → 인라인 L112-130 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L134) → retrieve()
[E3] grid.RowDoubleClick [model != null] (L143) → 인라인 L143-152 (new RowDoubleClickHandler() { @Overri…)
[E4] retrieveButton[조회].Select (L154) → retrieve()
[E5] downloadButton[출력/다운로드].Select [result.getStatus() == 1] (L160) → 서비스 sys.Sys99_Print.insertRdFundMngFeeState(companyId, personId, windowClassName, startDate, closeDate, fundCode, searchText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L99-206 | 생성자 | 조회창 Icam10_Lookup_FundCode 열기 → 콜백: unmask, 조회창 Ast30_Lookup_FeeDetail 열기 → 콜백: unmask, 미선택 시 alert, 서비스 sys.Sys99_Print.insertRdFundMngFeeState(companyId, personId, windowClassName, startDate, closeDate, fundCode, searchText) | 업무 |
| public retrieve() | L226-245 | 생성자,E2,E4 | 서비스 ast.Ast30_BookFundFee.selectFundFeeBook(companyId, startDate, closeDate, fundCode, searchText) | 업무 |
| private buildGrid() | L208-224 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L247-249 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('holdDate', 100, '보유일자'),  // L210
  gb.textCenter('fundCd', 80, '펀드코드'),  // L211
  gb.text('fundNm', 400, '펀드명'),  // L212
  gb.long('preFee', 120, '전일잔액'),  // L213 SQL 계산 컬럼(selectFundFeeBook: COALESCE(t2.ast30_fee,0))
  gb.long('diffFee', 120, '증감액'),  // L214 SQL 계산 컬럼(selectFundFeeBook: COALESCE(icam10_diff_fee,0))
  gb.long('fee', 120, '당일잔액'),  // L215
  gb.long('monthOccFee', 120, '당월 발생액'),  // L216 SQL 계산 컬럼(selectFundFeeBook: ( SELECT SUM(a.ast30_fee_today) FROM as…)
  gb.long('occFee', 120, '당일 발생액'),  // L217 SQL 계산 컬럼(selectFundFeeBook: COALESCE(icam10_occ_fee,0))
  gb.long('drawFee', 120, '당일 인출액'),  // L218 SQL 계산 컬럼(selectFundFeeBook: COALESCE(icam10_draw_fee,0))
  gb.long('unRcvFee', 120, '유보분'),  // L219
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdFundMngFeeState(companyId, personId, windowClassName, startDate, closeDate, fundCode, searchText) */}>출력/다운로드</Button>

### Ast30_Lookup_FeeDetail (`client/vi/ast/Ast30_Lookup_FeeDetail.java`, 144줄)

- 툴바 `buttonBar`: {label} {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="적요"
- 그리드 `grid` (buildGrid()):
  - rmkCode 50 "적요코드" TextCenter
  - rmkName 200 "적요명" Text
  - curCode 50 "통화" TextCenter
  - fee 120 "펀드보수" Double

#### 이벤트
[E0] 화면 열림 (생성자 L57-73) → show()
[E1] searchText.KeyPress [Enter] (L78) → retrieve()
[E2] cancleButton[닫기].Select (L91) → hide()
[E3] retrieveButton[조회].Select (L97) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L47-55 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L75-103 | open | 상태 처리 | 업무 |
| public retrieve() | L117-134 | E1,E3,open | 서비스 icam.Icam10_Fee.selectByFundCode(companyId, corpId, fundCode, stdDate, searchText) | 업무 |
| public buildGrid() | L105-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L136-138 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L140-142 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('rmkCd', 50, '적요코드'),  // L109
  gb.text('rmkNm', 200, '적요명'),  // L110
  gb.textCenter('curCd', 50, '통화'),  // L111
  gb.double('fee', 120, '펀드보수'),  // L112
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

