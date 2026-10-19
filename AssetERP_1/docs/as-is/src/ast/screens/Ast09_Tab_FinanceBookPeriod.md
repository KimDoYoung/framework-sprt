# Ast09_Tab_FinanceBookPeriod

- 종류: 화면
- 메뉴: 고유자산 > 30. 고유자산 현황 > 금융상품 보유내역(기간조회) (#1239)
- 파일: `client/vi/ast/Ast09_Tab_FinanceBookPeriod.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast09_Book.selectByHoldDatePeriod` | Ast09_Tab_FinanceBookPeriod:157 | [`Ast09_Book.java:64`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md), [`ast09_book.selectByHoldDatePeriod`](../../ast/sql/ast09_book.md), [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys12_calendar.selectPeriod`](../../sys/sql/sys12_calendar.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdFinanceBookPeriod` | Ast09_Tab_FinanceBookPeriod:171 | [`Sys99_Print.java:3628`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_sellpossibleqty`, `f_nvl`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast09_Tab_FinanceBookPeriod (`client/vi/ast/Ast09_Tab_FinanceBookPeriod.java`, 240줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회일자: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton} {downloadButton} {rdFileDownloadForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="구분/계좌"
- 그리드 `grid` (buildGrid()):
  - holdDate 100 "보유일자" Date
  - keepCorpAccountName 250 "보관처/계좌" Text
  - astClassName 150 "종목유형" Text
  - astClassTreeName 250 "종목명" Text
  - accountTypeName 120 "회계구분" Text
  - holdQty 100 "보유수량" Double
  - purAmt 150 "취득금액" Long
  - bookAmt 150 "장부금액" Long
  - acrIntAmt 100 "타인경과이자" Long
  - evalAmt 150 "평가금액" Long
  - evalPl 100 "평가손익" Long
  - oci 100 "기타포괄손익" Long
  - firstPurDate 100 "최초취득일자" Date
  - firstPurAmt 150 "최초취득금액" Long
  - lockUpPeriodName 100 "확약기간" TextCenter
  - lockUpDate 100 "매도제한일" Date
  - lockUpQty 100 "매도제한수량" Double

#### 이벤트
[E0] 화면 열림 (생성자 L50-82) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L94) → retrieve()
[E2] retrieveButton[조회].Select (L103) → retrieve()
[E3] downloadButton[엑셀다운로드].Select (L109) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L143-166 | 생성자,E1,E2 | 서비스 ast.Ast09_Book.selectByHoldDatePeriod(companyId, personId, windowClassName, startDate, closeDate, astType, searchText) | 업무 |
| private createRdExcel() | L168-222 | E3 | 서비스 sys.Sys99_Print.insertRdFinanceBookPeriod(companyId, personId, windowClassName, startDate, closeDate, astType, searchText) | 업무 |
| private getStartDate() | L224-228 | createRdExcel | 상태 처리 | 업무 |
| private getCloseDate() | L230-234 | createRdExcel | 상태 처리 | 업무 |
| private settings() | L84-115 | 생성자 | 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L117-141 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('holdDate', 100, '보유일자'),  // L122
  gb.text('keepCorpAccountNm', 250, '보관처/계좌'),  // L123 SQL 계산 컬럼(selectByHoldDate: f_get_corp_nm(ast2.ast01_corp_id) ||'('…)
  gb.text('astClassNm', 150, '종목유형'),  // L124 SQL 계산 컬럼(selectByHoldDate: f_cdnm('ItemMClassCode',ast1.ast01_item…)
  gb.text('astClassTreeNm', 250, '종목명'),  // L125 SQL 계산 컬럼(selectByHoldDate: ast1.ast01_class_tree_nm)
  gb.text('accountTypeNm', 120, '회계구분'),  // L126 SQL 계산 컬럼(selectByHoldDate: f_cdnm('AccountType' ,ast1.ast01_accoun…)
  gb.double('holdQty', 100, '보유수량'),  // L127
  gb.long('purAmt', 150, '취득금액'),  // L128
  gb.long('bookAmt', 150, '장부금액'),  // L129
  gb.long('acrIntAmt', 100, '타인경과이자'),  // L130
  gb.long('evalAmt', 150, '평가금액'),  // L131
  gb.long('evalPl', 100, '평가손익'),  // L132
  gb.long('oci', 100, '기타포괄손익'),  // L133
  gb.date('firstPurDate', 100, '최초취득일자'),  // L134
  gb.long('firstPurAmt', 150, '최초취득금액'),  // L135
  gb.textCenter('lockUpPeriodNm', 100, '확약기간'),  // L136 SQL 계산 컬럼(selectByHoldDate: f_cdnm('LockUpPeriodCode', ast09_lock_u…)
  gb.date('lockUpDate', 100, '매도제한일'),  // L137
  gb.double('lockUpQty', 100, '매도제한수량'),  // L138
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

