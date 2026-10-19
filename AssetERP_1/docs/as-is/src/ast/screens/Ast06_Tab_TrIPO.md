# Ast06_Tab_TrIPO

- 종류: 화면
- 메뉴: 고유자산 > 20. 고유자산 거래처리 > 청약처리 (#1288)
- 파일: `client/vi/ast/Ast06_Tab_TrIPO.java`
- 함께 쓰는 클래스 4개:
  - `Ast06_Lookup_TrIPO` `client/vi/ast/Ast06_Lookup_TrIPO.java`
  - `Ast06_Lookup_CreateIpoAstClass` `client/vi/ast/Ast06_Lookup_CreateIpoAstClass.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
  - `Ast05_Lookup_TrCodeWindow` `client/vi/ast/Ast05_Lookup_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_TrIPO:810 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_TrIPO:768, Ast06_Tab_TrIPO:487 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast01_ClassTree.insertIpo` | Ast06_Lookup_CreateIpoAstClass:84 | [`Ast01_ClassTree.java:272`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.checkAstClassTreeName`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.insert`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectIpoAssignClassTreeId`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectSeqByParentId`](../../ast/sql/ast01_class_tree.md), [`ast10_manager.insert`](../../ast/sql/ast10_manager.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByCompanyId`](../../org/sql/org01_code.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `ast.Ast01_ClassTree.selectById` | Ast06_Lookup_TrIPO:311 | [`Ast01_ClassTree.java:26`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast05_TrCode.selectByWindowClassName` | Ast05_Lookup_TrCodeWindow:180 | [`Ast05_TrCode.java:43`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrIPO:502 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_TrIPO:838, Ast06_Tab_TrIPO:357 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectByPayCode` | Ast06_Tab_TrIPO:425 | [`Ast06_Tr.java:43`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByPayCode`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_TrIPO:862, Ast06_Tab_TrIPO:535 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast06_Tr.updateFinance` | Ast06_Lookup_TrIPO:788 | [`Ast06_Tr.java:358`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast08_tr_finance)` 동적 INSERT/UPDATE → [`ast08_tr_finance.selectById`](../../ast/sql/ast08_tr_finance.md) |
| `sys.Sys12_Calendar.selectBizDate` | Ast06_Lookup_TrIPO:534 | [`Sys12_Calendar.java:60`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.bizDate`](../../sys/sql/sys12_calendar.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`org01_code`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_ast_class_tree_cd`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_biz_date`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrIPO (`client/vi/ast/Ast06_Tab_TrIPO.java`, 553줄)

- 레이아웃: north=vlcHeader, center=vlc, south=gridJournal
- 툴바 `buttonBarHeader01`: 조회기간: {startDate} ~: {closeDate} 거래유형: {trName} 거래계좌: {corpAccountName} {retrieveButton} {downloadButton} {downloadForm}
- 툴바 `buttonBarHeader02`: 종목: {classTreeName} 검색: {searchText}
- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `trCodeId` LongField, `trName` LookupTriggerField 빈칸="전체", `corpAccountId` LongField, `corpAccountName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래유형/거래처/종목유형/종목/적요", `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupInfo` Ast01_Lookup_Info, `lookupTr` Ast06_Lookup_TrIPO, `lookup` Act80_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - trName 175 "거래유형" Text
  - corpAccountName 200 "거래처" Text
  - astClassName 100 "종목유형" TextCenter
  - classTreeName 200 "종목" Text
  - qty 100 "거래수량" Double
  - price 80 "거래단가" Double
  - trAmt 120 "거래금액" Long
  - fee 100 "수수료" Long
  - amt 120 "결제금액" Long
  - lockUpPeriodName 100 "확약기간" TextCenter
  - actionCell 50 "변경" Cell 편집:actionCell
  - apprCnt 55 "연관문서" TextCenter
  - actionCell 25 " " Cell 편집:actionCell2
  - depositName 150 "예금계좌" Text
  - note 250 "적요" Text
  - personName 80 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L95-122) → setting()
[E1] trName.TriggerClick [result != null] (L142) → 인라인 L142-160 (new TriggerClickHandler(){ @Override …)
[E2] corpAccountName.TriggerClick [result != null] (L165) → 인라인 L165-183 (new TriggerClickHandler() { @Override…)
[E3] classTreeName.TriggerClick [result != null] (L188) → 인라인 L188-206 (new TriggerClickHandler(){ @Override …)
[E4] searchText.KeyPress [Enter] (L210) → retrieve()
[E5] retrieveButton[조회].Select (L244) → retrieve()
[E6] insertButton[등록].Select (L250) → insertRow()
[E7] deleteButton[삭제].Select (L256) → deleteRow()
       └ [E10] msgBox.DialogHide [YES] (L458) → delete()
[E8] downloadButton[엑셀다운로드].Select (L262) → 인라인 L262-300 (new SelectHandler(){ @Override public…)
[E9] grid.RowClick (L305) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L124-313 | 생성자 | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Ast01_Lookup_CorpAccount 열기, 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L396-435 | E4,E5,setting | 서비스 ast.Ast06_Tr.selectByPayCode(startDate, closeDate, companyId, userId, orgId, corpId, payCode, assetType, abroType, accountId, windowClassName, searchText, classTreeId, classTreeId, trCodeId, trCodeId), 건수 표시 | 업무 |
| private retrievePage() | L437-440 | E9,retrieve | 상태 처리 | 업무 |
| private insertRow() | L442-453 | E6 | 조회창 Ast06_Lookup_TrIPO 열기 | 업무 |
| private deleteRow() | L455-473 | E7 | ConfirmBox → E10 | 업무 |
| private delete() | L475-531 | E10 | 미선택 시 alert "삭제대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L533-545 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L315-394 | 필드 초기화 | 조회창 Ast06_Lookup_TrIPO 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 ast.Ast06_Tr.selectById(trId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L547-549 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L550-552 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L374
  gb.text('trNm', 175, '거래유형'),  // L375
  gb.text('corpAccountNm', 200, '거래처'),  // L376
  gb.textCenter('astClassNm', 100, '종목유형'),  // L377
  gb.text('classTreeNm', 200, '종목'),  // L378
  gb.double('qty', 100, '거래수량'),  // L379
  gb.double('price', 80, '거래단가'),  // L380
  gb.long('trAmt', 120, '거래금액'),  // L381
  gb.long('fee', 100, '수수료'),  // L382
  gb.long('amt', 120, '결제금액'),  // L383
  gb.textCenter('lockUpPeriodNm', 100, '확약기간'),  // L384
  // ⚠ 대응 없음 (GridBuilder L385) addCell
  gb.textCenter('apprCnt', 55, '연관문서'),  // L386
  // ⚠ 대응 없음 (GridBuilder L387) addCell
  gb.text('depositName', 150, '예금계좌'),  // L389
  gb.text('note', 250, '적요'),  // L390
  gb.textCenter('personNm', 80, '등록자'),  // L391
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>
4. <Button type="download" onClick={() => /* 인라인 L262-300 (new SelectHandler(){ @Override public…) */}>엑셀다운로드</Button>

### Ast06_Lookup_TrIPO (`client/vi/ast/Ast06_Lookup_TrIPO.java`, 883줄)

- 입력·하위 화면: `date` MyDateField, `trCode` TextField, `astClassTreeId` LongField, `amt` LongField, `fee` LongField, `note` TextField, `curCode` TextField, `trName` LookupTriggerField, `classTreeFullName` LookupTriggerField, `depositId` LongField, `depositName` LookupTriggerField, `corpId` LongField, `corpName` LookupTriggerField, `accountId` LongField, `accountName` TextField, `qty` DoubleField, `price` DoubleField, `trAmt` LongField, `trUnit` LongField, `lockUpPeriodCode` TextField, `lockUpPeriodName` ComboBoxField("LockUpPeriodCode"), `lockUpDate` MyDateField, `listDate` MyDateField, `settleMngTrue` Radio, `settleMngFalse` Radio, `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupInfo` Ast01_Lookup_Info, `createIpoLookup` Ast06_Lookup_CreateIpoAstClass, `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L132-134) → 초기화
[E1] settleMngToggleGroup.ValueChange (L234) → 인라인 L234-247 (new ValueChangeHandler<HasValue<Boole…)
[E2] trName[거래유형].TriggerClick (L251) → setFieldInit(), setEnable()
[E3] classTreeFullName.TriggerClick (L292) → 서비스 ast.Ast01_ClassTree.selectById(classTreeId), 메시지 "거래유형을 선택해주세요"
[E4] makeAst.Click (L332) → 메시지 "거래유형을 선택해주세요"
[E5] depositName.TriggerClick [result == null] (L368) → 인라인 L368-386 (new TriggerClickHandler(){ @Override …)
[E6] corpName[보관계좌].TriggerClick [result == null] (L390) → 인라인 L390-412 (new TriggerClickHandler(){ @Override …)
[E7] updateButton[저장].Select (L414) → preUpdate()
[E8] journalButton[분개재생성].Select (L420) → createJournal()
[E9] closeButton[닫기].Select ["NEW".equals(actionName)] (L426) → hide()
[E10] qty[청약수량].ValueChange (L454) → setTrAmt()
[E11] price[공모단가].ValueChange (L461) → setTrAmt()
[E12] trAmt[청약금액].ValueChange (L468) → setSettleAmt()
[E13] fee[청약수수료].ValueChange (L475) → setSettleAmt()
[E14] lockUpPeriodName[보유의무확약].Collapse (L482) → setLockUpDate()
[E15] listDate[상장일자].ValueChange (L489) → setLockUpDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L136-150 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L152-209 | openNew | 상태 처리 | 업무 |
| private setting() | L211-440 | open | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Ast01_Lookup_Info 열기, 조회창 Ast06_Lookup_CreateIpoAstClass 열기, 조회창 Ast01_Lookup_CorpAccount 열기, 서비스 ast.Ast01_ClassTree.selectById(classTreeId) | 업무 |
| private setFieldInit() | L442-450 | E2 | 상태 처리 | 업무 |
| private setValueChangeHandler() | L452-495 | setting | 상태 처리 | 업무 |
| private setLockUpDate() | L497-548 | E14,E15 | 서비스 sys.Sys12_Calendar.selectBizDate | 업무 |
| private setTrAmt() | L550-566 | E10,E11 | 상태 처리 | 업무 |
| private setSettleAmt() | L568-581 | E12,E13,setTrAmt | 상태 처리 | 업무 |
| private getEditor() | L583-674 | open | 상태 처리 | 업무 |
| private setEnable() | L676-718 | E2,open | 상태 처리 | 업무 |
| public preUpdate() | L720-783 | E7 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L785-806 | preUpdate | 서비스 ast.Ast06_Tr.updateFinance | 업무 |
| private createJournal() | L808-831 | E8,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L833-855 | createJournal | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private updateDepositBook() | L857-873 | success | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setHtmlStyle() | L875-877 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L879-881 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={createJournal}>분개재생성</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Lookup_CreateIpoAstClass (`client/vi/ast/Ast06_Lookup_CreateIpoAstClass.java`, 118줄)

- 입력·하위 화면: `astClassTreeName` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L35-54) → show()
[E1] createButton[생성].Select (L63) → insertIpo()
[E2] closeButton[닫기].Select (L70) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-59 | 공개 메서드 | 상태 처리 | 업무 |
| private insertIpo() | L78-108 | E1 | 서비스 ast.Ast01_ClassTree.insertIpo(companyId, personId, orgId, astClassTreeName) | 업무 |
| private settings() | L61-76 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L110-112 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L114-116 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={insertIpo}>생성</Button>
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

