# Act04_Tab_GenLedger

- 종류: 화면
- 메뉴: 관리회계 > 21. 회계장부 > 계정과목집계표 (#1151)
- 파일: `client/vi/act/Act04_Tab_GenLedger.java`
- 함께 쓰는 클래스 2개:
  - `Act04_Lookup_GenLedger` `client/vi/act/Act04_Lookup_GenLedger.java`
  - `Act04_Lookup_AccountClose` `client/vi/act/Act04_Lookup_AccountClose.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.insertClose` | Act04_Lookup_AccountClose:128 | [`Act04_GenLedger.java:199`](../../act/services/Act04_GenLedger.md) | [`act01_account_code.selectTreeByAccountCodeAsc`](../../act/sql/act01_account_code.md), [`act02_journal.selectUnFixCount`](../../act/sql/act02_journal.md), [`act02_journal.updateCloseYn`](../../act/sql/act02_journal.md), [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.deleteGenLedgerClose`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertGenLedgerClose`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertGenLedgerCloseEicp`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertUnApprEarnSurplus`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectBookDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDate`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCountByAccountCode`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCurrYearOfficeAssetsDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectDepositApprStatus`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectDepositRealDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectFinanceBookDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectNoSlipAccount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectNoUseAccount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectNoneAccount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectPreMonthLastDay`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectRemDepnCostDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectRemDepnCostDiff2`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectTodayBalAmtByAccountCode`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.setDateInfo`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.summaryGenLedger`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.updateUnApprEarnSurplus`](../../act/sql/act04_gen_ledger.md), [`act09_account_num.insertNext`](../../act/sql/act09_account_num.md), [`act09_account_num.selectByStartDate`](../../act/sql/act09_account_num.md), [`act15_close_check.selectByText`](../../act/sql/act15_close_check.md), [`ast09_book.createDepositBookClose`](../../ast/sql/ast09_book.md), [`ast09_book.selectNoDepn`](../../ast/sql/ast09_book.md), [`ast09_book.selectNoEvalFinance`](../../ast/sql/ast09_book.md), [`ast09_book.selectNoFxEval`](../../ast/sql/ast09_book.md), [`ast30_book_fund_fee.selectFeeBookDiff`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.selectFeeBookDiff2`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.selectNoFeeEval`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getCompanyCloseDate`](../../utils/sql/dbConfig.md), [`dbConfig.getDateTimeFormat`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `act.Act04_GenLedger.selectByAccountCode` | Act04_Lookup_GenLedger:117 | [`Act04_GenLedger.java:63`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.selectByAccountCode`](../../act/sql/act04_gen_ledger.md) |
| `act.Act04_GenLedger.selectByStdDate1` | Act04_Tab_GenLedger:247 | [`Act04_GenLedger.java:39`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.selectByStdDate1`](../../act/sql/act04_gen_ledger.md) |
| `act.Act04_GenLedger.selectByStdDate2` | Act04_Tab_GenLedger:249 | [`Act04_GenLedger.java:45`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.selectByStdDate2`](../../act/sql/act04_gen_ledger.md) |
| `act.Act04_GenLedger.selectCloseStatus` | Act04_Lookup_AccountClose:116 | [`Act04_GenLedger.java:51`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.selectCloseStatus`](../../act/sql/act04_gen_ledger.md) |
| `act.Act04_GenLedger.summaryGenLedger` | Act04_Tab_GenLedger:309 | [`Act04_GenLedger.java:147`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.summaryGenLedger`](../../act/sql/act04_gen_ledger.md) |
| `sys.Sys99_Print.insertRdGenLedger` | Act04_Tab_GenLedger:137 | [`Sys99_Print.java:1615`](../../sys/services/Sys99_Print.md) | [`act04_gen_ledger.selectByStdDate1`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectByStdDate2`](../../act/sql/act04_gen_ledger.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), `act01list` ⚠DB없음, [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act09_account_num`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`act15_close_check`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`ast80_relate_appr`](../../../db/tables/ast.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz17_dual_manage_fund`](../../../db/tables/biz.md), [`icam10_fee`](../../../db/tables/icam.md), [`icam12_fee_book`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_calc_dual_fund_fee`, `f_cdnm`, `f_create_depositbook_close`, `f_create_genledger`, `f_create_genledgerclose_eicp`, `f_create_seq`, `f_get_account_close_date`, `f_get_account_nm`, `f_get_close_date`, `f_get_journal_tr_cd`, `f_get_last_day`, `f_get_quarter_date`, `f_get_real_account_code`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act04_Tab_GenLedger (`client/vi/act/Act04_Tab_GenLedger.java`, 353줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일자: {stdDate} 증감구분: {comboBoxDiffType} 계정코드/명: {searchText} {retrieveButton} {downLoadButton} {updateButton}
- 입력·하위 화면: `stdDate` MyDateField, `comboBoxDiffType` ComboBoxField("GenLedgerDiffType"), `searchText` TextField, `lookupAccountClose` Act04_Lookup_AccountClose, `lookup` Act04_Lookup_GenLedger
- 그리드 `grid` (buildGrid()):
  - accountCode 120 "계정코드" TextCenter
  - accountName2 300 "계정과목" TextArea
  - drTodayBalAmt 150 "차변당일잔고액" Long 편집:"456EA6"
  - drTodayDiffAmt 150 "차변당일증감액" Long 편집:"456EA6"
  - drPredayBalAmt 150 "차변전일잔고액" Long 편집:"456EA6"
  - crTodayBalAmt 150 "대변당일잔고액" Long 편집:"DD5E5E"
  - crTodayDiffAmt 150 "대변당일증감액" Long 편집:"DD5E5E"
  - crPredayBalAmt 150 "대변전일잔고액" Long 편집:"DD5E5E"
  - todayBalAmt 150 "당일잔고액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L64-96) → settings()
[E1] comboBoxDiffType[GenLedgerDiffType].Collapse (L104) → retrieve()
[E2] searchText.KeyPress [Enter] (L113) → retrieve()
[E3] retrieveButton[조회].Select (L122) → retrieve()
[E4] downLoadButton[출력/다운로드].Select (L128) → 서비스 sys.Sys99_Print.insertRdGenLedger(companyId, personId, windowClassName, stdDate, diffType, searchText)
[E5] updateButton[계정원장 정리].Select (L176) → summaryGenLedger()
       └ [E8] msgBox.DialogHide [YES] (L303) → retrieve()
[E6] accountCloseButton[회계마감].Select (L182) → 인라인 L182-188 (new SelectHandler() { @Override publi…)
[E7] grid.CellDoubleClick (L189) → 메시지 "기준일자를 선택해주세요 / 계정코드가 없습니다"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L227-289 | E1,E2,E3,E8 | 서비스 act.Act04_GenLedger.selectByStdDate1, act.Act04_GenLedger.selectByStdDate2(companyId, stdDate, diffType, searchText) | 업무 |
| public summaryGenLedger() | L291-338 | E5 | ConfirmBox → E8 | 업무 |
| private settings() | L98-206 | 생성자 | 조회창 Act04_Lookup_AccountClose 열기, 조회창 Act04_Lookup_GenLedger 열기, 미선택 시 alert "기준일자를 선택해주세요", 서비스 sys.Sys99_Print.insertRdGenLedger(companyId, personId, windowClassName, stdDate, diffType, searchText), 이벤트 연결, 초기값: stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L208-225 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L344-347 | retrieve | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L349-351 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('accountCd', 120, '계정코드'),  // L214
  gb.textArea('accountNm2', 300, '계정과목'),  // L215 SQL 계산 컬럼(selectByStdDate1: CASE WHEN COALESCE(act01_use_yn,'false'…)
  gb.long('drTodayBalAmt', 150, '차변당일잔고액'),  // L216
  gb.long('drTodayDiffAmt', 150, '차변당일증감액'),  // L217
  gb.long('drPredayBalAmt', 150, '차변전일잔고액'),  // L218
  gb.long('crTodayBalAmt', 150, '대변당일잔고액'),  // L219
  gb.long('crTodayDiffAmt', 150, '대변당일증감액'),  // L220
  gb.long('crPredayBalAmt', 150, '대변전일잔고액'),  // L221
  gb.long('todayBalAmt', 150, '당일잔고액'),  // L222 SQL 계산 컬럼(selectByStdDate1: (SUM(act04_dr_today_bal_amt) - SUM(act0…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdGenLedger(companyId, personId, windowClassName, stdDate, diffType, searchText) */}>출력/다운로드</Button>
3. <Button type="view" onClick={summaryGenLedger}>계정원장 정리</Button>
4. <Button type="save" onClick={() => /* 인라인 L182-188 (new SelectHandler() { @Override publi…) */}>회계마감</Button>

### Act04_Lookup_GenLedger (`client/vi/act/Act04_Lookup_GenLedger.java`, 170줄)

- 툴바 `buttonBar`: {retrieveButton} {expandAll} {collapseAll}
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - accountCode 120 "계정코드" TextCenter
  - accountName2 390 "계정과목" Text
  - todayBalAmt 150 "당일잔고액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L54-77) → settings(), show()
[E1] retrieveButton[조회].Select (L80) → retrieve()
[E2] expandAll[펼치기].Select (L86) → 인라인 L86-91 (new SelectHandler(){ @Override public…)
[E3] collapseAll[감추기].Select (L92) → 인라인 L92-97 (new SelectHandler(){ @Override public…)
[E4] closeButton[닫기].Select (L98) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L48-52 | 공개 메서드 | 상태 처리 | 업무 |
| public buildTreeGrid() | L106-114 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L116-127 | E1,open | 서비스 act.Act04_GenLedger.selectByAccountCode(companyId, accountCode, stdDate) | 업무 |
| private addChildItem() | L129-138 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L141-160 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L79-104 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L162-164 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L166-169 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.textCenter('accountCd', 120, '계정코드'),  // L109
  gb.text('accountNm2', 390, '계정과목'),  // L110 SQL 계산 컬럼(selectByAccountCode: a.act01_account_nm2|| CASE WHEN COALESC…)
  gb.long('todayBalAmt', 150, '당일잔고액'),  // L111 SQL 계산 컬럼(selectByAccountCode: (b.act04_dr_today_bal_amt - b.act04_cr_…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L86-91 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L92-97 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Act04_Lookup_AccountClose (`client/vi/act/Act04_Lookup_AccountClose.java`, 160줄)

- 툴바 `buttonBar`: 회계년도: {yearField} {retrieveButton} {accountCloseButton} {accountCancelButton}
- 입력·하위 화면: `yearField` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - monthName 80 "마감월" TextCenter
  - stdDate 120 "마감일" Date
  - closeName 150 "마감여부" TextCenter

#### 이벤트
[E1] retrieveButton[조회].Select (L76) → retrieve()
[E2] accountCloseButton[회계마감].Select (L82) → update()
[E3] accountCancelButton[마감취소].Select (L88) → update()
[E4] closeButton[닫기].Select (L94) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L42-69 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L112-117 | E1,open,update | 서비스 act.Act04_GenLedger.selectCloseStatus(companyId, year) | 업무 |
| public update() | L119-150 | E2,E3 | 미선택 시 alert "선택된 월이 없습니다.", 서비스 act.Act04_GenLedger.insertClose(companyId, closeDate, procType) | 업무 |
| private settings() | L71-100 | open | 이벤트 연결, 초기값: yearField=LoginUser.getTodayString( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L102-110 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L152-154 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L156-158 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('monthNm', 80, '마감월'),  // L106 SQL 계산 컬럼(selectCloseStatus: f_cdnm('MonthsCode', substr(sys12_yyyym…)
  gb.date('stdDate', 120, '마감일'),  // L107
  gb.textCenter('closeNm', 150, '마감여부'),  // L108 SQL 계산 컬럼(selectCloseStatus: CASE WHEN COALESCE(act04_close_count,0)…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>회계마감</Button>
3. <Button type="cancel" onClick={update}>마감취소</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

