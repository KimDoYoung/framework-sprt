# Ast07_Grid_History

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/ast/Ast07_Grid_History.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast07_Grid_History:257 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast07_Grid_History:306 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast07_Settle.delete` | Ast07_Grid_History:271 | [`Ast07_Settle.java:350`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 DELETE |
| `ast.Ast07_Settle.selectByHistoryPaging` | Ast07_Grid_History:100 | [`Ast07_Settle.java:44`](../../ast/services/Ast07_Settle.md) | [`ast07_settle.selectByHistory`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectByHistoryPaing`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectByHistoryPaingTotal`](../../ast/sql/ast07_settle.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`com01_relate_appr`](../../../db/tables/com.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depositbook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note`, `f_get_relate_dcr_count`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast07_Grid_History (`client/vi/ast/Ast07_Grid_History.java`, 322줄)

- 툴바 `buttonBar`: 실수령/지급 History :: {selectTypeTrue} {selectTypeFalse} {refreshButton} {deleteButton}
- 입력·하위 화면: `selectTypeTrue` Radio, `selectTypeFalse` Radio, `lookupModiJournal` Act02_Lookup_ModiJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - settleDate 100 "일자" Date
  - trName 150 "거래유형" Text
  - orgTrName 200 "원거래유형" Text
  - corpName 200 "거래처" Text
  - note 500 "종목/거래적요" Text
  - settleAmt 150 "결제금액" Long
  - actionCell 80 "전표변경" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L82-109) → setting()
[E1] selectTypeToggleGroup.ValueChange (L120) → retrieve()
[E2] refreshButton[새로고침].Select (L132) → retrieve()
[E3] deleteButton[취소].Select (L138) → deleteCheck()
       └ [E4] messageBox.DialogHide [YES] (L234) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L111-155 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L184-229 | E1,E2 | 상태 처리 | 업무 |
| private deleteCheck() | L231-243 | E3 | ConfirmBox → E4 | 업무 |
| private delete() | L245-302 | E4 | 미선택 시 alert "취소대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast07_Settle.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L304-316 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L157-182 | 필드 초기화 | 조회창 Act02_Lookup_ModiJournal 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L318-320 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('settleDate', 100, '일자'),  // L173
  gb.text('trNm', 150, '거래유형'),  // L174 SQL 계산 컬럼(selectByHistory: ast05_tr_nm)
  gb.text('orgTrNm', 200, '원거래유형'),  // L175 SQL 계산 컬럼(selectByHistory: CONCAT( f_cdnm('trCode' , tr_cd , #{com…)
  gb.text('corpNm', 200, '거래처'),  // L176 SQL 계산 컬럼(selectByHistory: f_get_corp_nm(corp_id))
  gb.text('note', 500, '종목/거래적요'),  // L177
  gb.long('settleAmt', 150, '결제금액'),  // L178
  // ⚠ 대응 없음 (GridBuilder L179) addCell
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="cancel" onClick={deleteCheck}>취소</Button>

