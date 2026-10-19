# Ast06_Tab_TrForDeposit

- 종류: 화면
- 메뉴: 관리회계 > 12. 특수회계처리(외화) > 계좌이체(외화) (#1172)
- 파일: `client/vi/ast/Ast06_Tab_TrForDeposit.java`
- 함께 쓰는 클래스 2개:
  - `Ast06_Lookup_TrForDeposit` `client/vi/ast/Ast06_Lookup_TrForDeposit.java`
  - `Ast06_Grid_ForJournal` `client/vi/ast/Ast06_Grid_ForJournal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiForJournal`](../../act/components/Act02_Lookup_ModiForJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_TrForDeposit:408 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_ForJournal:118 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_TrForDeposit:358, Ast06_Tab_TrForDeposit:322 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.deleteTrDeposit` | Ast06_Tab_TrForDeposit:337 | [`Ast06_Tr.java:1391`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_TrForDeposit:447, Ast06_Tab_TrForDeposit:213 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectDepositTr` | Ast06_Tab_TrForDeposit:260 | [`Ast06_Tr.java:109`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectDepositTr`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.update` | Ast06_Lookup_TrForDeposit:377 | [`Ast06_Tr.java:333`](../../ast/services/Ast06_Tr.md) | [`act02_journal.selectByTrId`](../../act/sql/act02_journal.md), [`act02_journal.updateTrInfo`](../../act/sql/act02_journal.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_TrForDeposit:438 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast06_Tr.updateDepositSellBookAmt` | Ast06_Lookup_TrForDeposit:399 | [`Ast06_Tr.java:509`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast06_tr.updateByBookAmt`](../../ast/sql/ast06_tr.md), [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md), [`ast09_book.selectTargetBook`](../../ast/sql/ast09_book.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depositbook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrForDeposit (`client/vi/ast/Ast06_Tab_TrForDeposit.java`, 358줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 거래계좌: {corpAccountName} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `corpAccountId` LongField, `corpAccountName` LookupTriggerField 빈칸="전체", `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupTr` Ast06_Lookup_TrForDeposit, `lookup` Act80_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - classTreeName 200 "출금계좌" Text
  - depositName 200 "입금계좌" Text
  - curCode 60 "통화" TextCenter
  - fxRate 100 "적용환율" Double
  - forAmt 100 "외화금액" Double
  - amt 150 "원화금액" Long
  - fee 150 "수수료" Long
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
       └ [E6] msgBox.DialogHide [YES] (L293) → delete()
[E5] grid.RowClick (L160) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L90-169 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| public retrieve() | L247-270 | E2,setting | 서비스 ast.Ast06_Tr.selectDepositTr(startDate, closeDate, companyId, userId, orgId, assetType, abroType, accountId), 건수 표시 | 업무 |
| private retrievePage() | L272-275 | E5,retrieve | 상태 처리 | 업무 |
| private insertRow() | L277-288 | E3 | 조회창 Ast06_Lookup_TrForDeposit 열기 | 업무 |
| private deleteRow() | L290-308 | E4 | ConfirmBox → E6 | 업무 |
| private delete() | L310-353 | E6 | GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.deleteTrDeposit(체크된 행 목록) | 업무 |
| public buildGrid() | L171-245 | 필드 초기화 | 조회창 Ast06_Lookup_TrForDeposit 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 ast.Ast06_Tr.selectById(trId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L355-357 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L230
  gb.text('classTreeNm', 200, '출금계좌'),  // L231
  gb.text('depositName', 200, '입금계좌'),  // L232
  gb.textCenter('curCd', 60, '통화'),  // L233
  gb.double('fxRate', 100, '적용환율'),  // L234
  gb.double('forAmt', 100, '외화금액'),  // L235
  gb.long('amt', 150, '원화금액'),  // L236
  gb.long('fee', 150, '수수료'),  // L237
  // ⚠ 대응 없음 (GridBuilder L238) addCell
  gb.textCenter('apprCnt', 55, '연관문서'),  // L239
  // ⚠ 대응 없음 (GridBuilder L240) addCell
  gb.text('note', 300, '적요'),  // L241
  gb.textCenter('personNm', 80, '등록자'),  // L242
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Ast06_Lookup_TrForDeposit (`client/vi/ast/Ast06_Lookup_TrForDeposit.java`, 480줄)

- 입력·하위 화면: `date` MyDateField, `corpId` LongField, `amt` LongField, `forAmt` DoubleField, `fxRate` DoubleField, `fee` LongField, `note` TextField, `astClassTreeId` LongField, `classTreeName` LookupTriggerField, `depositId` LongField, `depositName` LookupTriggerField, `curCode` ComboBoxField("CurCode"), `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L88-90) → 초기화
[E1] classTreeName[출금 계좌].TriggerClick [result == null] (L160) → 인라인 L160-180 (new TriggerClickHandler() { @Override…)
[E2] depositName[입금 계좌].TriggerClick [result == null] (L191) → 인라인 L191-209 (new TriggerClickHandler() { @Override…)
[E3] fxRate.ValueChange (L216) → setKorAmt()
[E4] forAmt[외화 이체금액].ValueChange (L222) → setKorAmt()
[E5] updateButton[저장].Select (L229) → preUpdate()
[E6] journalButton[분개재생성].Select (L235) → createJournal()
[E7] closeButton[닫기].Select ["NEW".equals(actionName)] (L241) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L92-107 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L109-143 | openNew | 상태 처리 | 업무 |
| private setting() | L145-253 | open | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private setKorAmt() | L255-269 | E3,E4 | 상태 처리 | 업무 |
| private getEditor() | L271-323 | open | 상태 처리 | 업무 |
| public preUpdate() | L325-373 | E5 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L375-394 | preUpdate | 서비스 ast.Ast06_Tr.update | 업무 |
| private createJournal() | L396-434 | E6,update | 서비스 ast.Ast06_Tr.updateDepositSellBookAmt, act.Act02_Journal.createJournal(trId, actionName, companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L436-470 | createJournal | 서비스 ast.Ast06_Tr.updateDeposit, ast.Ast06_Tr.selectById(companyId, stdDate, trId) | 업무 |
| private setHtmlStyle() | L472-474 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L476-478 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

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

