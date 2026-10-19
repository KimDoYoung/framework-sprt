# Ast06_Tab_TrDepositInt

- 종류: 화면
- 메뉴: 고유자산 > 40. 예금관리 > 예금/예치금 이자수령 (#1472)
- 메뉴: 관리회계 > 11. 특수회계처리 > 예금/예치금 이자수령 (#1205)
- 파일: `client/vi/ast/Ast06_Tab_TrDepositInt.java`
- 함께 쓰는 클래스 2개:
  - `Ast06_Lookup_TrDepositInt` `client/vi/ast/Ast06_Lookup_TrDepositInt.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_TrDepositInt:355 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_TrDepositInt:316, Ast06_Tab_TrDepositInt:331 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrDepositInt:346 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_TrDepositInt:388, Ast06_Tab_TrDepositInt:213 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectByPayCode` | Ast06_Tab_TrDepositInt:269 | [`Ast06_Tr.java:43`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByPayCode`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_TrDepositInt:379 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast06_Tr.updateDepositInt` | Ast06_Lookup_TrDepositInt:335 | [`Ast06_Tr.java:412`](../../ast/services/Ast06_Tr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast08_tr_finance)` 동적 INSERT/UPDATE → [`ast08_tr_finance.selectById`](../../ast/sql/ast08_tr_finance.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrDepositInt (`client/vi/ast/Ast06_Tab_TrDepositInt.java`, 367줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 거래계좌: {corpAccountName} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `corpAccountId` LongField, `corpAccountName` LookupTriggerField 빈칸="전체", `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupTr` Ast06_Lookup_TrDepositInt, `lookup` Act80_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - classTreeName 150 "구분" Text
  - classTreeName 200 "계좌" Text
  - intAmt 150 "이자" Long
  - corpTax 100 "법인세" Long
  - localTax 100 "지방세" Long
  - amt 150 "실수령액" Long
  - actionCell 50 "변경" Cell 편집:actionCell
  - apprCnt 55 "연관문서" TextCenter
  - actionCell 25 " " Cell 편집:actionCell2
  - note 300 "적요" Text
  - personName 80 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L71-88) → setting()
[E1] corpAccountName.TriggerClick [result != null] (L107) → 인라인 L107-125 (new TriggerClickHandler() { @Override…)
[E2] retrieveButton[조회].Select (L141) → retrieve()
[E3] insertButton[등록].Select (L147) → insertRow()
[E4] deleteButton[삭제].Select (L153) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L302) → delete()
[E5] grid.RowClick (L160) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L90-169 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| public retrieve() | L246-279 | E2,setting | 서비스 ast.Ast06_Tr.selectByPayCode(startDate, closeDate, companyId, userId, orgId, trCodeId, corpId, assetType, abroType, payCode, windowClassName, classTreeId), 건수 표시 | 업무 |
| private retrievePage() | L281-284 | E5,retrieve | 상태 처리 | 업무 |
| private insertRow() | L286-297 | E3 | 조회창 Ast06_Lookup_TrDepositInt 열기 | 업무 |
| private deleteRow() | L299-317 | E4 | ConfirmBox → E6 | 업무 |
| private delete() | L319-362 | E6 | GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L171-244 | 필드 초기화 | 조회창 Ast06_Lookup_TrDepositInt 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 ast.Ast06_Tr.selectById(trId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L364-366 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L230
  gb.text('classTreeNm', 150, '구분'),  // L231
  gb.text('classTreeNm', 200, '계좌'),  // L232
  gb.long('intAmt', 150, '이자'),  // L233
  gb.long('corpTax', 100, '법인세'),  // L234
  gb.long('localTax', 100, '지방세'),  // L235
  gb.long('amt', 150, '실수령액'),  // L236
  // ⚠ 대응 없음 (GridBuilder L237) addCell
  gb.textCenter('apprCnt', 55, '연관문서'),  // L238
  // ⚠ 대응 없음 (GridBuilder L239) addCell
  gb.text('note', 300, '적요'),  // L240
  gb.textCenter('personNm', 80, '등록자'),  // L241
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Ast06_Lookup_TrDepositInt (`client/vi/ast/Ast06_Lookup_TrDepositInt.java`, 421줄)

- 입력·하위 화면: `date` MyDateField, `corpId` LongField, `astClassTreeId` LongField, `amt` LongField, `note` TextField, `corpTax` LongField, `localTax` LongField, `intAmt` LongField, `classTreeName` LookupTriggerField, `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L83-85) → 초기화
[E1] classTreeName[계좌].TriggerClick [result == null] (L157) → 인라인 L157-177 (new TriggerClickHandler(){ @Override …)
[E2] intAmt[이자금액].ValueChange (L184) → setAmt()
[E3] corpTax[법인세].ValueChange (L190) → setAmt()
[E4] localTax[지방세].ValueChange (L196) → setAmt()
[E5] updateButton[저장].Select (L203) → preUpdate()
[E6] journalButton[분개재생성].Select (L209) → createJournal()
[E7] closeButton[닫기].Select ["NEW".equals(actionName)] (L215) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L87-104 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L106-140 | openNew | 상태 처리 | 업무 |
| private setting() | L142-227 | open | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private getEditor() | L229-273 | open | 상태 처리 | 업무 |
| private setAmt() | L275-292 | E2,E3,E4 | 상태 처리 | 업무 |
| public preUpdate() | L294-331 | E5 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L333-352 | preUpdate | 서비스 ast.Ast06_Tr.updateDepositInt | 업무 |
| private createJournal() | L354-375 | E6,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L377-411 | createJournal | 서비스 ast.Ast06_Tr.updateDeposit, ast.Ast06_Tr.selectById(companyId, stdDate, trId) | 업무 |
| private setHtmlStyle() | L413-415 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L417-419 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={createJournal}>분개재생성</Button>
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

