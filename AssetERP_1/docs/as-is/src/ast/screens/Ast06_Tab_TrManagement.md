# Ast06_Tab_TrManagement

- 종류: 화면
- 메뉴: 펀드관리 > 80. 펀드자산 > 펀드자산 거래관리 (#1119, 미사용)
- 파일: `client/vi/ast/Ast06_Tab_TrManagement.java`
- 함께 쓰는 클래스 2개:
  - `Ast07_Grid_Settle` `client/vi/ast/Ast07_Grid_Settle.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Ast05_Lookup_TrCode`](../../ast/components/Ast05_Lookup_TrCode.md), [`Ast07_Lookup_Settle`](../../ast/components/Ast07_Lookup_Settle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast07_Grid_Settle:195 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrManagement:417 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.insert` | Ast06_Tab_TrManagement:435 | **(없음)** | - |
| `ast.Ast06_Tr.selectByPayCode` | Ast06_Tab_TrManagement:348 | [`Ast06_Tr.java:43`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByPayCode`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.update` | Ast06_Tab_TrManagement:382 | [`Ast06_Tr.java:333`](../../ast/services/Ast06_Tr.md) | [`act02_journal.selectByTrId`](../../act/sql/act02_journal.md), [`act02_journal.updateTrInfo`](../../act/sql/act02_journal.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast07_Grid_Settle:240 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast07_Settle.delete` | Ast07_Grid_Settle:209 | [`Ast07_Settle.java:350`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 DELETE |
| `ast.Ast07_Settle.selectByTrId` | Ast07_Grid_Settle:141 | [`Ast07_Settle.java:32`](../../ast/services/Ast07_Settle.md) | [`ast07_settle.selectByTrId`](../../ast/sql/ast07_settle.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrManagement (`client/vi/ast/Ast06_Tab_TrManagement.java`, 477줄)

- 레이아웃: north=vlcHeader, center=vlc, east=gridSettle
- 툴바 `buttonBarHeader01`: 조회기간: {startDate} ~: {closeDate} 거래유형: {trName} 수령/지급: {payName} {retrieveButton}
- 툴바 `buttonBarHeader02`: 종목구분: {classTreeName}
- 툴바 `buttonBar01`: {refreshButton} {insertButton} {updateButton} {deleteButton} {importButton}
- 툴바 `buttonBar02`: {addCodeButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `payName` ComboBoxField("RcvPayCode", "%", "전체"), `trCodeId` LongField, `trName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `lookupTrCode` Ast05_Lookup_TrCode, `lookupInfo` Ast01_Lookup_Info, `classTreeLookup` LookupTriggerField, `trCodeLookup` LookupTriggerField
- 그리드 `grid` (buildGrid()):
  - date 100 "일자" Date 편집:MyDateField
  - classTreeFullName 400 "종목" Text 편집:classTreeLookup
  - trName 150 "거래유형" Text 편집:trCodeLookup
  - amt 120 "금액" Long 편집:LongField
  - settleMngYn 60 "미결관리" Boolean
  - personName 80 "등록자" Text
  - note 200 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L87-130) → setting()
[E1] grid.SelectionChanged [선택>0] (L104) → retrievePage()
[E2] trName.TriggerClick [result != null] (L153) → 인라인 L153-171 (new TriggerClickHandler(){ @Override …)
[E3] retrieveButton[조회].Select (L172) → retrieve()
[E4] classTreeName.TriggerClick [result != null] (L185) → 인라인 L185-203 (new TriggerClickHandler(){ @Override …)
[E5] refreshButton[조회].Select (L221) → retrieve()
[E6] insertButton[등록].Select (L227) → insertRow()
[E7] updateButton[저장].Select (L233) → update()
[E8] deleteButton[삭제].Select (L239) → deleteRow()
       └ [E13] msgBox.DialogHide [YES] (L397) → delete()
[E9] importButton[당일C/F가져오기].Select (L245) → importInfoToday()
       └ [E14] msgBox.DialogHide [YES] (L430) → retrieve()
[E10] addCodeButton[거래유형추가].Select (L251) → lookupTrCode()
[E11] classTreeLookup.TriggerClick [result != null] (L274) → 인라인 L274-291 (new TriggerClickHandler(){ @Override …)
[E12] trCodeLookup.TriggerClick (L295) → 인라인 L295-310 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrievePage() | L132-135 | E1 | 상태 처리 | 업무 |
| private setting() | L137-266 | 생성자 | 조회창 Ast05_Lookup_TrCode 열기, 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L322-357 | E3,E5,E14,setting | 서비스 ast.Ast06_Tr.selectByPayCode(startDate, closeDate, companyId, userId, orgId, classTreeId, classTreeId, trCodeId, trCodeId, payCode, assetType, windowClassName) | 업무 |
| private update() | L359-383 | E7 | 서비스 ast.Ast06_Tr.update | 업무 |
| private insertRow() | L385-392 | E6 | 상태 처리 | 업무 |
| private deleteRow() | L394-412 | E8 | ConfirmBox → E13 | 업무 |
| private delete() | L414-418 | E13 | GridDeleteData ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| private importInfoToday() | L420-463 | E9 | ConfirmBox → E14 | 업무 |
| private lookupTrCode() | L465-472 | E10 | 조회창 Ast05_Lookup_TrCode 열기 | 업무 |
| public buildGrid() | L268-320 | 필드 초기화 | 조회창 Ast01_Lookup_Info 열기, 조회창 Ast05_Lookup_TrCode 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L474-476 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자', { editor: 'date' }),  // L311
  gb.text('classTreeFullNm', 400, '종목'),  // L312
  gb.text('trNm', 150, '거래유형'),  // L313
  gb.long('amt', 120, '금액', { editor: 'number' }),  // L314
  gb.boolean('settleMngYn', 60, '미결관리'),  // L315
  gb.text('personNm', 80, '등록자'),  // L316
  gb.text('note', 200, '비고', { editor: 'text' }),  // L317
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={deleteRow}>삭제</Button>
6. <Button type="unknown" onClick={importInfoToday}>당일C/F가져오기</Button>
7. <Button type="register" onClick={lookupTrCode}>거래유형추가</Button>

### Ast07_Grid_Settle (`client/vi/ast/Ast07_Grid_Settle.java`, 253줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `lookupSettle` Ast07_Lookup_Settle
- 그리드 `grid` (buildGrid(), 체크박스):
  - settleDate 90 "결제일자" Date
  - settleAmt 100 "결제금액" Long
  - depositName 120 "예금계좌" Text
  - note 130 "적요" TextArea
  - actionCell 50 "변경" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L57-87) → 초기화
[E1] insertButton[등록].Select (L60) → insertRow()
[E2] deleteButton[삭제].Select (L66) → deleteRow()
       └ [E4] messageBox.DialogHide [YES] (L173) → delete()
[E3] grid.RowClick (L81) → journalRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setJournal() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| private journalRetrieve() | L122-125 | E3,buildGrid,insertRow | 상태 처리 | 업무 |
| public retrieve() | L127-148 | 공개 메서드 | 서비스 ast.Ast07_Settle.selectByTrId(trId) | 업무 |
| public gridClear() | L150-152 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L154-169 | E1 | 조회창 Ast07_Lookup_Settle 열기 | 업무 |
| public deleteRow() | L171-182 | E2 | ConfirmBox → E4 | 업무 |
| private delete() | L184-236 | E4 | 미선택 시 alert "삭제대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast07_Settle.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L238-250 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L89-116 | 필드 초기화 | 조회창 Ast07_Lookup_Settle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('settleDate', 90, '결제일자'),  // L106
  gb.long('settleAmt', 100, '결제금액'),  // L107
  gb.text('depositName', 120, '예금계좌'),  // L108 SQL 계산 컬럼(selectByTrId: ast01_class_tree_nm)
  gb.textArea('note', 130, '적요'),  // L109
  // ⚠ 대응 없음 (GridBuilder L110) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Ast06_Grid_Journal (`client/vi/ast/Ast06_Grid_Journal.java`, 143줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {modiButton}
- 입력·하위 화면: `lookupModiJournal` Act02_Lookup_ModiJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - trName 120 "거래유형" TextArea
  - drAccountCode 100 "계정코드" TextCenter 편집:"456EA6"
  - drAstAccountName 300 "계정과목" TextArea2 편집:"456EA6"
  - drAmt 100 "금액" Long 편집:"456EA6"
  - drNote 200 "적요" TextArea2 편집:"456EA6"
  - crAccountCode 100 "계정코드" TextCenter 편집:"DD5E5E"
  - crAstAccountName 300 "계정과목" TextArea2 편집:"DD5E5E"
  - crAmt 100 "금액" Long 편집:"DD5E5E"
  - crNote 200 "적요" TextArea2 편집:"DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L41-58) → settings()
[E1] modiButton[변경].Select (L61) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L101-105 | E1 | 상태 처리 | 업무 |
| public gridClear() | L107-109 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L112-125 | E1 | 서비스 act.Act03_JournalDtl.selectByJournalId(journalId) | 업무 |
| public update() | L128-129 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L132-133 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L136-137 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L60-73 | 생성자 | 조회창 Act02_Lookup_ModiJournal 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L75-99 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L139-142 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L80 newHeaderGroupMap03newHeaderGroupConfigsetHtmlGridStyle14 100 "차변" (act03_new_header_group_map03new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L81 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map06new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.textArea('trNm', 120, '거래유형'),  // L84
  gb.textCenter('drAccountCd', 100, '계정코드'),  // L85
  // ⚠ 대응 없음 (GridBuilder L86) addTextArea2
  gb.long('drAmt', 100, '금액'),  // L87
  // ⚠ 대응 없음 (GridBuilder L88) addTextArea2
  gb.textCenter('crAccountCd', 100, '계정코드'),  // L89
  // ⚠ 대응 없음 (GridBuilder L90) addTextArea2
  gb.long('crAmt', 100, '금액'),  // L91
  // ⚠ 대응 없음 (GridBuilder L92) addTextArea2
];
```

#### 사용된 버튼들
1. <Button type="change" onClick={retrieve}>변경</Button>

