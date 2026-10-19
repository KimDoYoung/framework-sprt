# Ast30_Tab_OfficeMngFeeStatePeriod

- 종류: 화면
- 메뉴: 관리회계 > 30. 사무보수관리 > 보수원장(기간조회) (#1249)
- 파일: `client/vi/ast/Ast30_Tab_OfficeMngFeeStatePeriod.java`
- 함께 쓰는 클래스 1개:
  - `Ast30_Lookup_FeeDetail` `client/vi/ast/Ast30_Lookup_FeeDetail.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast30_BookFundFee.selectByCorpId` | Ast30_Tab_OfficeMngFeeStatePeriod:220 | [`Ast30_BookFundFee.java:48`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByCorpId`](../../ast/sql/ast30_book_fund_fee.md) |
| `ast.Ast30_BookFundFee.selectByHoldDatePaging` | Ast30_Tab_OfficeMngFeeStatePeriod:75 | [`Ast30_BookFundFee.java:42`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByHoldDatePaging`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.selectByHoldDatePagingTotal`](../../ast/sql/ast30_book_fund_fee.md) |
| `icam.Icam10_Fee.selectByFundCode` | Ast30_Lookup_FeeDetail:128 | [`Icam10_Fee.java:35`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.selectByFundCode`](../../icam/sql/icam10_fee.md) |

## 테이블

[`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_calc_dual_fund_fee`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast30_Tab_OfficeMngFeeStatePeriod (`client/vi/ast/Ast30_Tab_OfficeMngFeeStatePeriod.java`, 235줄)

- 레이아웃: north=buttonBar, center=vlcGrid, south=fundGrid
- 툴바 `buttonBar`: 조회일자: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="운용사/펀드", `lookupRmk` Ast30_Lookup_FeeDetail
- 그리드 `grid` (buildGrid()):
  - holdDate 100 "일자" Date
  - corpCode 80 "운용사코드" TextCenter
  - corpName 200 "운용사명" Text
  - diffFee 150 "증감액" Long
  - fee 150 "당일잔액" Long
  - unRcvFee 150 "유보금액" Long
  - tyFee 150 "당기보수" Long
  - fixFee 150 "전기보수" Long
- 그리드 `fundGrid` (fundBuildGrid()):
  - fundCode 80 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - curCode 50 "통화" TextCenter
  - diffFee 120 "증감액(KRW)" Long
  - fee 120 "당일잔액(KRW)" Long
  - unRcvFee 120 "유보금액(KRW)" Long
  - tyFee 120 "당기보수(KRW)" Long
  - fixFee 120 "전기보수(KRW)" Long
  - forDiffFee 120 "증감액(통화)" Double
  - forFee 120 "당일잔액(통화)" Double
  - forUnRcvFee 120 "유보금액(통화)" Double
  - calcStartDate 100 "보수계산시작일" Date
  - calcCloseDate 100 "보수계산종료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L52-96) → setting(), retrieve()
[E1] searchText.KeyPress [Enter] (L111) → retrieve()
[E2] grid.RowClick [model != null] (L120) → retrieveFund()
[E3] fundGrid.RowDoubleClick [model != null] (L130) → 인라인 L130-139 (new RowDoubleClickHandler() { @Overri…)
[E4] retrieveButton[조회].Select (L141) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L98-147 | 생성자 | 조회창 Ast30_Lookup_FeeDetail 열기 | 업무 |
| private fundBuildGrid() | L163-180 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L182-208 | 생성자,E1,E4 | 상태 처리 | 업무 |
| private retrieveFund() | L210-229 | E2,retrieve | 서비스 ast.Ast30_BookFundFee.selectByCorpId(companyId, holdDate, searchText, corpId) | 업무 |
| private buildGrid() | L149-161 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L231-233 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('holdDate', 100, '일자'),  // L151
  gb.textCenter('corpCd', 80, '운용사코드'),  // L152 SQL 계산 컬럼(selectByHoldDatePaging: sys15_corp_cd)
  gb.text('corpNm', 200, '운용사명'),  // L153 SQL 계산 컬럼(selectByHoldDatePaging: sys15_corp_nm)
  gb.long('diffFee', 150, '증감액'),  // L154 SQL 계산 컬럼(selectByHoldDatePaging: SUM(ast30_diff_fee))
  gb.long('fee', 150, '당일잔액'),  // L155
  gb.long('unRcvFee', 150, '유보금액'),  // L156
  gb.long('tyFee', 150, '당기보수'),  // L157 SQL 계산 컬럼(selectByHoldDatePaging: SUM(ast30_fee - ast30_fix_fee))
  gb.long('fixFee', 150, '전기보수'),  // L158
];

const fundBuildGrid = () => [
  gb.textCenter('fundCd', 80, '펀드코드'),  // L165
  gb.text('fundNm', 400, '펀드명'),  // L166
  gb.textCenter('curCd', 50, '통화'),  // L167
  gb.long('diffFee', 120, '증감액(KRW)'),  // L168 SQL 계산 컬럼(selectByHoldDatePaging: SUM(ast30_diff_fee))
  gb.long('fee', 120, '당일잔액(KRW)'),  // L169
  gb.long('unRcvFee', 120, '유보금액(KRW)'),  // L170
  gb.long('tyFee', 120, '당기보수(KRW)'),  // L171 SQL 계산 컬럼(selectByHoldDatePaging: SUM(ast30_fee - ast30_fix_fee))
  gb.long('fixFee', 120, '전기보수(KRW)'),  // L172
  gb.double('forDiffFee', 120, '증감액(통화)'),  // L173 SQL 계산 컬럼(selectByCorpId: CASE WHEN ast30_cur_cd = 'KRW' THEN nul…)
  gb.double('forFee', 120, '당일잔액(통화)'),  // L174
  gb.double('forUnRcvFee', 120, '유보금액(통화)'),  // L175
  gb.date('calcStartDate', 100, '보수계산시작일'),  // L176
  gb.date('calcCloseDate', 100, '보수계산종료일'),  // L177
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

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

