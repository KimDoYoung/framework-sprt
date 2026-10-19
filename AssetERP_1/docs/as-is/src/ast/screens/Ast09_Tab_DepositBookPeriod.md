# Ast09_Tab_DepositBookPeriod

- 종류: 화면
- 메뉴: 자금관리 > 10. 자금관리 > 예금잔고조회 (#1238)
- 메뉴: 고유자산 > 40. 예금관리 > 예금잔고조회 (#1471)
- 파일: `client/vi/ast/Ast09_Tab_DepositBookPeriod.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Tab_JournalSub`](../../act/screens/Act02_Tab_JournalSub.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast09_Book.createDepositBook` | Ast09_Tab_DepositBookPeriod:241 | [`Ast09_Book.java:163`](../../ast/services/Ast09_Book.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast09_Book.selectByHoldDatePeriod` | Ast09_Tab_DepositBookPeriod:217 | [`Ast09_Book.java:64`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md), [`ast09_book.selectByHoldDatePeriod`](../../ast/sql/ast09_book.md), [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys12_calendar.selectPeriod`](../../sys/sql/sys12_calendar.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_create_depositbook`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_sellpossibleqty`, `f_nvl`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast09_Tab_DepositBookPeriod (`client/vi/ast/Ast09_Tab_DepositBookPeriod.java`, 275줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회일자: {startDate} ~: {closeDate} 계좌: {depositName} 검색: {searchText} {retrieveButton} {depositButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="구분/계좌", `depositId` LongField, `depositName` LookupTriggerField 빈칸="전체", `lookupCorpAccount` Ast01_Lookup_CorpAccount
- 그리드 `grid` (buildGrid()):
  - holdDate 100 "보유일자" Date
  - astSClassName 180 "구분" TextCenter
  - keepCorpAccountName 300 "계좌" Text
  - curCode 70 "통화" TextCenter
  - forBookAmt 150 "통화기준 잔액" Double
  - forDiffAmt 150 "통화기준 증감액" Double
  - bookAmt 150 "원화 잔액" Long
  - diffAmt 150 "원화 증감액" Double
  - actionCell 60 "계정별원장" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-98) → settings(), retrieve()
[E1] depositName.TriggerClick [result != null] (L122) → 인라인 L122-140 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L144) → retrieve()
[E3] retrieveButton[조회].Select (L153) → retrieve()
[E4] depositButton[예금잔고정리].Select (L159) → depositUpdate()
       └ [E5] msgBox.DialogHide [YES] (L234) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L198-226 | 생성자,E2,E3,E5 | 서비스 ast.Ast09_Book.selectByHoldDatePeriod(companyId, personId, windowClassName, startDate, closeDate, depositIdStr, astType, searchText) | 업무 |
| private depositUpdate() | L228-269 | E4 | ConfirmBox → E5 | 업무 |
| private settings() | L100-165 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기, 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=LoginUser.getToday(, depositId=accountModel.getClassTreeId(, depositName=accountModel.getCorpAccountName(, depositId=null, depositName="전체" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L167-196 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L271-273 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('holdDate', 100, '보유일자'),  // L185
  gb.textCenter('astSClassNm', 180, '구분'),  // L186 SQL 계산 컬럼(selectByHoldDate: f_cdnm('ItemSClassCode',ast1.ast01_item…)
  gb.text('keepCorpAccountNm', 300, '계좌'),  // L187 SQL 계산 컬럼(selectByHoldDate: f_get_corp_nm(ast2.ast01_corp_id) ||'('…)
  gb.textCenter('curCode', 70, '통화'),  // L188 SQL 계산 컬럼(selectByHoldDate: COALESCE(ast1.ast01_cur_cd,'KRW'))
  gb.double('forBookAmt', 150, '통화기준 잔액'),  // L189
  gb.double('forDiffAmt', 150, '통화기준 증감액'),  // L190 SQL 계산 컬럼(selectByHoldDatePeriod: sys99_double01 - COALESCE(( SELECT sys9…)
  gb.long('bookAmt', 150, '원화 잔액'),  // L191
  gb.double('diffAmt', 150, '원화 증감액'),  // L192 SQL 계산 컬럼(selectByHoldDate: ast09_hold_qty - COALESCE(ast12_real_qt…)
  // ⚠ 대응 없음 (GridBuilder L193) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="view" onClick={depositUpdate}>예금잔고정리</Button>

