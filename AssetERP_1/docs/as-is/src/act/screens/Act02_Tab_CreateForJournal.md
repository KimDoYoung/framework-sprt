# Act02_Tab_CreateForJournal

- 종류: 화면
- 메뉴: 관리회계 > 12. 특수회계처리(외화) > 전표입력(외화) (#1176)
- 파일: `client/vi/act/Act02_Tab_CreateForJournal.java`
- 함께 쓰는 클래스 2개:
  - `Act02_Lookup_CreateForJournal` `client/vi/act/Act02_Lookup_CreateForJournal.java`
  - `Act02_Grid_CreateForJournal` `client/vi/act/Act02_Grid_CreateForJournal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.selectBySlipYn` | Act02_Lookup_CreateForJournal:330 | [`Act01_AccountCode.java:40`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) |
| `act.Act02_Journal.delete` | Act02_Tab_CreateForJournal:322 | [`Act02_Journal.java:647`](../../act/services/Act02_Journal.md) | [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByJournalId`](../../act/sql/act80_relate_appr.md), `UpdateDataModel(act02_journal)` 동적 DELETE |
| `act.Act02_Journal.selectByDate` | Act02_Tab_CreateForJournal:244 | [`Act02_Journal.java:37`](../../act/services/Act02_Journal.md) | [`act02_journal.selectByDate`](../../act/sql/act02_journal.md) |
| `act.Act02_Journal.selectById` | Act02_Tab_CreateForJournal:195 | [`Act02_Journal.java:31`](../../act/services/Act02_Journal.md) | [`act02_journal.selectById`](../../act/sql/act02_journal.md) |
| `act.Act02_Journal.updateAll` | Act02_Lookup_CreateForJournal:563 | [`Act02_Journal.java:462`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournalNo`](../../act/sql/act02_journal.md), [`act02_journal.insert`](../../act/sql/act02_journal.md), [`act02_journal.selectById`](../../act/sql/act02_journal.md), [`act02_journal.update`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.insertByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.selectByJournalIdAndSeq`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.updateBySeq`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.insert`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.selectByJournalId2`](../../act/sql/act06_journal_tmp.md), [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Act02_Grid_CreateForJournal:78 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Act02_Lookup_CreateForJournal:587, Act02_Tab_CreateForJournal:268 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `act.Act06_JournalTmp.selectByJournalId` | Act02_Lookup_CreateForJournal:464 | [`Act06_JournalTmp.java:21`](../../act/services/Act06_JournalTmp.md) | [`act06_journal_tmp.selectByJournalId`](../../act/sql/act06_journal_tmp.md) |
| `ast.Ast06_Tr.updateDeposit` | Act02_Tab_CreateForJournal:354 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`pay50_expense`](../../../db/tables/pay.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_create_depositbook`, `f_create_journal_no`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Tab_CreateForJournal (`client/vi/act/Act02_Tab_CreateForJournal.java`, 370줄)

- 레이아웃: north=vlc, center=journalDtlGrid
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="적요/거래처", `lookupJnl` Act02_Lookup_CreateForJournal, `lookup` Act80_Lookup_RelateAppr, `lookupJournal` Act02_Lookup_CreateForJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - journalNoStr 85 "전표번호" TextCenter
  - corpName 200 "거래처" Text
  - note 400 "적요" TextArea
  - curCode 80 "통화" TextCenter
  - journalAmt 120 "금액" Long
  - personName 100 "등록자" TextCenter
  - actionCell 50 "변경" Cell 편집:modiActionCell
  - dcrCountStr 55 "연관문서" TextCenter
  - actionCell 25 "" Cell 편집:actionCell
  - fixYnName 100 "승인여부" TextCenter
  - closeName 100 "마감여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L66-104) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L115) → retrieve()
[E2] grid.RowClick (L124) → 인라인 L124-129 (new RowClickHandler() { @Override pub…)
[E3] retrieveButton[조회].Select (L131) → retrieve()
[E4] insertButton[등록].Select (L137) → insertRow()
[E5] deleteButton[삭제].Select (L143) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L312) → checkClose(), updateDepositBook()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L226-254 | 생성자,E1,E3 | 서비스 act.Act02_Journal.selectByDate(companyId, startDate, closeDate, abroType, searchText) | 업무 |
| private checkClose() | L256-289 | E6 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| public insertRow() | L291-302 | E4 | 조회창 Act02_Lookup_CreateForJournal 열기 | 업무 |
| public deleteRow() | L304-350 | E5 | 미선택 시 alert "삭제할 내역을 선택해주세요" → 확인창 E6 | 업무 |
| private updateDepositBook() | L352-364 | E6 | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private settings() | L106-149 | 생성자 | 이벤트 연결, 초기값: startDate=new Date(, closeDate=new Date( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L151-224 | 필드 초기화 | 조회창 Act02_Lookup_CreateForJournal 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 act.Act02_Journal.selectById(journalId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L366-368 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L210
  // ⚠DB없음 L211 journalNoStr 85 "전표번호" (act03_journal_no_str 컬럼 없음)
  gb.text('corpNm', 200, '거래처'),  // L212
  gb.textArea('note', 400, '적요'),  // L213
  gb.textCenter('curCd', 80, '통화'),  // L214
  gb.long('journalAmt', 120, '금액'),  // L215
  gb.textCenter('personNm', 100, '등록자'),  // L216
  // ⚠ 대응 없음 (GridBuilder L217) addCell
  gb.textCenter('dcrCountStr', 55, '연관문서'),  // L218
  // ⚠ 대응 없음 (GridBuilder L219) addCell
  gb.textCenter('fixYnNm', 100, '승인여부'),  // L220
  gb.textCenter('closeNm', 100, '마감여부'),  // L221
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Act02_Lookup_CreateForJournal (`client/vi/act/Act02_Lookup_CreateForJournal.java`, 631줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `date` MyDateField, `journalNo` LongField, `corpId` LongField, `note` TextArea, `corpName` LookupTriggerField, `curCode` ComboBoxField("CurCode"), `diffAmt` LongField, `forDiffAmt` DoubleField, `lookupCorp` Sys15_Lookup_Corp, `lookupAccountCode` LookupTriggerField, `comboDrCrType` ComboBoxField("DrcrType"), `lookupDeposit` LookupTriggerField, `lookupAccount` Act01_Lookup_AccountCode, `lookupCorpAccount` Ast01_Lookup_CorpAccount
- 그리드 `jnlGrid` (journalGrid(), 체크박스(다중)):
  - drcrTypeName 55 "구분" TextCenter 편집:comboDrCrType
  - realAccountCode 95 "계정코드" TextCenter 편집:lookupAccountCode
  - realAccountName 250 "계정과목" TextArea
  - forAmt 80 "외화금액" Double 편집:DoubleField
  - amt 100 "원화금액" Long 편집:LongField
  - depositName 140 "관리계좌" Text 편집:lookupDeposit
  - note 145 "적요" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L105-121) → setting(), getEditor(), show()
[E1] corpName[거래처].TriggerClick [result != null] (L171) → 인라인 L171-189 (new TriggerClickHandler(){ @Override …)
[E2] anchor.MouseDown (L195) → retrieveJnl()
[E3] insertDrRowButton[차변 행추가].Select (L219) → insertRow()
[E4] insertCrRowButton[대변 행추가].Select (L226) → insertRow()
[E5] deleteRowButton[행 삭제].Select (L233) → deleteRow()
[E6] updateButton[저장].Select (L239) → preUpdate()
[E7] closeButton[닫기].Select ["NEW".equals(actionName)] (L245) → hide()
[E8] jnlGrid.getStore().StoreRecordChange (L256) → setDiffAmt()
[E9] lookupAccountCode.TriggerClick (L316) → lookupAccount()
[E10] lookupAccountCode.ValueChange (L322) → setAccount(), lookupAccount()
[E11] comboDrCrType[DrcrType].Collapse (L351) → 인라인 L351-357 (new CollapseHandler() { @Override pub…)
[E12] lookupDeposit.TriggerClick (L374) → lookupDeposit()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L123-137 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L139-156 | openNew | 상태 처리 | 업무 |
| private setting() | L158-269 | 생성자 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private getEditor() | L271-308 | 생성자 | 상태 처리 | 업무 |
| private journalGrid() | L310-392 | 필드 초기화 | 서비스 act.Act01_AccountCode.selectBySlipYn(companyId, searchText, attributeCode) | 업무 |
| private setDiffAmt() | L394-421 | E8,deleteRow | 상태 처리 | 업무 |
| private lookupAccount() | L423-432 | E9,E10 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private lookupDeposit() | L434-452 | E12 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private setAccount() | L454-458 | E10,lookupAccount | 상태 처리 | 업무 |
| private retrieveJnl() | L460-470 | E2,open | 서비스 act.Act06_JournalTmp.selectByJournalId(journalId) | 업무 |
| public insertRow() | L472-490 | E3,E4 | 상태 처리 | 업무 |
| public deleteRow() | L492-507 | E5 | 상태 처리 | 업무 |
| public preUpdate() | L509-560 | E6 | 상태 처리 | 업무 |
| private update() | L562-583 | preUpdate | 서비스 act.Act02_Journal.updateAll(jnlModel) | 업무 |
| private checkClose() | L585-603 | insertRow,deleteRow,preUpdate | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private setSeq() | L605-613 | preUpdate | 상태 처리 | 업무 |
| private getJnlGridList() | L615-621 | update | 상태 처리 | 업무 |
| private setHtmlStyle() | L623-625 | setting,getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L627-629 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const journalGrid = () => [
  gb.textCenter('drcrTypeNm', 55, '구분'),  // L383 SQL 계산 컬럼(selectByJournalId: f_cdnm('DrcrType', act06_drcr_type, act…)
  gb.textCenter('realAccountCd', 95, '계정코드'),  // L384
  gb.textArea('realAccountNm', 250, '계정과목'),  // L385 SQL 계산 컬럼(selectByJournalId: f_get_account_nm(act02_company_id, act0…)
  gb.double('forAmt', 80, '외화금액', { editor: 'number' }),  // L386
  gb.long('amt', 100, '원화금액', { editor: 'number' }),  // L387
  gb.text('depositNm', 140, '관리계좌'),  // L388 SQL 계산 컬럼(selectByJournalId: f_ast_class_tree_nm(act06_deposit_id))
  gb.text('note', 145, '적요', { editor: 'text' }),  // L389
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>차변 행추가</Button>
2. <Button type="addRow" onClick={insertRow}>대변 행추가</Button>
3. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
4. <Button type="save" onClick={preUpdate}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Act02_Grid_CreateForJournal (`client/vi/act/Act02_Grid_CreateForJournal.java`, 93줄)

- 레이아웃: center=vlc
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - drAccountCode 120 "계정코드" TextCenter 편집:"456EA6"
  - drAstAccountName 300 "계정과목" TextArea2 편집:"456EA6"
  - drForAmt 100 "외화금액" Double 편집:"456EA6"
  - drAmt 120 "원화금액" Long 편집:"456EA6"
  - drNote 150 "적요" TextArea2 편집:"456EA6"
  - crAccountCode 120 "계정코드" TextCenter 편집:"DD5E5E"
  - crAstAccountName 300 "계정과목" TextArea2 편집:"DD5E5E"
  - crForAmt 100 "외화금액" Double 편집:"DD5E5E"
  - crAmt 120 "원화금액" Long 편집:"DD5E5E"
  - crNote 150 "적요" TextArea2 편집:"DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L27-39) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L69-72 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L74-87 | 공개 메서드 | 서비스 act.Act03_JournalDtl.selectByJournalId(journalId) | 업무 |
| public buildGrid() | L41-67 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L89-92 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L46 newHeaderGroupMap01newHeaderGroupConfigsetHtmlGridStyle15 100 "차변" (act03_new_header_group_map01new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L47 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle16 100 "대변" (act03_new_header_group_map05new_header_group_configset_html_grid_style16 컬럼 없음)
  gb.textCenter('drAccountCd', 120, '계정코드'),  // L49
  // ⚠ 대응 없음 (GridBuilder L50) addTextArea2
  gb.double('drForAmt', 100, '외화금액'),  // L51
  gb.long('drAmt', 120, '원화금액'),  // L52
  // ⚠ 대응 없음 (GridBuilder L53) addTextArea2
  gb.textCenter('crAccountCd', 120, '계정코드'),  // L54
  // ⚠ 대응 없음 (GridBuilder L55) addTextArea2
  gb.double('crForAmt', 100, '외화금액'),  // L56
  gb.long('crAmt', 120, '원화금액'),  // L57
  // ⚠ 대응 없음 (GridBuilder L58) addTextArea2
];
```

#### 사용된 버튼들
버튼 사용하지 않음

