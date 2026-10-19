# Ast06_Tab_TrIntrinsic

- 종류: 화면
- 메뉴: 관리회계 > 11. 특수회계처리 > 고유자산 거래처리 (#1091)
- 파일: `client/vi/ast/Ast06_Tab_TrIntrinsic.java`
- 함께 쓰는 클래스 7개:
  - `Ast07_Grid_Settle` `client/vi/ast/Ast07_Grid_Settle.java`
  - `Ast06_Lookup_TrIntrinsic` `client/vi/ast/Ast06_Lookup_TrIntrinsic.java`
  - `Ast13_Lookup_BookDepn` `client/vi/ast/Ast13_Lookup_BookDepn.java`
  - `Ast06_Lookup_TrList` `client/vi/ast/Ast06_Lookup_TrList.java`
  - `Ast06_Lookup_InsertCF` `client/vi/ast/Ast06_Lookup_InsertCF.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
  - `Ast05_Lookup_TrCodeWindow` `client/vi/ast/Ast05_Lookup_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Ast07_Lookup_Settle`](../../ast/components/Ast07_Lookup_Settle.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_TrIntrinsic:617 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_InsertCF:93, Ast06_Lookup_TrIntrinsic:560, Ast06_Tab_TrIntrinsic:494, Ast07_Grid_Settle:195 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast01_ClassTree.selectById` | Ast06_Lookup_TrIntrinsic:296 | [`Ast01_ClassTree.java:26`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast05_TrCode.selectByWindowClassName` | Ast05_Lookup_TrCodeWindow:180 | [`Ast05_TrCode.java:43`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast06_Tr.checkDepn` | Ast06_Lookup_TrIntrinsic:691, Ast06_Tab_TrIntrinsic:559 | [`Ast06_Tr.java:300`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectDepnCount`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrIntrinsic:508 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.insertByCf` | Ast06_Lookup_InsertCF:105 | [`Ast06_Tr.java:245`](../../ast/services/Ast06_Tr.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.insert`](../../ast/sql/ast06_tr.md), [`ast06_tr.selectTodayCf`](../../ast/sql/ast06_tr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_TrIntrinsic:645, Ast06_Tab_TrIntrinsic:355 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectByPayCode` | Ast06_Lookup_TrList:184, Ast06_Tab_TrIntrinsic:427 | [`Ast06_Tr.java:43`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByPayCode`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.update` | Ast06_Lookup_TrIntrinsic:585 | [`Ast06_Tr.java:333`](../../ast/services/Ast06_Tr.md) | [`act02_journal.selectByTrId`](../../act/sql/act02_journal.md), [`act02_journal.updateTrInfo`](../../act/sql/act02_journal.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDepn` | Ast06_Lookup_TrIntrinsic:583 | [`Ast06_Tr.java:574`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_TrIntrinsic:666, Ast06_Tab_TrIntrinsic:544, Ast07_Grid_Settle:240 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast07_Settle.delete` | Ast07_Grid_Settle:209 | [`Ast07_Settle.java:350`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 DELETE |
| `ast.Ast07_Settle.selectByTrId` | Ast07_Grid_Settle:141 | [`Ast07_Settle.java:32`](../../ast/services/Ast07_Settle.md) | [`ast07_settle.selectByTrId`](../../ast/sql/ast07_settle.md) |
| `ast.Ast13_BookDepn.selectByDepnDate` | Ast13_Lookup_BookDepn:173 | [`Ast13_BookDepn.java:20`](../../ast/services/Ast13_BookDepn.md) | [`ast13_book_depn.selectByDepnDate`](../../ast/sql/ast13_book_depn.md) |
| `sys.Sys00_Common.selectByKindCode` | Ast13_Lookup_BookDepn:89 | [`Sys00_Common.java:111`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast03_cf_info`](../../../db/tables/ast.md), [`ast04_cf`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_ast_class_tree_nm_allpath2`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrIntrinsic (`client/vi/ast/Ast06_Tab_TrIntrinsic.java`, 606줄)

- 레이아웃: north=vlcHeader, center=vlc, east=gridSettle, south=gridJournal
- 툴바 `buttonBarHeader01`: 조회기간: {startDate} ~: {closeDate} 거래유형: {trName} 거래처: {corpName} 수령/지급: {payName} {retrieveButton}
- 툴바 `buttonBarHeader02`: 종목구분: {classTreeName} 검색: {searchText}
- 툴바 `buttonBar01`: {insertButton} {deleteButton} {importButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `payName` ComboBoxField("RcvPayCode", "%", "전체"), `trCodeId` LongField, `trName` LookupTriggerField 빈칸="전체", `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래유형/거래처/종목/비고", `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorpCode` Sys15_Lookup_Corp, `lookupInfo` Ast01_Lookup_Info, `lookupTr` Ast06_Lookup_TrIntrinsic, `lookup` Act80_Lookup_RelateAppr, `lookupCF` Ast06_Lookup_InsertCF
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - trName 180 "거래유형" Text
  - corpName 150 "거래처" Text
  - classTreeName 200 "종목" Text
  - amt 120 "금액" Long
  - tax 80 "세금" Long
  - actionCell 50 "변경" Cell 편집:actionCell
  - apprCnt 55 "연관문서" Text
  - actionCell 25 " " Cell 편집:actionCell2
  - settleMngYn 80 "미수/미지급" Boolean
  - depositName 150 "예금계좌" Text
  - note 250 "적요" TextArea
  - personName 80 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L98-134) → setting()
[E1] trName.TriggerClick [result != null] (L153) → 인라인 L153-171 (new TriggerClickHandler(){ @Override …)
[E2] corpName.TriggerClick [result != null] (L181) → 인라인 L181-199 (new TriggerClickHandler() { @Override…)
[E3] classTreeName.TriggerClick [result != null] (L204) → 인라인 L204-222 (new TriggerClickHandler(){ @Override …)
[E4] searchText.KeyPress [Enter] (L226) → retrieve()
[E5] retrieveButton[조회].Select (L260) → retrieve()
[E6] insertButton[등록].Select (L266) → insertRow()
[E7] deleteButton[삭제].Select (L272) → deleteRow()
       └ [E10] msgBox.DialogHide [YES] (L462) → delete()
[E8] importButton[C/F가져오기].Select (L278) → importInfoToday()
[E9] grid.RowClick (L302) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L136-310 | 생성자 | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Sys15_Lookup_Corp 열기, 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L389-437 | E4,E5,setting,importInfoToday | 서비스 ast.Ast06_Tr.selectByPayCode(startDate, closeDate, companyId, userId, orgId, searchText, classTreeId, classTreeId, trCodeId, trCodeId, corpId, corpId, payCode, assetType, abroType, windowClassName) | 업무 |
| private retrievePage() | L439-443 | E9,retrieve | 상태 처리 | 업무 |
| private insertRow() | L445-457 | E6 | 조회창 Ast06_Lookup_TrIntrinsic 열기 | 업무 |
| private deleteRow() | L459-477 | E7 | ConfirmBox → E10 | 업무 |
| private delete() | L479-540 | E10 | 미선택 시 alert "삭제대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L542-554 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private checkDepn() | L556-579 | delete | 서비스 ast.Ast06_Tr.checkDepn(companyId, trDate, purTrId) | 업무 |
| private importInfoToday() | L581-589 | E8 | 조회창 Ast06_Lookup_InsertCF 열기 | 업무 |
| public buildGrid() | L312-387 | 필드 초기화 | 조회창 Ast06_Lookup_TrIntrinsic 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 ast.Ast06_Tr.selectById(trId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L600-602 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L603-605 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L372
  gb.text('trNm', 180, '거래유형'),  // L373
  gb.text('corpNm', 150, '거래처'),  // L374
  gb.text('classTreeNm', 200, '종목'),  // L375
  gb.long('amt', 120, '금액'),  // L376
  gb.long('tax', 80, '세금'),  // L377
  // ⚠ 대응 없음 (GridBuilder L378) addCell
  gb.text('apprCnt', 55, '연관문서'),  // L379
  // ⚠ 대응 없음 (GridBuilder L380) addCell
  gb.boolean('settleMngYn', 80, '미수/미지급'),  // L381
  gb.text('depositName', 150, '예금계좌'),  // L382
  gb.textArea('note', 250, '적요'),  // L383
  gb.textCenter('personNm', 80, '등록자'),  // L384
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="addRow" onClick={importInfoToday}>C/F가져오기</Button>

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

### Ast06_Lookup_TrIntrinsic (`client/vi/ast/Ast06_Lookup_TrIntrinsic.java`, 759줄)

- 입력·하위 화면: `date` MyDateField, `trCode` TextField, `corpId` LongField, `astClassTreeId` LongField, `amt` LongField, `contAmt` LongField, `bookAmt` LongField, `tax` LongField, `note` TextField, `curCode` TextField, `purTrId` LongField, `bookIoType` TextField, `itemLClassCode` TextField, `itemSClassCode` TextField, `trName` LookupTriggerField, `corpName` LookupTriggerField, `classTreeFullName` LookupTriggerField, `depositId` LongField, `depositName` LookupTriggerField, `settleMngTrue` Radio, `settleMngFalse` Radio, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorp` Sys15_Lookup_Corp, `lookupBook` Ast13_Lookup_BookDepn, `lookupInfo` Ast01_Lookup_Info, `trList` Ast06_Lookup_TrList

#### 이벤트
[E0] 화면 열림 (생성자 L104-106) → 초기화
[E1] contAmt[거래금액].ValueChange (L200) → setAmt()
[E2] tax[세금].ValueChange (L206) → setAmt()
[E3] settleMngToggleGroup.ValueChange (L219) → 인라인 L219-232 (new ValueChangeHandler<HasValue<Boole…)
[E4] depositName.TriggerClick [result == null] (L246) → 인라인 L246-264 (new TriggerClickHandler(){ @Override …)
[E5] trName[거래유형].TriggerClick [rcvPayType == null] (L267) → 서비스 ast.Ast01_ClassTree.selectById(classTreeId), 메시지 "수령/지급 구분이 해당없음 또는 미지정 거래유형입니다."
[E6] corpName[거래처].TriggerClick [result != null] (L323) → 인라인 L323-341 (new TriggerClickHandler(){ @Override …)
[E7] classTreeFullName.TriggerClick [trCode.getValue() == null] (L344) → isBookYn()
[E8] copyButton[거래 불러오기].Select (L407) → trCopy()
[E9] updateButton[저장].Select (L413) → preUpdate()
[E10] journalButton[분개재생성].Select (L419) → createJournal()
[E11] closeButton[닫기].Select ["NEW".equals(actionName)] (L425) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L108-122 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L124-193 | openNew | 상태 처리 | 업무 |
| private setting() | L195-437 | open | 조회창 Ast01_Lookup_CorpAccount 열기, 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Sys15_Lookup_Corp 열기, 조회창 Ast13_Lookup_BookDepn 열기, 조회창 Ast01_Lookup_Info 열기, 서비스 ast.Ast01_ClassTree.selectById(classTreeId) | 업무 |
| private setAmt() | L439-466 | E1,E2 | 상태 처리 | 업무 |
| private getEditor() | L468-526 | open | 상태 처리 | 업무 |
| public preUpdate() | L528-577 | E9 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L579-606 | preUpdate | 서비스 ast.Ast06_Tr.updateDepn, ast.Ast06_Tr.update | 업무 |
| private createJournal() | L608-638 | E10,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L640-662 | createJournal | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private updateDepositBook() | L664-676 | success | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private isBookYn() | L678-687 | E7,preUpdate | 상태 처리 | 업무 |
| private checkDepn() | L689-711 | preUpdate | 서비스 ast.Ast06_Tr.checkDepn(companyId, trDate, purTrId) | 업무 |
| private trCopy() | L713-749 | E8 | 조회창 Ast06_Lookup_TrList 열기 | 업무 |
| private setHtmlStyle() | L751-753 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L755-757 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={trCopy}>거래 불러오기</Button>
2. <Button type="save" onClick={preUpdate}>저장</Button>
3. <Button type="unknown" onClick={createJournal}>분개재생성</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast13_Lookup_BookDepn (`client/vi/ast/Ast13_Lookup_BookDepn.java`, 189줄)

- 툴바 `buttonBar`: 보유일: {stdDate} 구분: {astTypeCombo} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="자산구분/자산명", `stdDate` MyDateField, `astTypeCombo` CommonComboBoxField("sys.Sys00_Common.selectByKindCode", "%", "전체") 빈칸="전체"
- 그리드 `grid` (buildGrid(), 체크박스):
  - itemType 150 "자산구분" Text
  - itemName 300 "자산명" Text
  - purDate 100 "취득일" Date
  - purAmt 150 "취득금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L57-73) → show()
[E1] searchText.KeyPress [Enter] (L96) → retrieve()
[E2] confirmButton[확인].Select [callbackResult != null] (L113) → hide()
[E3] cancleButton[닫기].Select (L127) → hide()
[E4] retrieveButton[조회].Select (L133) → retrieve()
[E5] grid.CellDoubleClick [callbackResult != null] (L140) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L75-79 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L81-150 | open | 미선택 시 alert "보유자산을 선택해주세요.", 서비스 sys.Sys00_Common.selectByKindCode | 업무 |
| public retrieve() | L165-179 | E1,E4,open | 서비스 ast.Ast13_BookDepn.selectByDepnDate(companyId, depnDate, searchText) | 업무 |
| public buildGrid() | L152-163 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L181-183 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L185-187 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemType', 150, '자산구분'),  // L157
  gb.text('itemNm', 300, '자산명'),  // L158
  gb.date('purDate', 100, '취득일'),  // L159
  gb.long('purAmt', 150, '취득금액'),  // L160
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Lookup_TrList (`client/vi/ast/Ast06_Lookup_TrList.java`, 210줄)

- 툴바 `buttonBar`: 조회일자: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="거래유형/거래처/종목/적요"
- 그리드 `grid` (buildGrid(), 체크박스):
  - date 90 "일자" Date
  - trName 180 "거래유형" Text
  - corpName 180 "거래처" Text
  - astClassName 200 "종목" Text
  - amt 100 "금액" Long
  - note 350 "적요" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-67) → 초기화
[E1] searchText.KeyPress [Enter] (L101) → retrieve()
[E2] grid.RowDoubleClick (L111) → select()
[E3] selectButton[확인].Select (L129) → select()
[E4] cancleButton[닫기].Select (L135) → hide()
[E5] retrieveButton[조회].Select (L141) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-86 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L88-148 | open | 상태 처리 | 업무 |
| private retrieve() | L165-190 | E1,E5,open | 서비스 ast.Ast06_Tr.selectByPayCode(companyId, userId, orgId, startDate, closeDate, searchText, classTreeId, trCodeId, corpId, payCode, assetType, abroType, windowClassName, bookIoCheck) | 업무 |
| private select() | L192-200 | E2,E3 | 상태 처리 | 업무 |
| public buildGrid() | L150-163 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L206-208 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 90, '일자'),  // L155
  gb.text('trNm', 180, '거래유형'),  // L156
  gb.text('corpNm', 180, '거래처'),  // L157
  gb.text('astClassNm', 200, '종목'),  // L158
  gb.long('amt', 100, '금액'),  // L159
  gb.text('note', 350, '적요'),  // L160
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Lookup_InsertCF (`client/vi/ast/Ast06_Lookup_InsertCF.java`, 151줄)

- 입력·하위 화면: `stdDate` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L45-81) → show()
[E1] updateButton[가져오기].Select (L55) → update()
       └ [E3] msgBox.DialogHide [YES] (L87) → hide()
[E2] cancleButton[닫기].Select (L61) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-43 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L83-141 | E1 | ConfirmBox → E3 | 업무 |
| private setHtmlStyle() | L143-145 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L147-149 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="download" onClick={update}>가져오기</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Ast05_Lookup_TrCodeWindow (`client/vi/ast/Ast05_Lookup_TrCodeWindow.java`, 196줄)

- 툴바 `buttonBar`: {label} {searchText} {rcvPayCodeCombo} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="거래코드/명", `rcvPayCodeCombo` ComboBoxField("RcvPayCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - trCode 80 "거래코드" TextCenter
  - trName 200 "거래명" Text
  - rcvPayName 100 "수령/지급" Text
  - note 150 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L61-79) → show()
[E1] grid.CellDoubleClick [callbackResult != null] (L82) → hide()
[E2] confirmButton[확인].Select [callbackResult != null] (L92) → hide()
[E3] selectAllButton[전체].Select (L102) → hide()
[E4] cancleButton[닫기].Select (L109) → hide()
[E5] retrieveButton[조회].Select (L115) → retrieve()
[E6] searchText.KeyPress [Enter] (L128) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-59 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L81-141 | open | 상태 처리 | 업무 |
| public retrieve() | L155-186 | E5,E6,open | 서비스 ast.Ast05_TrCode.selectByWindowClassName(companyId, searchText, rcvPayCode, windowClassName) | 업무 |
| public buildGrid() | L143-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L188-190 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L192-194 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('trCd', 80, '거래코드'),  // L147
  gb.text('trNm', 200, '거래명'),  // L148
  gb.text('rcvPayNm', 100, '수령/지급'),  // L149
  gb.text('note', 150, '비고'),  // L150
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

