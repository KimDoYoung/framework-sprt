# Ast30_Tab_OfficeMngFeeState

- 종류: 화면
- 메뉴: 관리회계 > 30. 사무보수관리 > 보수원장 (#1201)
- 파일: `client/vi/ast/Ast30_Tab_OfficeMngFeeState.java`
- 함께 쓰는 클래스 1개:
  - `Ast30_Lookup_FeeDetail` `client/vi/ast/Ast30_Lookup_FeeDetail.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast30_BookFundFee.selectByCompanyId` | Ast30_Tab_OfficeMngFeeState:169 | [`Ast30_BookFundFee.java:36`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByCompanyId`](../../ast/sql/ast30_book_fund_fee.md) |
| `ast.Ast30_BookFundFee.selectByCorpId` | Ast30_Tab_OfficeMngFeeState:192 | [`Ast30_BookFundFee.java:48`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByCorpId`](../../ast/sql/ast30_book_fund_fee.md) |
| `icam.Icam10_Fee.selectByFundCode` | Ast30_Lookup_FeeDetail:128 | [`Icam10_Fee.java:35`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.selectByFundCode`](../../icam/sql/icam10_fee.md) |

## 테이블

[`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_calc_dual_fund_fee`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast30_Tab_OfficeMngFeeState (`client/vi/ast/Ast30_Tab_OfficeMngFeeState.java`, 207줄)

- 레이아웃: north=buttonBar, west=grid, center=fundGrid
- 툴바 `buttonBar`: 기준일자: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="운용사/펀드", `lookupRmk` Ast30_Lookup_FeeDetail
- 그리드 `grid` (buildGrid()):
  - corpCode 80 "운용사코드" TextCenter
  - corpName 200 "운용사명" Text
  - diffFee 100 "증감액" Long
  - fee 100 "당일잔액" Long
  - unRcvFee 100 "유보금액" Long
  - tyFee 100 "당기보수" Long
  - fixFee 100 "전기보수" Long
- 그리드 `fundGrid` (fundBuildGrid()):
  - fundCode 80 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - curCode 50 "통화" TextCenter
  - diffFee 100 "증감액(KRW)" Long
  - fee 100 "당일잔액(KRW)" Long
  - unRcvFee 100 "유보금액(KRW)" Long
  - tyFee 100 "당기보수(KRW)" Long
  - fixFee 100 "전기보수(KRW)" Long
  - forDiffFee 100 "증감액(통화)" Double
  - forFee 100 "당일잔액(통화)" Double
  - forUnRcvFee 100 "유보금액(통화)" Double

#### 이벤트
[E0] 화면 열림 (생성자 L45-80) → setting(), retrieve()
[E1] searchText.KeyPress [Enter] (L92) → retrieve()
[E2] grid.RowClick [model != null] (L101) → retrieveFund()
[E3] fundGrid.RowDoubleClick [model != null] (L111) → 인라인 L111-120 (new RowDoubleClickHandler() { @Overri…)
[E4] retrieveButton[조회].Select (L122) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L82-128 | 생성자 | 조회창 Ast30_Lookup_FeeDetail 열기 | 업무 |
| private fundBuildGrid() | L143-158 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L160-180 | 생성자,E1,E4 | 서비스 ast.Ast30_BookFundFee.selectByCompanyId(companyId, holdDate, searchText) | 업무 |
| private retrieveFund() | L182-201 | E2,retrieve | 서비스 ast.Ast30_BookFundFee.selectByCorpId(companyId, holdDate, searchText, corpId) | 업무 |
| private buildGrid() | L130-141 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L203-205 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpCd', 80, '운용사코드'),  // L132 SQL 계산 컬럼(selectByCompanyId: sys15_corp_cd)
  gb.text('corpNm', 200, '운용사명'),  // L133 SQL 계산 컬럼(selectByCompanyId: sys15_corp_nm)
  gb.long('diffFee', 100, '증감액'),  // L134 SQL 계산 컬럼(selectByCompanyId: SUM(ast30_diff_fee))
  gb.long('fee', 100, '당일잔액'),  // L135
  gb.long('unRcvFee', 100, '유보금액'),  // L136
  gb.long('tyFee', 100, '당기보수'),  // L137 SQL 계산 컬럼(selectByCompanyId: SUM(ast30_fee - ast30_fix_fee))
  gb.long('fixFee', 100, '전기보수'),  // L138
];

const fundBuildGrid = () => [
  gb.textCenter('fundCd', 80, '펀드코드'),  // L145
  gb.text('fundNm', 400, '펀드명'),  // L146
  gb.textCenter('curCd', 50, '통화'),  // L147
  gb.long('diffFee', 100, '증감액(KRW)'),  // L148 SQL 계산 컬럼(selectByCompanyId: SUM(ast30_diff_fee))
  gb.long('fee', 100, '당일잔액(KRW)'),  // L149
  gb.long('unRcvFee', 100, '유보금액(KRW)'),  // L150
  gb.long('tyFee', 100, '당기보수(KRW)'),  // L151 SQL 계산 컬럼(selectByCompanyId: SUM(ast30_fee - ast30_fix_fee))
  gb.long('fixFee', 100, '전기보수(KRW)'),  // L152
  gb.double('forDiffFee', 100, '증감액(통화)'),  // L153 SQL 계산 컬럼(selectByCorpId: CASE WHEN ast30_cur_cd = 'KRW' THEN nul…)
  gb.double('forFee', 100, '당일잔액(통화)'),  // L154
  gb.double('forUnRcvFee', 100, '유보금액(통화)'),  // L155
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

