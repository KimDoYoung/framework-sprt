# Ast06_Tab_TrTax

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 세금/4대보험 등록 (#1196)
- 파일: `client/vi/ast/Ast06_Tab_TrTax.java`
- 함께 쓰는 클래스 4개:
  - `Ast06_Lookup_TrTax` `client/vi/ast/Ast06_Lookup_TrTax.java`
  - `Ast06_Lookup_Tr4Insure` `client/vi/ast/Ast06_Lookup_Tr4Insure.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
  - `Ast05_Lookup_TrCodeWindow` `client/vi/ast/Ast05_Lookup_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournal` | Ast06_Lookup_Tr4Insure:740, Ast06_Lookup_TrTax:576 | [`Act02_Journal.java:73`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Tab_TrTax:485 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `apr.Apr01_Appr.selectById` | Ast06_Tab_TrTax:271, Ast06_Tab_TrTax:330 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `ast.Ast05_TrCode.selectByWindowClassName` | Ast05_Lookup_TrCodeWindow:180 | [`Ast05_TrCode.java:43`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_TrTax:500 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectById` | Ast06_Lookup_Tr4Insure:768, Ast06_Lookup_TrTax:604 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectTaxTr` | Ast06_Tab_TrTax:392 | [`Ast06_Tr.java:115`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectTaxTr`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.update4Insure` | Ast06_Lookup_Tr4Insure:712 | [`Ast06_Tr.java:465`](../../ast/services/Ast06_Tr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast21_tr_4insure)` 동적 INSERT/UPDATE → [`ast21_tr_4insure.selectById`](../../ast/sql/ast21_tr_4insure.md) |
| `ast.Ast06_Tr.updateApprId` | Ast06_Tab_TrTax:575 | [`Ast06_Tr.java:1304`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.updateApprId`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast06_Lookup_Tr4Insure:789, Ast06_Lookup_TrTax:625 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast06_Tr.updateTax` | Ast06_Lookup_TrTax:548 | [`Ast06_Tr.java:439`](../../ast/services/Ast06_Tr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast20_tr_tax)` 동적 INSERT/UPDATE → [`ast20_tr_tax.selectById`](../../ast/sql/ast20_tr_tax.md) |
| `ast.Ast20_TrTax.selectGenLedgerTax` | Ast06_Lookup_TrTax:433 | [`Ast20_TrTax.java:21`](../../ast/services/Ast20_TrTax.md) | [`ast20_tr_tax.selectGenLedgerTax`](../../ast/sql/ast20_tr_tax.md) |
| `ast.Ast21_Tr4Insure.selectGenLedgerInsure` | Ast06_Lookup_Tr4Insure:527 | [`Ast21_Tr4Insure.java:33`](../../ast/services/Ast21_Tr4Insure.md) | [`ast21_tr_4insure.selectGenLedgerInsure`](../../ast/sql/ast21_tr_4insure.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ast06_Tab_TrTax:534 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depnbook`, `f_create_depositbook`, `f_create_financebook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_last_day`, `f_get_relate_dcr_count`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_TrTax (`client/vi/ast/Ast06_Tab_TrTax.java`, 593줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 거래유형: {trName} {retrieveButton} {insertButton} {deleteButton} {dcrLinkButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `trCode` TextField, `trName` LookupTriggerField 빈칸="전체", `astClassTreeId` LongField, `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookup` Dcr30_Lookup_Link, `lookupTr` Ast06_Lookup_Tr4Insure, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - trName 200 "거래유형" Text
  - note 300 "적요" Text
  - amt 150 "납부(환불)금액" Long
  - actionCell 50 "변경" Cell 편집:actionCell
  - actionCell 70 "결재요청" Cell 편집:actionCell2
  - apprStatusName 100 "결재상태" TextCenter
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - personName 80 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L80-97) → setting()
[E1] trName.TriggerClick [result != null] (L116) → 인라인 L116-136 (new TriggerClickHandler(){ @Override …)
[E2] retrieveButton[조회].Select (L154) → retrieve()
[E3] insertButton[등록].Select (L160) → insertRow()
[E4] deleteButton[삭제].Select (L166) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L460) → delete()
[E5] dcrLinkButton[문서분류지정].Select (L173) → 인라인 L173-184 (new SelectHandler() { @Override publi…)
[E6] grid.RowClick (L186) → retrievePage()
[E7] msgBox.DialogHide [YES] (L296) → searchDcr()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L99-195 | 생성자 | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Dcr30_Lookup_Link 열기 | 업무 |
| public retrieve() | L378-402 | E2,setting,insertLinkApproval,updateApprId | 서비스 ast.Ast06_Tr.selectTaxTr(startDate, closeDate, companyId, trCode) | 업무 |
| private retrievePage() | L404-407 | E6,retrieve | 상태 처리 | 업무 |
| private insertRow() | L409-440 | E3 | 조회창 Ast06_Lookup_Tr4Insure 열기, 조회창 Ast06_Lookup_TrTax 열기 | 업무 |
| private deleteRow() | L442-475 | E4 | 미선택 시 alert "삭제대상을 선택하여 주십시오." → 확인창 E8 | 업무 |
| private delete() | L477-516 | E8 | GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast06_Tr.delete(체크된 행 목록) | 업무 |
| private searchDcr() | L518-556 | E7,buildGrid | 미선택 시 alert "거래코드 에러(관리자에게 문의하세요.)", 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L558-572 | searchDcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L574-588 | insertLinkApproval | 서비스 ast.Ast06_Tr.updateApprId | 업무 |
| public buildGrid() | L197-376 | 필드 초기화 | 조회창 Ast06_Lookup_Tr4Insure 열기 → 콜백: unmask, 조회창 Ast06_Lookup_TrTax 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시, 서비스 apr.Apr01_Appr.selectById, apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L590-592 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L362
  gb.text('trNm', 200, '거래유형'),  // L363
  gb.text('note', 300, '적요'),  // L364
  gb.long('amt', 150, '납부(환불)금액'),  // L365
  // ⚠ 대응 없음 (GridBuilder L366) addCell
  // ⚠ 대응 없음 (GridBuilder L367) addCell
  gb.textCenter('apprStatusNm', 100, '결재상태'),  // L368
  // ⚠ 대응 없음 (GridBuilder L369) addCell
  gb.textCenter('personNm', 80, '등록자'),  // L370
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={() => /* 인라인 L173-184 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>

### Ast06_Lookup_TrTax (`client/vi/ast/Ast06_Lookup_TrTax.java`, 645줄)

- 입력·하위 화면: `date` MyDateField, `amt` LongField, `note` TextField, `trName` TextField, `trCode` TextField, `depositId` LongField, `depositName` LookupTriggerField, `settleMngTrue` Radio, `settleMngFalse` Radio, `incomeTax` LongField, `localTax` LongField, `etcTax` LongField, `prePayVat` LongField, `preRcvVat` LongField, `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L100-102) → 초기화
[E1] settleMngToggleGroup.ValueChange (L199) → 인라인 L199-212 (new ValueChangeHandler<HasValue<Boole…)
[E2] depositName.TriggerClick [result == null] (L226) → 인라인 L226-244 (new TriggerClickHandler(){ @Override …)
[E3] date[거래일자].ValueChange (L266) → getGenLedger()
[E4] incomeTax[소득세예수금].ValueChange (L273) → setAmt()
[E5] localTax[지방세예수금].ValueChange (L279) → setAmt()
[E6] etcTax[기타원천징수예수금].ValueChange (L285) → setAmt()
[E7] prePayVat[선급부가세].ValueChange (L291) → setAmt()
[E8] preRcvVat[예수부가세].ValueChange (L297) → setAmt()
[E9] updateButton[저장].Select (L304) → preUpdate()
[E10] journalButton[분개재생성].Select (L310) → createJournal()
[E11] closeButton[닫기].Select ["NEW".equals(actionName)] (L316) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L104-122 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L124-181 | openNew | 상태 처리 | 업무 |
| private setting() | L183-328 | open | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private setEnable() | L330-346 | setting | 상태 처리 | 업무 |
| private getEditor() | L348-418 | open | 상태 처리 | 업무 |
| private getGenLedger() | L420-465 | E3,setting | 서비스 ast.Ast20_TrTax.selectGenLedgerTax(companyId, date, trCode) | 업무 |
| private setAmt() | L467-518 | E4,E5,E6,E7,E8,getGenLedger | 상태 처리 | 업무 |
| public preUpdate() | L520-544 | E9 | 상태 처리 | 업무 |
| private update() | L546-565 | preUpdate | 서비스 ast.Ast06_Tr.updateTax | 업무 |
| private createJournal() | L567-597 | E10,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L599-621 | createJournal | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private updateDepositBook() | L623-635 | success | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setHtmlStyle() | L637-639 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L641-643 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={createJournal}>분개재생성</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Lookup_Tr4Insure (`client/vi/ast/Ast06_Lookup_Tr4Insure.java`, 809줄)

- 입력·하위 화면: `date` MyDateField, `trName` TextField, `note` TextField, `depositId` LongField, `depositName` LookupTriggerField, `settleMngTrue` Radio, `settleMngFalse` Radio, `npWithholding` LongField, `npCompany` LongField, `npEtc` LongField, `npEtcNote` TextField 빈칸="기타금액의 상세내역 기입(연체료,자동납부할인 등)", `npSettleAmt` LongField, `hiWithholding` LongField, `hiCompany` LongField, `hiEtc` LongField, `hiEtcNote` TextField 빈칸="기타금액의 상세내역 기입(연체료,자동납부할인 등)", `hiSettleAmt` LongField, `eiWithholding` LongField, `eiCompany` LongField, `eiEtc` LongField, `eiEtcNote` TextField 빈칸="기타금액의 상세내역 기입(연체료,자동납부할인 등)", `eiSettleAmt` LongField, `ohCompany` LongField, `ohEtc` LongField, `ohEtcNote` TextField 빈칸="기타금액의 상세내역 기입(연체료,자동납부할인 등)", `ohSettleAmt` LongField, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `ohWithholding` LongField

#### 이벤트
[E0] 화면 열림 (생성자 L140-142) → 초기화
[E1] settleMngToggleGroup.ValueChange (L250) → 인라인 L250-263 (new ValueChangeHandler<HasValue<Boole…)
[E2] depositName.TriggerClick [result == null] (L280) → 인라인 L280-298 (new TriggerClickHandler(){ @Override …)
[E3] date[거래일자].ValueChange (L300) → getGenLedger()
[E4] npWithholding[국민연금 예수금].ValueChange (L312) → setSettleAmt()
[E5] npCompany[회사부담금].ValueChange (L318) → setSettleAmt()
[E6] npEtc[기타금액].ValueChange (L324) → setSettleAmt()
[E7] hiWithholding[건강보험 예수금].ValueChange (L331) → setSettleAmt()
[E8] hiCompany[회사부담금].ValueChange (L337) → setSettleAmt()
[E9] hiEtc[기타금액].ValueChange (L343) → setSettleAmt()
[E10] eiWithholding[고용보험 예수금].ValueChange (L350) → setSettleAmt()
[E11] eiCompany[회사부담금].ValueChange (L356) → setSettleAmt()
[E12] eiEtc[기타금액].ValueChange (L362) → setSettleAmt()
[E13] ohCompany[회사부담금].ValueChange (L369) → setSettleAmt()
[E14] ohEtc[기타금액].ValueChange (L375) → setSettleAmt()
[E15] updateButton[저장].Select (L382) → preUpdate()
[E16] journalButton[분개재생성].Select (L388) → createJournal()
[E17] closeButton[닫기].Select ["NEW".equals(actionName)] (L394) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L144-163 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L165-218 | openNew | 상태 처리 | 업무 |
| private setting() | L220-406 | open | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private getEditor() | L408-515 | open | 상태 처리 | 업무 |
| private getGenLedger() | L517-578 | E3,setting | 서비스 ast.Ast21_Tr4Insure.selectGenLedgerInsure(companyId, date) | 업무 |
| private setSettleAmt() | L580-678 | E4,E5,E6,E7,E8,E9,E10,E11,E12,E13,E14,getGenLedger | 상태 처리 | 업무 |
| public preUpdate() | L680-708 | E15 | 상태 처리 | 업무 |
| private update() | L710-729 | preUpdate | 서비스 ast.Ast06_Tr.update4Insure | 업무 |
| private createJournal() | L731-761 | E16,update | 서비스 act.Act02_Journal.createJournal(companyId, personId, procType, trId, trCode, exceptYn) | 업무 |
| private success() | L763-785 | createJournal | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private updateDepositBook() | L787-799 | success | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setHtmlStyle() | L801-803 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L805-807 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

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

