# Ast06_Tab_TrFinance

- 종류: 화면
- 메뉴: 고유자산 > 20. 고유자산 거래처리 > 금융상품 거래처리 (#1158)
- 파일: `client/vi/ast/Ast06_Tab_TrFinance.java`
- 함께 쓰는 클래스 4개:
  - `Ast06_Lookup_TrFinance` `client/vi/ast/Ast06_Lookup_TrFinance.java`
  - `Ast09_Lookup_Book` `client/vi/ast/Ast09_Lookup_Book.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
  - `Ast05_Lookup_TrCodeWindow` `client/vi/ast/Ast05_Lookup_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_TrFinance:901 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_TrFinance:859, Ast06_Tab_TrFinance:487 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast01_ClassTree.selectById` | Ast06_Lookup_TrFinance:392 | [`Ast01_ClassTree.java:26`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast05_TrCode.selectByWindowClassName` | Ast05_Lookup_TrCodeWindow:180 | [`Ast05_TrCode.java:43`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrFinance:502 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_TrFinance:929, Ast06_Tab_TrFinance:357 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectByPayCode` | Ast06_Tab_TrFinance:425 | [`Ast06_Tr.java:43`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByPayCode`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_TrFinance:953, Ast06_Tab_TrFinance:535 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast06_Tr.updateFinance` | Ast06_Lookup_TrFinance:879 | [`Ast06_Tr.java:358`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast08_tr_finance)` 동적 INSERT/UPDATE → [`ast08_tr_finance.selectById`](../../ast/sql/ast08_tr_finance.md) |
| `ast.Ast09_Book.selectByHoldDate` | Ast09_Lookup_Book:166 | [`Ast09_Book.java:28`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_get_sellpossibleqty`, `f_nvl`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrFinance (`client/vi/ast/Ast06_Tab_TrFinance.java`, 553줄)

- 레이아웃: north=vlcHeader, center=vlc, south=gridJournal
- 툴바 `buttonBarHeader01`: 조회기간: {startDate} ~: {closeDate} 거래유형: {trName} 거래계좌: {corpAccountName} {retrieveButton} {downloadButton} {downloadForm}
- 툴바 `buttonBarHeader02`: 종목: {classTreeName} 검색: {searchText}
- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `trCodeId` LongField, `trName` LookupTriggerField 빈칸="전체", `corpAccountId` LongField, `corpAccountName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래유형/거래처/종목유형/종목/적요", `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupInfo` Ast01_Lookup_Info, `lookupTr` Ast06_Lookup_TrFinance, `lookup` Act80_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - trName 180 "거래유형" Text
  - corpAccountName 200 "거래처" Text
  - astClassName 100 "종목유형" TextCenter
  - classTreeName 200 "종목" Text
  - qty 100 "거래수량" Double
  - price 70 "거래단가" Double
  - trAmt 120 "거래금액" Long
  - taxSum 70 "제세금" Long
  - fee 70 "수수료" Long
  - amt 120 "결제금액" Long
  - actionCell 50 "변경" Cell 편집:actionCell
  - apprCnt 55 "연관문서" TextCenter
  - actionCell 25 " " Cell 편집:actionCell2
  - settleMngYn 80 "미수/미지급" Boolean
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
| private insertRow() | L442-453 | E6 | 조회창 Ast06_Lookup_TrFinance 열기 | 업무 |
| private deleteRow() | L455-473 | E7 | ConfirmBox → E10 | 업무 |
| private delete() | L475-531 | E10 | 미선택 시 alert "삭제대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L533-545 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L315-394 | 필드 초기화 | 조회창 Ast06_Lookup_TrFinance 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 ast.Ast06_Tr.selectById(trId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L547-549 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L550-552 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L374
  gb.text('trNm', 180, '거래유형'),  // L375
  gb.text('corpAccountNm', 200, '거래처'),  // L376
  gb.textCenter('astClassNm', 100, '종목유형'),  // L377
  gb.text('classTreeNm', 200, '종목'),  // L378
  gb.double('qty', 100, '거래수량'),  // L379
  gb.double('price', 70, '거래단가'),  // L380
  gb.long('trAmt', 120, '거래금액'),  // L381
  gb.long('taxSum', 70, '제세금'),  // L382
  gb.long('fee', 70, '수수료'),  // L383
  gb.long('amt', 120, '결제금액'),  // L384
  // ⚠ 대응 없음 (GridBuilder L385) addCell
  gb.textCenter('apprCnt', 55, '연관문서'),  // L386
  // ⚠ 대응 없음 (GridBuilder L387) addCell
  gb.boolean('settleMngYn', 80, '미수/미지급'),  // L388
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

### Ast06_Lookup_TrFinance (`client/vi/ast/Ast06_Lookup_TrFinance.java`, 974줄)

- 입력·하위 화면: `date` MyDateField, `trCode` TextField, `astClassTreeId` LongField, `amt` LongField, `fee` LongField, `note` TextField, `curCode` TextField, `trName` LookupTriggerField, `classTreeFullName` LookupTriggerField, `depositId` LongField, `depositName` LookupTriggerField, `corpId` LongField, `corpName` LookupTriggerField, `accountId` LongField, `accountName` TextField, `qty` DoubleField, `price` DoubleField, `trAmt` LongField, `trTax` LongField, `corpTax` LongField, `localTax` LongField, `intAmt` LongField, `acrIntAmt` LongField, `pl` LongField, `holdQty` DoubleField, `holdBookAmt` LongField, `holdAcrIntAmt` LongField, `trUnit` LongField, `lockUpDate` MyDateField, `sellPossibleQty` DoubleField, `settleMngTrue` Radio, `settleMngFalse` Radio, `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupBook` Ast09_Lookup_Book, `lookupInfo` Ast01_Lookup_Info, `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L155-157) → 초기화
[E1] settleMngToggleGroup.ValueChange (L294) → 인라인 L294-307 (new ValueChangeHandler<HasValue<Boole…)
[E2] trName[거래유형].TriggerClick (L311) → setFieldInit()
[E3] classTreeFullName.TriggerClick [bookYn == null] (L341) → setFieldInit()
[E4] depositName.TriggerClick [result == null] (L425) → 인라인 L425-443 (new TriggerClickHandler(){ @Override …)
[E5] corpName.TriggerClick [result == null] (L447) → 인라인 L447-469 (new TriggerClickHandler(){ @Override …)
[E6] updateButton[저장].Select (L471) → preUpdate()
[E7] journalButton[분개재생성].Select (L477) → createJournal()
[E8] closeButton[닫기].Select ["NEW".equals(actionName)] (L483) → hide()
[E9] qty[거래수량].ValueChange (L517) → setTrAmt()
[E10] price[거래단가].ValueChange (L524) → setTrAmt()
[E11] trAmt[거래금액].ValueChange (L531) → setSettleAmt()
[E12] trTax[거래세].ValueChange (L538) → setSettleAmt()
[E13] fee[수수료].ValueChange (L545) → setSettleAmt()
[E14] acrIntAmt.ValueChange (L559) → setSettleAmt()
[E15] intAmt.ValueChange (L566) → setSettleAmt()
[E16] corpTax[법인세].ValueChange (L573) → setSettleAmt()
[E17] localTax[지방세].ValueChange (L580) → setSettleAmt()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L159-173 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L175-244 | openNew | 상태 처리 | 업무 |
| private setting() | L246-497 | open | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Ast09_Lookup_Book 열기, 조회창 Ast01_Lookup_Info 열기, 조회창 Ast01_Lookup_CorpAccount 열기, 서비스 ast.Ast01_ClassTree.selectById(classTreeId) | 업무 |
| private setFieldInit() | L499-513 | E2,E3 | 상태 처리 | 업무 |
| private setValueChangeHandler() | L515-586 | setting | 상태 처리 | 업무 |
| private setTrAmt() | L588-604 | E9,E10 | 상태 처리 | 업무 |
| private setSettleAmt() | L606-671 | E11,E12,E13,E14,E15,E16,E17,setTrAmt | 상태 처리 | 업무 |
| private getEditor() | L673-784 | open | 상태 처리 | 업무 |
| public preUpdate() | L786-847 | E6 | 상태 처리 | 업무 |
| public preUpdate2() | L849-874 | preUpdate | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L876-897 | preUpdate2 | 서비스 ast.Ast06_Tr.updateFinance | 업무 |
| private createJournal() | L899-922 | E7,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L924-946 | createJournal | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private updateDepositBook() | L948-964 | success | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setHtmlStyle() | L966-968 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L970-972 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={createJournal}>분개재생성</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast09_Lookup_Book (`client/vi/ast/Ast09_Lookup_Book.java`, 182줄)

- 툴바 `buttonBar`: 보유일: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="보관처명/계좌명/자산명", `stdDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스):
  - keepAccountName 200 "계좌" Text
  - astClassName 150 "종목유형" Text
  - astClassTreeName 200 "종목" Text
  - holdQty 100 "보유수량" Double
  - purAmt 120 "보유취득금액" Long
  - bookAmt 120 "보유장부금액" Long
  - lockUpDate 100 "매도제한일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L62-78) → show()
[E1] grid.CellDoubleClick [callbackResult != null] (L81) → hide()
[E2] confirmButton[확인].Select [callbackResult != null] (L91) → hide()
[E3] cancleButton[닫기].Select (L105) → hide()
[E4] retrieveButton[조회].Select (L111) → retrieve()
[E5] searchText.KeyPress [Enter] (L123) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-60 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L80-137 | open | 미선택 시 alert "보유자산을 선택해주세요." | 업무 |
| public retrieve() | L156-172 | E4,E5,open | 서비스 ast.Ast09_Book.selectByHoldDate(companyId, holdDate, astType, abroType, searchText) | 업무 |
| public buildGrid() | L139-154 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L174-176 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L178-180 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('keepAccountNm', 200, '계좌'),  // L145 SQL 계산 컬럼(selectByHoldDate: ast2.ast01_class_tree_nm)
  gb.text('astClassNm', 150, '종목유형'),  // L146 SQL 계산 컬럼(selectByHoldDate: f_cdnm('ItemMClassCode',ast1.ast01_item…)
  gb.text('astClassTreeNm', 200, '종목'),  // L147 SQL 계산 컬럼(selectByHoldDate: ast1.ast01_class_tree_nm)
  gb.double('holdQty', 100, '보유수량'),  // L148
  gb.long('purAmt', 120, '보유취득금액'),  // L149
  gb.long('bookAmt', 120, '보유장부금액'),  // L150
  gb.date('lockUpDate', 100, '매도제한일'),  // L151
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

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

