# Ast07_Lookup_Settle

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/ast/Ast07_Lookup_Settle.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast07_Lookup_Settle:329 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.selectById` | Ast07_Lookup_Settle:104 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast07_Lookup_Settle:373 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast07_Settle.update` | Ast07_Lookup_Settle:347 | [`Ast07_Settle.java:169`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast07_settle.selectAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md), [`ast07_settle.sumForAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.updateAmt`](../../ast/sql/ast07_settle.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 INSERT/UPDATE → [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md) |
| `pay.Pay50_Expense.selectById` | Ast07_Lookup_Settle:143 | [`Pay50_Expense.java:40`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`com01_relate_appr`](../../../db/tables/com.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depositbook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_emptrans`, `f_get_relate_dcr_count`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast07_Lookup_Settle (`client/vi/ast/Ast07_Lookup_Settle.java`, 422줄)

- 입력·하위 화면: `settleDate` MyDateField, `trCode` TextField, `settleAmt` LongField, `amt` LongField, `note` TextField, `curCode` TextField, `depositId` LongField, `depositName` LookupTriggerField, `noActCheckBox` CheckBox, `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L80-100) → buildGrid(), setting(), getEditor(), show()
[E1] amt[미수/미지급금액].ValueChange (L205) → 인라인 L205-210 (new ValueChangeHandler<Long>() { @Ove…)
[E2] noActCheckBox.ValueChange (L214) → setNoActCheckBox()
[E3] depositName[예금계좌].TriggerClick [result == null] (L222) → 인라인 L222-240 (new TriggerClickHandler(){ @Override …)
[E4] updateButton[저장].Select (L242) → preUpdate()
[E5] closeButton[닫기].Select ["NEW".equals(actionName)] (L248) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L102-135 | 공개 메서드 | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| public openNew9100() | L137-174 | 공개 메서드 | 서비스 pay.Pay50_Expense.selectById(expenseId) | 업무 |
| public open() | L176-199 | openNew,openNew9100 | 상태 처리 | 업무 |
| private setting() | L201-260 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private getEditor() | L268-301 | 생성자 | 상태 처리 | 업무 |
| public preUpdate() | L303-344 | E4 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L346-369 | preUpdate | 서비스 ast.Ast07_Settle.update | 업무 |
| private updateDepositBook() | L371-383 | update | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setNoActCheckBox() | L385-397 | E2 | 상태 처리 | 업무 |
| private setTrCode() | L399-413 | openNew,openNew9100,setNoActCheckBox | 상태 처리 | 업무 |
| public buildGrid() | L262-266 | 생성자 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L415-417 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L418-420 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

