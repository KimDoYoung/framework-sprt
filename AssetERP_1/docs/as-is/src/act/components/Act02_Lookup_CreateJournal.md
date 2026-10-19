# Act02_Lookup_CreateJournal

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/act/Act02_Lookup_CreateJournal.java`
- 함께 쓰는 클래스 1개:
  - `Act02_Lookup_JournalList` `client/vi/act/Act02_Lookup_JournalList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.selectBySlipYn` | Act02_Lookup_CreateJournal:330 | [`Act01_AccountCode.java:40`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) |
| `act.Act02_Journal.selectByDate` | Act02_Lookup_JournalList:170 | [`Act02_Journal.java:37`](../../act/services/Act02_Journal.md) | [`act02_journal.selectByDate`](../../act/sql/act02_journal.md) |
| `act.Act02_Journal.updateAll` | Act02_Lookup_CreateJournal:559 | [`Act02_Journal.java:462`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournalNo`](../../act/sql/act02_journal.md), [`act02_journal.insert`](../../act/sql/act02_journal.md), [`act02_journal.selectById`](../../act/sql/act02_journal.md), [`act02_journal.update`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.insertByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.selectByJournalIdAndSeq`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.updateBySeq`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.insert`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.selectByJournalId2`](../../act/sql/act06_journal_tmp.md), [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `act.Act04_GenLedger.checkClose` | Act02_Lookup_CreateJournal:591 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `act.Act06_JournalTmp.selectByJournalId` | Act02_Lookup_CreateJournal:640 | [`Act06_JournalTmp.java:21`](../../act/services/Act06_JournalTmp.md) | [`act06_journal_tmp.selectByJournalId`](../../act/sql/act06_journal_tmp.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`pay50_expense`](../../../db/tables/pay.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_create_depositbook`, `f_create_journal_no`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Lookup_CreateJournal (`client/vi/act/Act02_Lookup_CreateJournal.java`, 680줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `date` MyDateField, `journalNo` LongField, `corpId` LongField, `note` TextArea, `corpName` LookupTriggerField, `diffAmt` LongField, `lookupCorp` Sys15_Lookup_Corp, `lookupAccountCode` LookupTriggerField, `comboDrCrType` ComboBoxField("DrcrType"), `lookupDeposit` LookupTriggerField, `lookupAccount` Act01_Lookup_AccountCode, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupJournal` Act02_Lookup_JournalList
- 그리드 `jnlGrid` (journalGrid(), 체크박스(다중)):
  - drcrTypeName 55 "구분" TextCenter 편집:comboDrCrType
  - realAccountCode 95 "계정코드" TextCenter 편집:lookupAccountCode
  - realAccountName 250 "계정과목" TextArea
  - amt 100 "금액" Long 편집:LongField
  - depositName 140 "관리계좌" Text 편집:lookupDeposit
  - note 145 "적요" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L104-120) → setting(), getEditor(), show()
[E1] corpName[거래처].TriggerClick [result != null] (L168) → 인라인 L168-186 (new TriggerClickHandler(){ @Override …)
[E2] anchor.MouseDown (L192) → retrieveJnl()
[E3] copyButton[불러오기].Select (L211) → journalCopy()
[E4] insertDrRowButton[차변 행추가].Select (L218) → insertRow()
[E5] insertCrRowButton[대변 행추가].Select (L225) → insertRow()
[E6] deleteRowButton[행 삭제].Select (L232) → deleteRow()
[E7] updateButton[저장].Select (L238) → preUpdate()
[E8] closeButton[닫기].Select ["NEW".equals(actionName)] (L244) → hide()
[E9] jnlGrid.getStore().StoreRecordChange (L259) → setDiffAmt()
[E10] lookupAccountCode.TriggerClick (L316) → lookupAccount()
[E11] lookupAccountCode.ValueChange (L322) → setAccount(), lookupAccount()
[E12] comboDrCrType[DrcrType].Collapse (L351) → 인라인 L351-357 (new CollapseHandler() { @Override pub…)
[E13] lookupDeposit.TriggerClick (L374) → lookupDeposit()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L122-137 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L139-158 | openNew | 상태 처리 | 업무 |
| private setting() | L160-272 | 생성자 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private getEditor() | L274-308 | 생성자 | 상태 처리 | 업무 |
| private journalGrid() | L310-391 | 필드 초기화 | 서비스 act.Act01_AccountCode.selectBySlipYn(companyId, searchText, attributeCode) | 업무 |
| private setDiffAmt() | L393-419 | E9,deleteRow | 상태 처리 | 업무 |
| private lookupAccount() | L421-430 | E10,E11 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private setAccount() | L432-436 | E11,lookupAccount | 상태 처리 | 업무 |
| private lookupDeposit() | L438-456 | E13 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private retrieveJnl() | L458-468 | E2,open | 서비스 act.Act06_JournalTmp.selectByJournalId(journalId) | 업무 |
| public insertRow() | L470-488 | E4,E5 | 상태 처리 | 업무 |
| public deleteRow() | L490-505 | E6 | 상태 처리 | 업무 |
| public preUpdate() | L507-553 | E7 | 상태 처리 | 업무 |
| private update() | L555-584 | preUpdate | 서비스 act.Act02_Journal.updateAll(jnlModel) | 업무 |
| private checkClose() | L586-608 | insertRow,deleteRow,preUpdate | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private setSeq() | L610-618 | preUpdate | 상태 처리 | 업무 |
| private getJnlGridList() | L620-627 | update | 상태 처리 | 업무 |
| private journalCopy() | L629-670 | E3 | 조회창 Act02_Lookup_JournalList 열기, 서비스 act.Act06_JournalTmp.selectByJournalId(journalId) | 업무 |
| private setHtmlStyle() | L672-674 | setting,getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L676-678 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const journalGrid = () => [
  gb.textCenter('drcrTypeNm', 55, '구분'),  // L383 SQL 계산 컬럼(selectByJournalId: f_cdnm('DrcrType', act06_drcr_type, act…)
  gb.textCenter('realAccountCd', 95, '계정코드'),  // L384
  gb.textArea('realAccountNm', 250, '계정과목'),  // L385 SQL 계산 컬럼(selectByJournalId: f_get_account_nm(act02_company_id, act0…)
  gb.long('amt', 100, '금액', { editor: 'number' }),  // L386
  gb.text('depositNm', 140, '관리계좌'),  // L387 SQL 계산 컬럼(selectByJournalId: f_ast_class_tree_nm(act06_deposit_id))
  gb.text('note', 145, '적요', { editor: 'text' }),  // L388
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>차변 행추가</Button>
2. <Button type="addRow" onClick={insertRow}>대변 행추가</Button>
3. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
4. <Button type="register" onClick={journalCopy}>불러오기</Button>
5. <Button type="save" onClick={preUpdate}>저장</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Act02_Lookup_JournalList (`client/vi/act/Act02_Lookup_JournalList.java`, 196줄)

- 툴바 `buttonBar`: 조회일자: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="거래처/적요"
- 그리드 `grid` (buildGrid(), 체크박스):
  - date 90 "일자" Date
  - journalNoStr 90 "전표번호" TextCenter
  - corpName 150 "거래처" Text
  - note 350 "적요" Text
  - journalAmt 120 "금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L57-64) → 초기화
[E1] searchText.KeyPress [Enter] (L97) → retrieve()
[E2] grid.RowDoubleClick (L107) → select()
[E3] selectButton[확인].Select (L125) → select()
[E4] cancleButton[닫기].Select (L131) → hide()
[E5] retrieveButton[조회].Select (L137) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L66-82 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L84-144 | open | 상태 처리 | 업무 |
| private retrieve() | L160-176 | E1,E5,open | 서비스 act.Act02_Journal.selectByDate(companyId, startDate, closeDate, abroType, searchText) | 업무 |
| private select() | L178-186 | E2,E3 | 상태 처리 | 업무 |
| public buildGrid() | L146-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L188-190 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L192-194 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 90, '일자'),  // L151
  // ⚠DB없음 L152 journalNoStr 90 "전표번호" (act03_journal_no_str 컬럼 없음)
  gb.text('corpNm', 150, '거래처'),  // L153
  gb.text('note', 350, '적요'),  // L154
  gb.long('journalAmt', 120, '금액'),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

