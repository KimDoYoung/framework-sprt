# Act02_Lookup_ModiForJournal

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ast`
- 파일: `client/vi/act/Act02_Lookup_ModiForJournal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.selectBySlipYn` | Act02_Lookup_ModiForJournal:341 | [`Act01_AccountCode.java:40`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) |
| `act.Act02_Journal.updateAll` | Act02_Lookup_ModiForJournal:582 | [`Act02_Journal.java:462`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournalNo`](../../act/sql/act02_journal.md), [`act02_journal.insert`](../../act/sql/act02_journal.md), [`act02_journal.selectById`](../../act/sql/act02_journal.md), [`act02_journal.update`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.insertByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.selectByJournalIdAndSeq`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.updateBySeq`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.insert`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.selectByJournalId2`](../../act/sql/act06_journal_tmp.md), [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Act02_Lookup_ModiForJournal:146 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Act02_Lookup_ModiForJournal:622 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `act.Act06_JournalTmp.selectByJournalId` | Act02_Lookup_ModiForJournal:481 | [`Act06_JournalTmp.java:21`](../../act/services/Act06_JournalTmp.md) | [`act06_journal_tmp.selectByJournalId`](../../act/sql/act06_journal_tmp.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_create_depositbook`, `f_create_journal_no`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Lookup_ModiForJournal (`client/vi/act/Act02_Lookup_ModiForJournal.java`, 666줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `date` MyDateField, `journalNo` LongField, `corpId` LongField, `note` TextArea, `corpName` LookupTriggerField, `curCode` ComboBoxField("CurCode"), `trName` TextField, `diffAmt` LongField, `forDiffAmt` DoubleField, `lookupCorp` Sys15_Lookup_Corp, `lookupAccountCode` LookupTriggerField, `comboDrCrType` ComboBoxField("DrcrType"), `lookupDeposit` LookupTriggerField, `lookupAccount` Act01_Lookup_AccountCode, `lookupCorpAccount` Ast01_Lookup_CorpAccount
- 그리드 `jnlGrid` (journalGrid(), 체크박스(다중)):
  - drcrTypeName 55 "구분" TextCenter 편집:comboDrCrType
  - realAccountCode 95 "계정코드" TextCenter 편집:lookupAccountCode
  - realAccountName 250 "계정과목" TextArea
  - forAmt 80 "외화금액" Double 편집:DoubleField
  - amt 100 "원화금액" Long 편집:LongField
  - depositName 140 "관리계좌" Text 편집:lookupDeposit
  - note 145 "적요" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L123-143) → buildGrid(), setting(), getEditor(), show()
[E1] corpName[거래처].TriggerClick (L188) → 인라인 L188-201 (new TriggerClickHandler(){ @Override …)
[E2] anchor.MouseDown (L207) → retrieveJnl()
[E3] insertDrRowButton[차변 행추가].Select (L231) → insertRow()
[E4] insertCrRowButton[대변 행추가].Select (L238) → insertRow()
[E5] deleteRowButton[행 삭제].Select (L245) → deleteRow()
[E6] updateButton[저장].Select (L251) → preUpdate()
[E7] closeButton[닫기].Select (L257) → hide()
[E8] jnlGrid.getStore().StoreRecordChange (L264) → setDiffAmt()
[E9] lookupAccountCode.TriggerClick (L327) → lookupAccount()
[E10] lookupAccountCode.ValueChange (L333) → setAccount(), lookupAccount()
[E11] comboDrCrType[DrcrType].Collapse (L362) → 인라인 L362-368 (new CollapseHandler() { @Override pub…)
[E12] lookupDeposit.TriggerClick (L385) → lookupDeposit()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L145-156 | 공개 메서드 | 서비스 act.Act03_JournalDtl.selectByJournalId(journalId) | 업무 |
| public open() | L158-168 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L170-277 | 생성자 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private getEditor() | L279-319 | 생성자 | 상태 처리 | 업무 |
| private journalGrid() | L321-403 | 필드 초기화 | 서비스 act.Act01_AccountCode.selectBySlipYn(companyId, searchText, attributeCode) | 업무 |
| private setDiffAmt() | L411-438 | E8,deleteRow | 상태 처리 | 업무 |
| private lookupAccount() | L440-449 | E9,E10 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private lookupDeposit() | L451-469 | E12 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private setAccount() | L471-475 | E10,lookupAccount | 상태 처리 | 업무 |
| private retrieveJnl() | L477-487 | E2,open | 서비스 act.Act06_JournalTmp.selectByJournalId(journalId) | 업무 |
| public insertRow() | L489-507 | E3,E4 | 상태 처리 | 업무 |
| public deleteRow() | L509-524 | E5 | 상태 처리 | 업무 |
| public preUpdate() | L526-577 | E6 | 상태 처리 | 업무 |
| private update() | L579-618 | preUpdate | 서비스 act.Act02_Journal.updateAll(jnlModel) | 업무 |
| private checkClose() | L620-638 | insertRow,deleteRow,preUpdate | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private setSeq() | L640-648 | preUpdate | 상태 처리 | 업무 |
| private getJnlGridList() | L650-656 | update | 상태 처리 | 업무 |
| public buildGrid() | L405-409 | 생성자 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L658-660 | setting,getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L662-664 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const journalGrid = () => [
  gb.textCenter('drcrTypeNm', 55, '구분'),  // L394 SQL 계산 컬럼(selectByJournalId: f_cdnm('DrcrType', act06_drcr_type, act…)
  gb.textCenter('realAccountCd', 95, '계정코드'),  // L395
  gb.textArea('realAccountNm', 250, '계정과목'),  // L396 SQL 계산 컬럼(selectByJournalId: f_get_account_nm(act02_company_id, act0…)
  gb.double('forAmt', 80, '외화금액', { editor: 'number' }),  // L397
  gb.long('amt', 100, '원화금액', { editor: 'number' }),  // L398
  gb.text('depositNm', 140, '관리계좌'),  // L399 SQL 계산 컬럼(selectByJournalId: f_ast_class_tree_nm(act06_deposit_id))
  gb.text('note', 145, '적요', { editor: 'text' }),  // L400
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>차변 행추가</Button>
2. <Button type="addRow" onClick={insertRow}>대변 행추가</Button>
3. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
4. <Button type="save" onClick={preUpdate}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

