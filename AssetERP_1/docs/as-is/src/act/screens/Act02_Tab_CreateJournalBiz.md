# Act02_Tab_CreateJournalBiz

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 급여/카드 회계처리 (#1180)
- 파일: `client/vi/act/Act02_Tab_CreateJournalBiz.java`
- 함께 쓰는 클래스 1개:
  - `Act02_Grid_CreateJournalBiz` `client/vi/act/Act02_Grid_CreateJournalBiz.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.createJournalBiz` | Act02_Tab_CreateJournalBiz:222 | [`Act02_Journal.java:104`](../../act/services/Act02_Journal.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`act02_journal.createJournalPayMonth`](../../act/sql/act02_journal.md), [`act02_journal.selectOneJournalIdByTrId`](../../act/sql/act02_journal.md), [`act80_relate_appr.insert`](../../act/sql/act80_relate_appr.md), [`ast06_tr.insert`](../../ast/sql/ast06_tr.md), [`biz01_promo.selectBizCard`](../../biz/sql/biz01_promo.md), [`biz20_fee_charge.selectByTrCode`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.updateTrId`](../../biz/sql/biz20_fee_charge.md), [`biz55_erp_fee_charge.selectByChargeDate`](../../biz/sql/biz55_erp_fee_charge.md), [`biz55_erp_fee_charge.updateTrId`](../../biz/sql/biz55_erp_fee_charge.md), [`dbConfig.getLastDay`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `act.Act02_Journal.deleteJournalBiz` | Act02_Tab_CreateJournalBiz:294 | [`Act02_Journal.java:329`](../../act/services/Act02_Journal.md) | [`act02_journal.deleteByBizId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByJournalId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByBizId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByBizId`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast06_tr.selectByDate`](../../ast/sql/ast06_tr.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`biz01_promo.selectBizCard`](../../biz/sql/biz01_promo.md), [`biz20_fee_charge.selectByTrCode`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.updateTrId`](../../biz/sql/biz20_fee_charge.md), [`biz55_erp_fee_charge.selectByChargeDate`](../../biz/sql/biz55_erp_fee_charge.md), [`biz55_erp_fee_charge.updateTrId`](../../biz/sql/biz55_erp_fee_charge.md), [`dbConfig.getLastDay`](../../utils/sql/dbConfig.md) |
| `act.Act02_Journal.selectMonthBiz` | Act02_Tab_CreateJournalBiz:157 | [`Act02_Journal.java:49`](../../act/services/Act02_Journal.md) | [`act02_journal.selectMonthBiz`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectBizCard` | Act02_Grid_CreateJournalBiz:303 | [`Act03_JournalDtl.java:51`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectBizCard`](../../act/sql/act03_journal_dtl.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Act02_Grid_CreateJournalBiz:332 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act03_JournalDtl.selectChargeFee` | Act02_Grid_CreateJournalBiz:323 | [`Act03_JournalDtl.java:57`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectChargeFee`](../../act/sql/act03_journal_dtl.md) |
| `act.Act03_JournalDtl.selectErpChargeFee` | Act02_Grid_CreateJournalBiz:328 | [`Act03_JournalDtl.java:63`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectErpChargeFee`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Act02_Tab_CreateJournalBiz:342 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.updateDeposit` | Act02_Tab_CreateJournalBiz:322 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md), [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz55_erp_fee_charge`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_create_depositbook`, `f_create_journal`, `f_create_journalpaymonth`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_last_day`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Tab_CreateJournalBiz (`client/vi/act/Act02_Tab_CreateJournalBiz.java`, 383줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 기준년월: {stdMonth} {retrieveButton} {createButton} {deleteButton}
- 입력·하위 화면: `stdMonth` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - note 300 "구분" Text
  - trCount 100 "건수" Long
  - journalAmt 150 "발생금액" Long
  - bizCloseYn 120 "확정구분" TextCenter
  - journalYn 120 "전표발생" TextCenter
  - fixYnName 120 "전표승인" TextCenter
  - accountCloseYn 120 "회계마감" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L58-77) → setting()
[E1] stdMonth.KeyPress [Enter] (L86) → retrieve()
[E2] retrieveButton[조회].Select (L104) → retrieve()
[E3] createButton[전표발생].Select (L110) → createJournalChk()
[E4] deleteButton[전표삭제].Select (L116) → deleteJournalChk()
       └ [E7] msgBox.DialogHide [YES] (L249) → deleteJournal()
[E5] grid.RowClick (L123) → retrievePage()
[E6] msgBox.DialogHide [YES] (L177) → createJournal()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L79-131 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L150-167 | E1,E2,setting,createJournal,deleteJournal | 서비스 act.Act02_Journal.selectMonthBiz(companyId, stdMonth) | 업무 |
| private retrievePage() | L169-172 | E5,retrieve | 상태 처리 | 업무 |
| private createJournalChk() | L174-192 | E3 | 확인창 표시 | 업무 |
| private createJournal() | L194-244 | E6 | 서비스 act.Act02_Journal.createJournalBiz(companyId, personId, stdMonth) | 업무 |
| private deleteJournalChk() | L246-264 | E4 | ConfirmBox → E7 | 업무 |
| private deleteJournal() | L266-315 | E7 | 서비스 act.Act02_Journal.deleteJournalBiz(companyId, stdMonth) | 업무 |
| private updateDepositBook() | L317-332 | createJournal,deleteJournal | 서비스 yyyy.MM.dd, ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private checkClose() | L334-358 | createJournal,deleteJournal | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private getStdDate() | L360-366 | retrievePage,checkClose,getYYYYMM | 서비스 yyyy.MM.dd | 업무 |
| private getYYYYMM() | L368-370 | retrieve,createJournal,deleteJournal | 상태 처리 | 업무 |
| public buildGrid() | L133-148 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L380-382 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('note', 300, '구분'),  // L139
  gb.long('trCount', 100, '건수'),  // L140
  gb.long('journalAmt', 150, '발생금액'),  // L141
  gb.textCenter('bizCloseYn', 120, '확정구분'),  // L142
  gb.textCenter('journalYn', 120, '전표발생'),  // L143
  gb.textCenter('fixYnNm', 120, '전표승인'),  // L144
  gb.textCenter('accountCloseYn', 120, '회계마감'),  // L145
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={createJournalChk}>전표발생</Button>
3. <Button type="delete" onClick={deleteJournalChk}>전표삭제</Button>

### Act02_Grid_CreateJournalBiz (`client/vi/act/Act02_Grid_CreateJournalBiz.java`, 452줄)

- 레이아웃: center=grid
- 입력·하위 화면: `lookupModi` Act02_Lookup_ModiJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - date 100 "전표일자" Date
  - journalNoStr 85 "전표번호" TextCenter
  - note 200 "적요" TextArea
  - drAccountCode 100 "계정코드" TextCenter 편집:"456EA6"
  - drAstAccountName 300 "계정과목" TextArea2 편집:"456EA6"
  - drAmt 100 "금액" Long 편집:"456EA6"
  - drNote 100 "적요" TextArea2 편집:"456EA6"
  - crAccountCode 100 "계정코드" TextCenter 편집:"DD5E5E"
  - crAstAccountName 300 "계정과목" TextArea2 편집:"DD5E5E"
  - crAmt 100 "금액" Long 편집:"DD5E5E"
  - crNote 100 "적요" TextArea2 편집:"DD5E5E"
  - actionCell 60 "변경" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L42-61) → settings()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L262-266 | buildGrid | 상태 처리 | 업무 |
| public gridClear() | L268-270 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L294-350 | buildGrid | 서비스 act.Act03_JournalDtl.selectBizCard, act.Act03_JournalDtl.selectChargeFee, act.Act03_JournalDtl.selectErpChargeFee, act.Act03_JournalDtl.selectByJournalId(companyId, stdMonth, companyId, stdMonth, trCode, manageType, chargeDate, trCode, journalId) | 업무 |
| public update() | L353-375 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L378-398 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L401-413 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L63-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L87-233 | 필드 초기화 | 조회창 Act02_Lookup_ModiJournal 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L448-451 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L207 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle14 100 "차변" (act03_new_header_group_map05new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L208 newHeaderGroupMap08newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map08new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.date('date', 100, '전표일자'),  // L211
  // ⚠DB없음 L212 journalNoStr 85 "전표번호" (act03_journal_no_str 컬럼 없음)
  gb.textArea('note', 200, '적요'),  // L213
  gb.textCenter('drAccountCd', 100, '계정코드'),  // L214
  // ⚠ 대응 없음 (GridBuilder L215) addTextArea2
  gb.long('drAmt', 100, '금액'),  // L216
  // ⚠ 대응 없음 (GridBuilder L218) addTextArea2
  gb.textCenter('crAccountCd', 100, '계정코드'),  // L219
  // ⚠ 대응 없음 (GridBuilder L220) addTextArea2
  gb.long('crAmt', 100, '금액'),  // L221
  // ⚠ 대응 없음 (GridBuilder L223) addTextArea2
  // ⚠ 대응 없음 (GridBuilder L224) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

