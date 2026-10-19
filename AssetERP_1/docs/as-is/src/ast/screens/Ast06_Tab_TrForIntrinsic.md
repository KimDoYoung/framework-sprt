# Ast06_Tab_TrForIntrinsic

- 종류: 화면
- 메뉴: 관리회계 > 12. 특수회계처리(외화) > 고유자산 거래처리(외화) (#1171)
- 파일: `client/vi/ast/Ast06_Tab_TrForIntrinsic.java`
- 함께 쓰는 클래스 5개:
  - `Ast07_Grid_ForSettle` `client/vi/ast/Ast07_Grid_ForSettle.java`
  - `Ast07_Lookup_ForSettle` `client/vi/ast/Ast07_Lookup_ForSettle.java`
  - `Ast06_Lookup_TrForIntrinsic` `client/vi/ast/Ast06_Lookup_TrForIntrinsic.java`
  - `Ast06_Grid_ForJournal` `client/vi/ast/Ast06_Grid_ForJournal.java`
  - `Ast05_Lookup_TrCodeWindow` `client/vi/ast/Ast05_Lookup_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiForJournal`](../../act/components/Act02_Lookup_ModiForJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_TrForIntrinsic:472 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_ForJournal:118 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_TrForIntrinsic:425, Ast06_Tab_TrForIntrinsic:446, Ast07_Grid_ForSettle:297, Ast07_Lookup_ForSettle:292 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast05_TrCode.selectByWindowClassName` | Ast05_Lookup_TrCodeWindow:180 | [`Ast05_TrCode.java:43`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrForIntrinsic:460 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_TrForIntrinsic:535, Ast06_Tab_TrForIntrinsic:312, Ast07_Lookup_ForSettle:99 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectByPayCode` | Ast06_Tab_TrForIntrinsic:381 | [`Ast06_Tr.java:43`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByPayCode`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.update` | Ast06_Lookup_TrForIntrinsic:444 | [`Ast06_Tr.java:333`](../../ast/services/Ast06_Tr.md) | [`act02_journal.selectByTrId`](../../act/sql/act02_journal.md), [`act02_journal.updateTrInfo`](../../act/sql/act02_journal.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_TrForIntrinsic:556, Ast06_Tab_TrForIntrinsic:494, Ast07_Grid_ForSettle:342, Ast07_Lookup_ForSettle:336 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast07_Settle.delete` | Ast07_Grid_ForSettle:311 | [`Ast07_Settle.java:350`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 DELETE |
| `ast.Ast07_Settle.selectByTrId` | Ast07_Grid_ForSettle:172 | [`Ast07_Settle.java:32`](../../ast/services/Ast07_Settle.md) | [`ast07_settle.selectByTrId`](../../ast/sql/ast07_settle.md) |
| `ast.Ast07_Settle.update` | Ast07_Lookup_ForSettle:310 | [`Ast07_Settle.java:169`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast07_settle.selectAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md), [`ast07_settle.sumForAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.updateAmt`](../../ast/sql/ast07_settle.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 INSERT/UPDATE → [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md) |
| `sys.Sys00_Common.selectForDeposit` | Ast06_Lookup_TrForIntrinsic:215, Ast07_Lookup_ForSettle:180 | [`Sys00_Common.java:91`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectForDeposit`](../../sys/sql/sys00_common.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrForIntrinsic (`client/vi/ast/Ast06_Tab_TrForIntrinsic.java`, 509줄)

- 레이아웃: north=vlcHeader, center=vlc, east=gridSettle, south=gridJournal
- 툴바 `buttonBarHeader01`: 조회기간: {startDate} ~: {closeDate} 거래유형: {trName} 거래처: {corpName} {retrieveButton}
- 툴바 `buttonBarHeader02`: 종목구분: {classTreeName} 수령/지급: {payName}
- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `payName` ComboBoxField("RcvPayCode", "%", "전체"), `trCodeId` LongField, `trName` LookupTriggerField 빈칸="전체", `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorpCode` Sys15_Lookup_Corp, `lookupInfo` Ast01_Lookup_Info, `lookupTr` Ast06_Lookup_TrForIntrinsic, `lookup` Act80_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - trName 180 "거래유형" Text
  - corpName 150 "거래처" Text
  - classTreeName 200 "종목" Text
  - curCode 60 "통화" TextCenter
  - fxRate 100 "적용환율" Double
  - forAmt 100 "외화금액" Double
  - amt 120 "원화금액" Long
  - actionCell 50 "변경" Cell 편집:actionCell
  - apprCnt 55 "연관문서" Text
  - actionCell 25 " " Cell 편집:actionCell2
  - settleMngYn 80 "미수/미지급" Boolean
  - depositName 150 "예금계좌" Text
  - note 250 "적요" Text
  - personName 80 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L89-121) → setting()
[E1] trName.TriggerClick [result != null] (L140) → 인라인 L140-158 (new TriggerClickHandler(){ @Override …)
[E2] corpName.TriggerClick [result != null] (L168) → 인라인 L168-186 (new TriggerClickHandler() { @Override…)
[E3] classTreeName.TriggerClick [result != null] (L191) → 인라인 L191-209 (new TriggerClickHandler(){ @Override …)
[E4] retrieveButton[조회].Select (L234) → retrieve()
[E5] insertButton[등록].Select (L240) → insertRow()
[E6] deleteButton[삭제].Select (L246) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L417) → delete()
[E7] grid.RowClick (L259) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L123-267 | 생성자 | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Sys15_Lookup_Corp 열기, 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L348-391 | E4,setting | 서비스 ast.Ast06_Tr.selectByPayCode(startDate, closeDate, companyId, userId, orgId, classTreeId, classTreeId, trCodeId, trCodeId, corpId, corpId, payCode, assetType, abroType, windowClassName) | 업무 |
| private retrievePage() | L393-397 | E7,retrieve | 상태 처리 | 업무 |
| private insertRow() | L399-412 | E5 | 조회창 Ast06_Lookup_TrForIntrinsic 열기 | 업무 |
| private deleteRow() | L414-432 | E6 | ConfirmBox → E8 | 업무 |
| private delete() | L434-490 | E8 | 미선택 시 alert "삭제대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L492-504 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L269-346 | 필드 초기화 | 조회창 Ast06_Lookup_TrForIntrinsic 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 ast.Ast06_Tr.selectById(trId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L506-508 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L329
  gb.text('trNm', 180, '거래유형'),  // L330
  gb.text('corpNm', 150, '거래처'),  // L331
  gb.text('classTreeNm', 200, '종목'),  // L332
  gb.textCenter('curCd', 60, '통화'),  // L333
  gb.double('fxRate', 100, '적용환율'),  // L334
  gb.double('forAmt', 100, '외화금액'),  // L335
  gb.long('amt', 120, '원화금액'),  // L336
  // ⚠ 대응 없음 (GridBuilder L337) addCell
  gb.text('apprCnt', 55, '연관문서'),  // L338
  // ⚠ 대응 없음 (GridBuilder L339) addCell
  gb.boolean('settleMngYn', 80, '미수/미지급'),  // L340
  gb.text('depositName', 150, '예금계좌'),  // L341
  gb.text('note', 250, '적요'),  // L342
  gb.textCenter('personNm', 80, '등록자'),  // L343
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>

### Ast07_Grid_ForSettle (`client/vi/ast/Ast07_Grid_ForSettle.java`, 355줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `lookupSettle` Ast07_Lookup_ForSettle
- 그리드 `grid` (buildGrid(), 체크박스):
  - settleDate 110 "결제일자" Date
  - forSettleAmt 100 "외화결제금액" Double
  - fxRate 100 "적용환율" Double
  - settleAmt 120 "원화결제금액" Long
  - actionCell 50 "변경" Cell 편집:actionCell
  - depositName 150 "예금계좌" Text
  - note 250 "적요" Text

#### 이벤트
[E0] 화면 열림 (생성자 L57-61) → settings()
[E1] insertButton[등록].Select (L70) → insertRow()
[E2] deleteButton[삭제].Select (L76) → deleteRow()
       └ [E4] messageBox.DialogHide [YES] (L275) → delete()
[E3] grid.RowClick (L83) → journalRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setJournal() | L149-151 | 공개 메서드 | 상태 처리 | 업무 |
| private journalRetrieve() | L153-156 | E3,buildGrid,insertRow | 상태 처리 | 업무 |
| public retrieve() | L158-179 | 공개 메서드 | 서비스 ast.Ast07_Settle.selectByTrId(trId) | 업무 |
| public gridClear() | L181-183 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L261-271 | E1 | 조회창 Ast07_Lookup_ForSettle 열기 | 업무 |
| public deleteRow() | L273-284 | E2 | ConfirmBox → E4 | 업무 |
| private delete() | L286-338 | E4 | 미선택 시 alert "삭제대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast07_Settle.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L340-352 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private settings() | L63-103 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L105-136 | 필드 초기화 | 조회창 Ast07_Lookup_ForSettle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('settleDate', 110, '결제일자'),  // L123
  gb.double('forSettleAmt', 100, '외화결제금액'),  // L124
  gb.double('fxRate', 100, '적용환율'),  // L125
  gb.long('settleAmt', 120, '원화결제금액'),  // L126
  // ⚠ 대응 없음 (GridBuilder L127) addCell
  gb.text('depositName', 150, '예금계좌'),  // L128 SQL 계산 컬럼(selectByTrId: ast01_class_tree_nm)
  gb.text('note', 250, '적요'),  // L129
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Ast07_Lookup_ForSettle (`client/vi/ast/Ast07_Lookup_ForSettle.java`, 356줄)

- 입력·하위 화면: `settleDate` MyDateField, `trCode` TextField, `depositId` LongField, `fxRate` DoubleField, `forSettleAmt` DoubleField, `settleAmt` LongField, `forAmt` DoubleField, `note` TextField, `depositName` CommonComboBoxField("sys.Sys00_Common.selectForDeposit")

#### 이벤트
[E0] 화면 열림 (생성자 L74-94) → buildGrid(), setting(), getEditor(), show()
[E1] forAmt[외화 미수/미지급금액].ValueChange (L158) → setSettleAmt()
[E2] forSettleAmt[외화 결제금액].ValueChange (L165) → setSettleAmt()
[E3] fxRate[적용환율].ValueChange (L171) → setSettleAmt()
[E4] depositName[예금계좌].Collapse (L181) → 인라인 L181-186 (new CollapseHandler() { @Override pub…)
[E5] updateButton[저장].Select (L188) → preUpdate()
[E6] closeButton[닫기].Select ["NEW".equals(actionName)] (L194) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L96-135 | 공개 메서드 | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| public open() | L137-150 | openNew | 상태 처리 | 업무 |
| private setting() | L152-206 | 생성자 | 서비스 sys.Sys00_Common.selectForDeposit | 업무 |
| private getEditor() | L214-253 | 생성자 | 상태 처리 | 업무 |
| private setSettleAmt() | L255-261 | E1,E2,E3 | 상태 처리 | 업무 |
| public preUpdate() | L263-307 | E5 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L309-332 | preUpdate | 서비스 ast.Ast07_Settle.update | 업무 |
| private updateDepositBook() | L334-346 | update | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L208-212 | 생성자 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L348-350 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L352-354 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Lookup_TrForIntrinsic (`client/vi/ast/Ast06_Lookup_TrForIntrinsic.java`, 576줄)

- 입력·하위 화면: `date` MyDateField, `trCode` TextField, `corpId` LongField, `astClassTreeId` LongField, `depositId` LongField, `amt` LongField, `forAmt` DoubleField, `fxRate` DoubleField, `note` TextField, `trName` LookupTriggerField, `corpName` LookupTriggerField, `classTreeFullName` LookupTriggerField, `curCode` ComboBoxField("CurCode"), `settleMngTrue` Radio, `settleMngFalse` Radio, `depositName` CommonComboBoxField("sys.Sys00_Common.selectForDeposit"), `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorp` Sys15_Lookup_Corp, `lookupInfo` Ast01_Lookup_Info

#### 이벤트
[E0] 화면 열림 (생성자 L98-100) → 초기화
[E1] fxRate.ValueChange (L178) → setKorAmt()
[E2] forAmt[외화금액].ValueChange (L184) → setKorAmt()
[E3] settleMngToggleGroup.ValueChange (L197) → 인라인 L197-210 (new ValueChangeHandler<HasValue<Boole…)
[E4] depositName[sys.Sys00_Common.selectForDeposit].Collapse (L216) → 인라인 L216-221 (new CollapseHandler() { @Override pub…)
[E5] trName[거래유형].TriggerClick (L225) → 인라인 L225-240 (new TriggerClickHandler(){ @Override …)
[E6] corpName[거래처].TriggerClick [result != null] (L243) → 인라인 L243-261 (new TriggerClickHandler(){ @Override …)
[E7] classTreeFullName.TriggerClick [result != null] (L264) → 인라인 L264-279 (new TriggerClickHandler(){ @Override …)
[E8] updateButton[저장].Select (L281) → preUpdate()
[E9] journalButton[분개재생성].Select (L287) → createJournal()
[E10] closeButton[닫기].Select ["NEW".equals(actionName)] (L293) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L102-116 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L118-171 | openNew | 상태 처리 | 업무 |
| private setting() | L173-305 | open | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Sys15_Lookup_Corp 열기, 조회창 Ast01_Lookup_Info 열기, 서비스 sys.Sys00_Common.selectForDeposit | 업무 |
| private setKorAmt() | L307-321 | E1,E2 | 상태 처리 | 업무 |
| private getEditor() | L323-385 | open | 상태 처리 | 업무 |
| public preUpdate() | L387-440 | E8 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L442-461 | preUpdate | 서비스 ast.Ast06_Tr.update | 업무 |
| private createJournal() | L463-528 | E9,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L530-552 | createJournal | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private updateDepositBook() | L554-566 | success | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setHtmlStyle() | L568-570 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L572-574 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={createJournal}>분개재생성</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Grid_ForJournal (`client/vi/ast/Ast06_Grid_ForJournal.java`, 145줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {modiButton}
- 입력·하위 화면: `lookupModiJournal` Act02_Lookup_ModiForJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - trName 120 "거래유형" Text
  - drAccountCode 100 "계정코드" TextCenter 편집:"456EA6"
  - drAstAccountName 350 "계정과목" TextArea2 편집:"456EA6"
  - drForAmt 100 "외화금액" Double 편집:"456EA6"
  - drAmt 100 "원화금액" Long 편집:"456EA6"
  - drNote 100 "적요" TextArea2 편집:"456EA6"
  - crAccountCode 100 "계정코드" TextCenter 편집:"DD5E5E"
  - crAstAccountName 350 "계정과목" TextArea2 편집:"DD5E5E"
  - crForAmt 100 "외화금액" Double 편집:"DD5E5E"
  - crAmt 100 "원화금액" Long 편집:"DD5E5E"
  - crNote 100 "적요" TextArea2 편집:"DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L41-58) → settings()
[E1] modiButton[변경].Select (L61) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L103-107 | E1 | 상태 처리 | 업무 |
| public gridClear() | L109-111 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L114-127 | E1 | 서비스 act.Act03_JournalDtl.selectByJournalId(journalId) | 업무 |
| public update() | L130-131 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L134-135 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L138-139 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L60-73 | 생성자 | 조회창 Act02_Lookup_ModiForJournal 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L75-101 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L141-144 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L78 newHeaderGroupMap03newHeaderGroupConfigsetHtmlGridStyle15 100 "차변" (act03_new_header_group_map03new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L79 newHeaderGroupMap08newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map08new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.text('trNm', 120, '거래유형'),  // L82
  gb.textCenter('drAccountCd', 100, '계정코드'),  // L83
  // ⚠ 대응 없음 (GridBuilder L84) addTextArea2
  gb.double('drForAmt', 100, '외화금액'),  // L85
  gb.long('drAmt', 100, '원화금액'),  // L86
  // ⚠ 대응 없음 (GridBuilder L87) addTextArea2
  gb.textCenter('crAccountCd', 100, '계정코드'),  // L88
  // ⚠ 대응 없음 (GridBuilder L89) addTextArea2
  gb.double('crForAmt', 100, '외화금액'),  // L90
  gb.long('crAmt', 100, '원화금액'),  // L91
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

