# Act02_Tab_CreateJournal

- 종류: 화면
- 메뉴: 관리회계 > 10. 전표입력 > 전표입력 (#1148)
- 파일: `client/vi/act/Act02_Tab_CreateJournal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Grid_CreateJournal`](../../act/components/Act02_Grid_CreateJournal.md), [`Act02_Lookup_CreateJournal`](../../act/components/Act02_Lookup_CreateJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.delete` | Act02_Tab_CreateJournal:377 | [`Act02_Journal.java:647`](../../act/services/Act02_Journal.md) | [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByJournalId`](../../act/sql/act80_relate_appr.md), `UpdateDataModel(act02_journal)` 동적 DELETE |
| `act.Act02_Journal.selectByDate` | Act02_Tab_CreateJournal:299 | [`Act02_Journal.java:37`](../../act/services/Act02_Journal.md) | [`act02_journal.selectByDate`](../../act/sql/act02_journal.md) |
| `act.Act02_Journal.selectById` | Act02_Tab_CreateJournal:251 | [`Act02_Journal.java:31`](../../act/services/Act02_Journal.md) | [`act02_journal.selectById`](../../act/sql/act02_journal.md) |
| `act.Act04_GenLedger.checkClose` | Act02_Tab_CreateJournal:323 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `act.Act08_JournalUpload.deleteByCompanyId` | Act02_Tab_CreateJournal:424 | [`Act08_JournalUpload.java:25`](../../act/services/Act08_JournalUpload.md) | [`act08_journal_upload.deleteByCompanyId`](../../act/sql/act08_journal_upload.md) |
| `act.Act08_JournalUpload.journalWork` | Act02_Tab_CreateJournal:452 | [`Act08_JournalUpload.java:32`](../../act/services/Act08_JournalUpload.md) | [`act08_journal_upload.journalWork`](../../act/sql/act08_journal_upload.md) |
| `ast.Ast06_Tr.updateDeposit` | Act02_Tab_CreateJournal:409 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act08_journal_upload`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`pay50_expense`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_create_depositbook`, `f_create_journal_upload`, `f_emp_kor_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Tab_CreateJournal (`client/vi/act/Act02_Tab_CreateJournal.java`, 475줄)

- 레이아웃: north=vlc, center=journalDtlGrid
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton} {tempDownloadButton} {downloadForm} {excelUploadButton} {uploadExcelForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="거래처/적요", `lookupJnl` Act02_Lookup_CreateJournal, `lookup` Act80_Lookup_RelateAppr, `lookupJournal` Act02_Lookup_CreateJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - journalNoStr 85 "전표번호" TextCenter
  - corpName 200 "거래처" Text
  - note 450 "적요" TextArea
  - journalAmt 150 "금액" Long
  - personName 100 "등록자" TextCenter
  - actionCell 50 "변경" Cell 편집:modiActionCell
  - dcrCountStr 55 "연관문서" TextCenter
  - actionCell 25 "" Cell 편집:actionCell
  - fixYnName 100 "승인여부" TextCenter
  - closeName 100 "마감여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L80-123) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L134) → retrieve()
[E2] grid.SelectionChanged (L149) → 인라인 L149-154 (new SelectionChangedHandler<Act02_Jou…)
[E3] retrieveButton[조회].Select (L156) → retrieve()
[E4] insertButton[등록].Select (L162) → insertRow()
[E5] deleteButton[삭제].Select (L168) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L367) → checkClose(), updateDepositBook()
[E6] tempDownloadButton[템플릿].Select (L174) → 인라인 L174-179 (new SelectHandler(){ @Override public…)
[E7] excelUploadButton[엑셀업로드].Select (L180) → excelUpload()
[E8] uploadExcelForm.SubmitComplete (L193) → journalWork()
[E10] fileUploadField.Change (L440) → 인라인 L440-445 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L281-309 | 생성자,E1,E3,journalWork | 서비스 act.Act02_Journal.selectByDate(companyId, startDate, closeDate, abroType, searchText) | 업무 |
| private checkClose() | L311-344 | E9 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| public insertRow() | L346-357 | E4 | 조회창 Act02_Lookup_CreateJournal 열기 | 업무 |
| public deleteRow() | L359-405 | E5 | 미선택 시 alert "삭제할 내역을 선택해주세요" → 확인창 E9 | 업무 |
| private updateDepositBook() | L407-419 | E9 | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private excelUpload() | L421-449 | E7 | 서비스 act.Act08_JournalUpload.deleteByCompanyId(companyId) | 업무 |
| private journalWork() | L451-469 | E8 | 서비스 act.Act08_JournalUpload.journalWork(companyId, personId) | 업무 |
| private settings() | L125-205 | 생성자 | 이벤트 연결, 초기값: startDate=new Date(, closeDate=new Date( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L207-279 | 필드 초기화 | 조회창 Act02_Lookup_CreateJournal 열기, 조회창 Act80_Lookup_RelateAppr 열기, 서비스 act.Act02_Journal.selectById(journalId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L471-473 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L266
  // ⚠DB없음 L267 journalNoStr 85 "전표번호" (act03_journal_no_str 컬럼 없음)
  gb.text('corpNm', 200, '거래처'),  // L268
  gb.textArea('note', 450, '적요'),  // L269
  gb.long('journalAmt', 150, '금액'),  // L270
  gb.textCenter('personNm', 100, '등록자'),  // L271
  // ⚠ 대응 없음 (GridBuilder L272) addCell
  gb.textCenter('dcrCountStr', 55, '연관문서'),  // L273
  // ⚠ 대응 없음 (GridBuilder L274) addCell
  gb.textCenter('fixYnNm', 100, '승인여부'),  // L275
  gb.textCenter('closeNm', 100, '마감여부'),  // L276
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="download" onClick={() => /* 인라인 L174-179 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
5. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

