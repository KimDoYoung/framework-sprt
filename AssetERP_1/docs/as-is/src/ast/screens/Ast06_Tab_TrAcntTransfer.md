# Ast06_Tab_TrAcntTransfer

- 종류: 화면
- 메뉴: 고유자산 > 20. 고유자산 거래처리 > 금융상품 계좌대체 (#1208)
- 파일: `client/vi/ast/Ast06_Tab_TrAcntTransfer.java`
- 함께 쓰는 클래스 3개:
  - `Ast06_Lookup_TrAcntTransfer` `client/vi/ast/Ast06_Lookup_TrAcntTransfer.java`
  - `Ast09_Lookup_Book` `client/vi/ast/Ast09_Lookup_Book.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_TrAcntTransfer:555 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_TrAcntTransfer:516, Ast06_Tab_TrAcntTransfer:397 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrAcntTransfer:412 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_TrAcntTransfer:582, Ast06_Tab_TrAcntTransfer:276 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectByPayCode` | Ast06_Tab_TrAcntTransfer:335 | [`Ast06_Tr.java:43`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByPayCode`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_TrAcntTransfer:603, Ast06_Tab_TrAcntTransfer:445 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast06_Tr.updateFinance` | Ast06_Lookup_TrAcntTransfer:535 | [`Ast06_Tr.java:358`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast08_tr_finance)` 동적 INSERT/UPDATE → [`ast08_tr_finance.selectById`](../../ast/sql/ast08_tr_finance.md) |
| `ast.Ast09_Book.selectByHoldDate` | Ast09_Lookup_Book:166 | [`Ast09_Book.java:28`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_get_sellpossibleqty`, `f_nvl`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrAcntTransfer (`client/vi/ast/Ast06_Tab_TrAcntTransfer.java`, 463줄)

- 레이아웃: north=vlcHeader, center=vlc, south=gridJournal
- 툴바 `buttonBarHeader01`: 조회기간: {startDate} ~: {closeDate} 거래계좌: {corpAccountName} 검색: {searchText} {retrieveButton}
- 툴바 `buttonBarHeader02`: 종목: {classTreeName}
- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `corpAccountId` LongField, `corpAccountName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래유형/거래처/종목유형/종목/적요", `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupInfo` Ast01_Lookup_Info, `lookupTr` Ast06_Lookup_TrAcntTransfer, `lookup` Act80_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - accountName 200 "출고계좌" Text
  - inAccountName 200 "입고계좌" Text
  - astClassName 100 "종목유형" TextCenter
  - classTreeName 200 "종목" Text
  - qty 100 "수량" Double
  - trAmt 120 "취득금액" Long
  - financeBookAmt 120 "장부금액" Long
  - fee 70 "수수료" Long
  - actionCell 50 "변경" Cell 편집:actionCell
  - apprCnt 55 "연관문서" TextCenter
  - actionCell 25 " " Cell 편집:actionCell2
  - note 250 "적요" Text
  - personName 80 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L84-111) → setting()
[E1] corpAccountName.TriggerClick [result != null] (L130) → 인라인 L130-148 (new TriggerClickHandler() { @Override…)
[E2] classTreeName.TriggerClick [result != null] (L153) → 인라인 L153-171 (new TriggerClickHandler(){ @Override …)
[E3] searchText.KeyPress [Enter] (L175) → retrieve()
[E4] retrieveButton[조회].Select (L202) → retrieve()
[E5] insertButton[등록].Select (L208) → insertRow()
[E6] deleteButton[삭제].Select (L214) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L368) → delete()
[E7] grid.RowClick (L224) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L113-232 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기, 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L311-345 | E3,E4,setting | 서비스 ast.Ast06_Tr.selectByPayCode(startDate, closeDate, companyId, userId, orgId, corpId, trCodeId, payCode, assetType, abroType, accountId, windowClassName, searchText, classTreeId, classTreeId), 건수 표시 | 업무 |
| private retrievePage() | L347-350 | E7,retrieve | 상태 처리 | 업무 |
| private insertRow() | L352-363 | E5 | 조회창 Ast06_Lookup_TrAcntTransfer 열기 | 업무 |
| private deleteRow() | L365-383 | E6 | ConfirmBox → E8 | 업무 |
| private delete() | L385-441 | E8 | 미선택 시 alert "삭제대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L443-455 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L234-309 | 필드 초기화 | 조회창 Ast06_Lookup_TrAcntTransfer 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 ast.Ast06_Tr.selectById(trId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L457-459 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L460-462 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L293
  gb.text('accountNm', 200, '출고계좌'),  // L294
  gb.text('inAccountNm', 200, '입고계좌'),  // L295
  gb.textCenter('astClassNm', 100, '종목유형'),  // L296
  gb.text('classTreeNm', 200, '종목'),  // L297
  gb.double('qty', 100, '수량'),  // L298
  gb.long('trAmt', 120, '취득금액'),  // L299
  gb.long('bookAmt', 120, '장부금액'),  // L300
  gb.long('fee', 70, '수수료'),  // L301
  // ⚠ 대응 없음 (GridBuilder L302) addCell
  gb.textCenter('apprCnt', 55, '연관문서'),  // L303
  // ⚠ 대응 없음 (GridBuilder L304) addCell
  gb.text('note', 250, '적요'),  // L305
  gb.textCenter('personNm', 80, '등록자'),  // L306
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>

### Ast06_Lookup_TrAcntTransfer (`client/vi/ast/Ast06_Lookup_TrAcntTransfer.java`, 623줄)

- 입력·하위 화면: `date` MyDateField, `trCode` TextField, `astClassTreeId` LongField, `corpId` LongField, `fee` LongField, `note` TextField, `trName` LookupTriggerField, `classTreeFullName` LookupTriggerField, `depositId` LongField, `depositName` LookupTriggerField, `accountId` LongField, `accountName` TextField, `inAccountId` LongField, `inAccountName` LookupTriggerField, `qty` DoubleField, `trAmt` LongField, `bookAmt` LongField, `holdQty` DoubleField, `holdPurAmt` LongField, `settleMngTrue` Radio, `settleMngFalse` Radio, `lookupBook` Ast09_Lookup_Book, `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L117-119) → 초기화
[E1] settleMngToggleGroup.ValueChange (L213) → 인라인 L213-226 (new ValueChangeHandler<HasValue<Boole…)
[E2] classTreeFullName.TriggerClick [result != null] (L230) → setFieldInit()
[E3] inAccountName[입고계좌].TriggerClick [result == null] (L257) → 인라인 L257-275 (new TriggerClickHandler(){ @Override …)
[E4] depositName.TriggerClick [result == null] (L289) → 인라인 L289-307 (new TriggerClickHandler(){ @Override …)
[E5] updateButton[저장].Select (L309) → preUpdate()
[E6] journalButton[분개재생성].Select (L315) → createJournal()
[E7] closeButton[닫기].Select ["NEW".equals(actionName)] (L321) → hide()
[E8] qty[입고수량].ValueChange (L354) → 인라인 L354-380 (new ValueChangeHandler<Double>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L121-139 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L141-192 | openNew | 상태 처리 | 업무 |
| private setting() | L194-335 | open | 조회창 Ast09_Lookup_Book 열기, 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private setFieldInit() | L337-350 | E2 | 상태 처리 | 업무 |
| private setValueChangeHandler() | L352-381 | setting | 상태 처리 | 업무 |
| private getEditor() | L383-467 | open | 상태 처리 | 업무 |
| public preUpdate() | L469-531 | E5 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L533-552 | preUpdate | 서비스 ast.Ast06_Tr.updateFinance | 업무 |
| private createJournal() | L554-575 | E6,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L577-599 | createJournal | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private updateDepositBook() | L601-613 | success | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setHtmlStyle() | L615-617 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L619-621 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

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

