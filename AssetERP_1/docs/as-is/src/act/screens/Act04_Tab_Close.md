# Act04_Tab_Close

- 종류: 화면
- 메뉴: 관리회계 > 20. 결산 > 회계마감 (#1195)
- 파일: `client/vi/act/Act04_Tab_Close.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.insertClose` | Act04_Tab_Close:218 | [`Act04_GenLedger.java:199`](../../act/services/Act04_GenLedger.md) | [`act01_account_code.selectTreeByAccountCodeAsc`](../../act/sql/act01_account_code.md), [`act02_journal.selectUnFixCount`](../../act/sql/act02_journal.md), [`act02_journal.updateCloseYn`](../../act/sql/act02_journal.md), [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.deleteGenLedgerClose`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertGenLedgerClose`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertGenLedgerCloseEicp`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertUnApprEarnSurplus`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectBookDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDate`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCountByAccountCode`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCurrYearOfficeAssetsDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectDepositApprStatus`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectDepositRealDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectFinanceBookDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectNoSlipAccount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectNoUseAccount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectNoneAccount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectPreMonthLastDay`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectRemDepnCostDiff`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectRemDepnCostDiff2`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectTodayBalAmtByAccountCode`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.setDateInfo`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.summaryGenLedger`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.updateUnApprEarnSurplus`](../../act/sql/act04_gen_ledger.md), [`act09_account_num.insertNext`](../../act/sql/act09_account_num.md), [`act09_account_num.selectByStartDate`](../../act/sql/act09_account_num.md), [`act15_close_check.selectByText`](../../act/sql/act15_close_check.md), [`ast09_book.createDepositBookClose`](../../ast/sql/ast09_book.md), [`ast09_book.selectNoDepn`](../../ast/sql/ast09_book.md), [`ast09_book.selectNoEvalFinance`](../../ast/sql/ast09_book.md), [`ast09_book.selectNoFxEval`](../../ast/sql/ast09_book.md), [`ast30_book_fund_fee.selectFeeBookDiff`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.selectFeeBookDiff2`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.selectNoFeeEval`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getCompanyCloseDate`](../../utils/sql/dbConfig.md), [`dbConfig.getDateTimeFormat`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `act.Act04_GenLedger.selectCloseStatus` | Act04_Tab_Close:166 | [`Act04_GenLedger.java:51`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.selectCloseStatus`](../../act/sql/act04_gen_ledger.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act09_account_num`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`act15_close_check`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`ast80_relate_appr`](../../../db/tables/ast.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz17_dual_manage_fund`](../../../db/tables/biz.md), [`icam10_fee`](../../../db/tables/icam.md), [`icam12_fee_book`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_calc_dual_fund_fee`, `f_cdnm`, `f_create_depositbook_close`, `f_create_genledger`, `f_create_genledgerclose_eicp`, `f_create_seq`, `f_get_account_nm`, `f_get_close_date`, `f_get_journal_tr_cd`, `f_get_last_day`, `f_get_real_account_code`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act04_Tab_Close (`client/vi/act/Act04_Tab_Close.java`, 260줄)

- 레이아웃: north=buttonBar, west=grid, center=checkGrid
- 툴바 `buttonBar`: 회계년도: {yearField} {retrieveButton} {closeCheckButton} {accountCloseButton} {accountCancelButton} {depositCheckBox} {genLedgerCheckBox}
- 입력·하위 화면: `yearField` TextField, `depositCheckBox` CheckBox, `genLedgerCheckBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - monthName 80 "마감월" TextCenter
  - stdDate 120 "마감일" Date
  - closeName 150 "마감여부" TextCenter
- 그리드 `checkGrid` (buildCheckGrid()):
  - note 900 "마감현황" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L54-92) → settings(), retrieve()
[E1] yearField.KeyPress [Enter] (L97) → retrieve()
[E2] retrieveButton[조회].Select (L112) → retrieve()
[E3] closeCheckButton[마감검증].Select (L118) → preUpdate()
       └ [E6] msgBox.DialogHide [YES] (L198) → update()
[E4] accountCloseButton[회계마감].Select (L124) → preUpdate()
[E5] accountCancelButton[마감취소].Select (L130) → preUpdate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildCheckGrid() | L148-153 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L155-175 | 생성자,E1,E2,update | 서비스 act.Act04_GenLedger.selectCloseStatus(companyId, year) | 업무 |
| private preUpdate() | L177-215 | E3,E4,E5 | 미선택 시 alert "선택된 월이 없습니다." → 확인창 E6 | 업무 |
| private update() | L217-251 | E6 | 서비스 act.Act04_GenLedger.insertClose(companyId, closeDate, procType, depositUpdateYn, genLedgerUpdateYn) | 업무 |
| private settings() | L94-136 | 생성자 | 이벤트 연결, 초기값: yearField=LoginUser.getTodayString(, depositCheckBox=true("예금잔고 정리"), genLedgerCheckBox=true("계정원장 정리") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L138-146 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L253-255 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L257-259 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('monthNm', 80, '마감월'),  // L142 SQL 계산 컬럼(selectCloseStatus: f_cdnm('MonthsCode', substr(sys12_yyyym…)
  gb.date('stdDate', 120, '마감일'),  // L143
  gb.textCenter('closeNm', 150, '마감여부'),  // L144 SQL 계산 컬럼(selectCloseStatus: CASE WHEN COALESCE(act04_close_count,0)…)
];

const buildCheckGrid = () => [
  gb.textArea('note', 900, '마감현황'),  // L151 SQL 계산 컬럼(selectDepositApprStatus: f_cdnm('AprStatusCode', apr01_status_cd…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="view" onClick={preUpdate}>마감검증</Button>
3. <Button type="save" onClick={preUpdate}>회계마감</Button>
4. <Button type="cancel" onClick={preUpdate}>마감취소</Button>

