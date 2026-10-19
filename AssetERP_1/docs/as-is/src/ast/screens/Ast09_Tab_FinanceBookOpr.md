# Ast09_Tab_FinanceBookOpr

- 종류: 화면
- 메뉴: 고유자산 > 30. 고유자산 현황 > 금융상품 운용내역 (#1300)
- 파일: `client/vi/ast/Ast09_Tab_FinanceBookOpr.java`
- 함께 쓰는 클래스 1개:
  - `Ast06_TabPage_FinanceBookOpr` `client/vi/ast/Ast06_TabPage_FinanceBookOpr.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast06_Tr.selectByAstClassTreeId` | Ast06_TabPage_FinanceBookOpr:170 | [`Ast06_Tr.java:38`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByAstClassTreeId`](../../ast/sql/ast06_tr.md) |
| `ast.Ast09_Book.selectFinanceByHoldDate` | Ast09_Tab_FinanceBookOpr:397 | [`Ast09_Book.java:46`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectFinanceByHoldDate`](../../ast/sql/ast09_book.md) |
| `ast.Ast09_Book.selectInvestAssetLimit` | Ast09_Tab_FinanceBookOpr:385 | [`Ast09_Book.java:154`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectInvestAssetLimit`](../../ast/sql/ast09_book.md) |
| `ast.Ast40_OwnerCapital.selectByMaxDate` | Ast09_Tab_FinanceBookOpr:360 | [`Ast40_OwnerCapital.java:24`](../../ast/services/Ast40_OwnerCapital.md) | [`ast40_owner_capital.selectByMaxDate`](../../ast/sql/ast40_owner_capital.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Ast09_Tab_FinanceBookOpr:241 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdFinanceBookOpr1` | Ast09_Tab_FinanceBookOpr:415 | [`Sys99_Print.java:2684`](../../sys/services/Sys99_Print.md) | [`ast09_book.selectInvestAssetLimit`](../../ast/sql/ast09_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdFinanceBookOpr2` | Ast09_Tab_FinanceBookOpr:439 | [`Sys99_Print.java:2726`](../../sys/services/Sys99_Print.md) | [`ast06_tr.selectByAstClassTreeId`](../../ast/sql/ast06_tr.md), [`ast09_book.selectFinanceByHoldDate`](../../ast/sql/ast09_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md), [`sys99_print.selectByCnt`](../../sys/sql/sys99_print.md), [`sys99_print.updateBuy`](../../sys/sql/sys99_print.md), [`sys99_print.updateSell`](../../sys/sql/sys99_print.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast40_owner_capital`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_last_day`, `f_get_sellpossibleqty`, `f_nvl`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast09_Tab_FinanceBookOpr (`client/vi/ast/Ast09_Tab_FinanceBookOpr.java`, 530줄)

- 레이아웃: north=vlcButton, center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate} {holdYnCheckBox} {radio01} {radio02} {radio03} {radio04} (: {startDate} ~: {closeDate} ): {retrieveButton} {rdButton}
- 툴바 `buttonBar2`: 종목유형: {investAssetTypeComboBox} 검색: {searchText}
- 입력·하위 화면: `amt` LongField, `tabPage` Ast06_TabPage_FinanceBookOpr, `stdDate` MyDateField, `searchText` TextField 빈칸="보관계좌/종목유형/종목명", `holdYnCheckBox` CheckBox, `radio01` Radio, `radio02` Radio, `radio03` Radio, `radio04` Radio, `startDate` MyDateField, `closeDate` MyDateField, `investAssetTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체")
- 그리드 `grid1` (buildGrid1(), 행번호숨김):
  - investAssetTypeName 200 "보유자산" Text
  - limitRate 150 "투자한도(%)" Double
  - limitAmt 200 "투자한도액" Long
  - evalAmt 200 "투자금액" Long
  - purAmt 200 "매입원가" Long
  - capitalRatio 200 "자기자본대비(%)" Double
- 그리드 `grid2` (buildGrid2(), 행번호숨김):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - keepAccountName 150 "보관계좌" TextFrozen 편집:"left"
  - astClassName 130 "종목유형" TextFrozen 편집:"left"
  - astClassTreeName 250 "종목명" TextFrozen 편집:"left"
  - firstPurDate 100 "최초취득일" Date
  - holdQty 100 "보유수량" Double
  - purAmt 100 "취득금액" Long
  - bookAmt 100 "장부금액" Long
  - purPrice 80 "취득단가" Double
  - evalPrice 80 "평가단가" Double
  - evalAmt 100 "평가금액" Long
  - evalPl 100 "당기분" Long
  - purEvalPl 100 "취득대비" Long
  - tyPlRate 80 "당기분" Double
  - purPlRate 80 "취득대비" Double
  - stopLossNotice 100 "StopLoss<br>(취득가대비)" StopLoss
  - sellPossibleDate 100 "매도가능일" Date
  - holdPeriod 115 "보유기간" TextRight

#### 이벤트
[E0] 화면 열림 (생성자 L96-156) → settings()
[E1] holdYnCheckBox[미보유 포함].ValueChange [holdYnCheckBox.getValue()] (L170) → 인라인 L170-195 (new ValueChangeHandler<Boolean>() { @…)
[E2] toggle.ValueChange [radio04.getValue()] (L219) → 인라인 L219-234 (new ValueChangeHandler<HasValue<Boole…)
[E3] investAssetTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L250) → retrieve()
[E4] searchText.KeyPress [Enter] (L265) → retrieve()
[E5] retrieveButton[조회].Select (L273) → retrieve()
[E6] rdButton[출력/다운로드].Select (L279) → createPrint()
[E7] grid2.RowClick (L285) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L293-306 | E7,retrieve | 상태 처리 | 업무 |
| public buildGrid1() | L308-320 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid2() | L322-348 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L350-407 | E3,E4,E5,settings | 서비스 ast.Ast40_OwnerCapital.selectByMaxDate, ast.Ast09_Book.selectInvestAssetLimit, ast.Ast09_Book.selectFinanceByHoldDate(companyId, holdDate, holdDate, companyId, companyId, holdDate, searchText, investAssetType, sortType, holdYn, periodType, startDate, closeDate) | 업무 |
| private createPrint() | L409-486 | E6 | 서비스 sys.Sys99_Print.insertRdFinanceBookOpr1, sys.Sys99_Print.insertRdFinanceBookOpr2(companyId, personId, windowClassName, holdDate, companyId, personId, windowClassName, holdDate, searchText, investAssetType, sortType, holdYn, periodType, startDate, closeDate) | 업무 |
| private getPeriodType() | L488-508 | retrieve,createPrint | 상태 처리 | 업무 |
| private settings() | L158-291 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: stdDate=LoginUser.getToday(, holdYnCheckBox=false("미보유 포함"), radio01=false("1개월전"), radio02=false("3개월전"), radio03=false("1년전"), radio04=false("기간지정"), toggle=null, startDate=null, closeDate=null, radio01=false("1개월전"), radio02=false("3개월전"), radio03=false("1년전"), radio04=false("기간지정"), startDate=LoginUser.getToday(, closeDate=LoginUser.getToday(, startDate=null, closeDate=null | UI구성 (이벤트 절로 대체) |
| public setHtmlGridStyle() | L510-513 | buildGrid2 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L515-517 | retrieve,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L519-521 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L523-525 | 생성자,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L527-529 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid1 = () => [
  gb.text('investAssetTypeNm', 200, '보유자산'),  // L311 SQL 계산 컬럼(selectInvestAssetLimit: f_cdnm('InvestAssetType', ast41_invest_…)
  gb.double('limitRate', 150, '투자한도(%)'),  // L312 SQL 계산 컬럼(selectInvestAssetLimit: MAX(ast41_limit_rate))
  gb.long('limitAmt', 200, '투자한도액'),  // L313 SQL 계산 컬럼(selectInvestAssetLimit: MAX(TRUNC(owner_capital * ast41_limit_r…)
  gb.long('evalAmt', 200, '투자금액'),  // L314
  gb.long('purAmt', 200, '매입원가'),  // L315
  gb.double('capitalRatio', 200, '자기자본대비(%)'),  // L316 SQL 계산 컬럼(selectInvestAssetLimit: TRUNC(SUM(COALESCE(ast09_eval_amt,0)) *…)
];

const buildGrid2 = () => [
  // ⚠DB없음 L324 newHeaderGroupMap011newHeaderGroupConfigsetHtmlGridStyle12 100 "평가손익" (ast09_new_header_group_map011new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L325 newHeaderGroupMap013newHeaderGroupConfigsetHtmlGridStyle12 100 "수익률(%)" (ast09_new_header_group_map013new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L329) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L330) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L331) addTextFrozen
  gb.date('firstPurDate', 100, '최초취득일'),  // L333
  gb.double('holdQty', 100, '보유수량'),  // L334
  gb.long('purAmt', 100, '취득금액'),  // L335
  gb.long('bookAmt', 100, '장부금액'),  // L336
  gb.double('purPrice', 80, '취득단가'),  // L337 SQL 계산 컬럼(selectFinanceByHoldDate: CASE WHEN COALESCE(ast09_pur_amt,0) = 0…)
  gb.double('evalPrice', 80, '평가단가'),  // L338 SQL 계산 컬럼(selectFinanceByHoldDate: CASE WHEN COALESCE(ast09_eval_amt,0) = …)
  gb.long('evalAmt', 100, '평가금액'),  // L339
  gb.long('evalPl', 100, '당기분'),  // L340
  gb.long('purEvalPl', 100, '취득대비'),  // L341 SQL 계산 컬럼(selectFinanceByHoldDate: CASE WHEN COALESCE(ast09_eval_amt,0) = …)
  gb.double('tyPlRate', 80, '당기분'),  // L342 SQL 계산 컬럼(selectFinanceByHoldDate: CASE WHEN COALESCE(ast09_eval_amt,0) = …)
  gb.double('purPlRate', 80, '취득대비'),  // L343 SQL 계산 컬럼(selectFinanceByHoldDate: CASE WHEN COALESCE(ast09_eval_amt,0) = …)
  // ⚠ 대응 없음 (GridBuilder L344) addStopLoss
  gb.date('sellPossibleDate', 100, '매도가능일'),  // L345 SQL 계산 컬럼(selectFinanceByHoldDate: CASE WHEN ast09_lock_up_date IS NULL TH…)
  gb.textRight('holdPeriod', 115, '보유기간'),  // L346 SQL 계산 컬럼(selectFinanceByHoldDate: CASE WHEN ast09_book_end_yn = 'true' TH…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createPrint}>출력/다운로드</Button>

### Ast06_TabPage_FinanceBookOpr (`client/vi/ast/Ast06_TabPage_FinanceBookOpr.java`, 216줄)

- 그리드 `grid1` (buildGrid1()):
  - date 90 "매수일" Date
  - qty 100 "수량" Double
  - price 80 "단가" Double
  - trAmt 100 "매수금액" Long
  - amt 100 "결제금액" Long
  - note 150 "거래구분" Text
- 그리드 `grid2` (buildGrid2()):
  - date 90 "매도일" Date
  - qty 100 "수량" Double
  - price 80 "단가" Double
  - trAmt 100 "매도금액" Long
  - feeSum 90 "매매비용" Long
  - amt 100 "결제금액" Long
  - purBookAmt 100 "취득금액" Long
  - purPlRate 90 "수익률(%)" Double
  - pl 100 "순손익<br>(결제-취득)" Long
  - note 150 "거래구분" Text

#### 이벤트
[E0] 화면 열림 (생성자 L45-76) → settings()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid1() | L103-112 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid2() | L114-127 | 필드 초기화 | 상태 처리 | 업무 |
| public init() | L130-133 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L136-143 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L146-190 | 공개 메서드 | 서비스 ast.Ast06_Tr.selectByAstClassTreeId, ast.Ast06_Tr.selectByAstClassTreeId(companyId, stdDate, astClassTreeId, keepAccountId, trType, companyId, stdDate, astClassTreeId, keepAccountId, trType), 건수 표시 | 업무 |
| public update() | L193-195 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L198-200 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L203-205 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L212-215 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L78-101 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L207-209 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid1 = () => [
  gb.date('date', 90, '매수일'),  // L105
  gb.double('qty', 100, '수량'),  // L106
  gb.double('price', 80, '단가'),  // L107
  gb.long('trAmt', 100, '매수금액'),  // L108
  gb.long('amt', 100, '결제금액'),  // L109
  gb.text('note', 150, '거래구분'),  // L110
];

const buildGrid2 = () => [
  gb.date('date', 90, '매도일'),  // L116
  gb.double('qty', 100, '수량'),  // L117
  gb.double('price', 80, '단가'),  // L118
  gb.long('trAmt', 100, '매도금액'),  // L119
  gb.long('feeSum', 90, '매매비용'),  // L120
  gb.long('amt', 100, '결제금액'),  // L121
  gb.long('purAmt', 100, '취득금액'),  // L122
  gb.double('purPlRate', 90, '수익률(%)'),  // L123
  gb.long('pl', 100, '순손익<br>(결제-취득)'),  // L124
  gb.text('note', 150, '거래구분'),  // L125
];
```

#### 사용된 버튼들
버튼 사용하지 않음

