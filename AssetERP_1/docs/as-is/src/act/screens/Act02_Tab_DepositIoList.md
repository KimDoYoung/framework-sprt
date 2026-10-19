# Act02_Tab_DepositIoList

- 종류: 화면
- 메뉴: 자금관리 > 10. 자금관리 > 일일자금관리 (#1164)
- 메뉴: 고유자산 > 40. 예금관리 > 일일자금관리 (#1470)
- 파일: `client/vi/act/Act02_Tab_DepositIoList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByAstId` | Act02_Tab_DepositIoList:358 | [`Act03_JournalDtl.java:69`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByAstId`](../../act/sql/act03_journal_dtl.md) |
| `apr.Apr01_Appr.selectById` | Act02_Tab_DepositIoList:243 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `ast.Ast09_Book.createDepositBook` | Act02_Tab_DepositIoList:485 | [`Ast09_Book.java:163`](../../ast/services/Ast09_Book.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast09_Book.selectByHoldDate` | Act02_Tab_DepositIoList:334 | [`Ast09_Book.java:28`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md) |
| `ast.Ast09_Book.selectDepositCurGroupSum` | Act02_Tab_DepositIoList:350 | [`Ast09_Book.java:148`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectDepositCurGroupSum`](../../ast/sql/ast09_book.md) |
| `ast.Ast80_RelateAppr.insert` | Act02_Tab_DepositIoList:411 | [`Ast80_RelateAppr.java:58`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.deleteByApprId`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.insert`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast80_RelateAppr.selectByCompanyId` | Act02_Tab_DepositIoList:518 | [`Ast80_RelateAppr.java:26`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) |
| `ast.Ast80_RelateAppr.updateApprId` | Act02_Tab_DepositIoList:458 | [`Ast80_RelateAppr.java:95`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.updateApprId`](../../ast/sql/ast80_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Act02_Tab_DepositIoList:141 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys99_Print.insertRdDepositIoList` | Act02_Tab_DepositIoList:188, Act02_Tab_DepositIoList:422 | [`Sys99_Print.java:705`](../../sys/services/Sys99_Print.md) | [`act03_journal_dtl.selectByAstId`](../../act/sql/act03_journal_dtl.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md), [`sys99_print.updateDepositOutData`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`ast80_relate_appr`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depositbook`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_sellpossibleqty`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Tab_DepositIoList (`client/vi/act/Act02_Tab_DepositIoList.java`, 573줄)

- 레이아웃: north=buttonBar, center=vlc02
- 툴바 `buttonBar`: 기준일: {stdDate} {retrieveButton} {rdButton} {depositButton}
- 입력·하위 화면: `stdDate` MyDateField, `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - astClassTreeName 200 "계좌" Text
  - curCode 55 "통화" TextCenter
  - preDayAmt 120 "기초잔액<br>(전일잔액)" DoubleHtml
  - holdQty 120 "마감잔액<br>(당일잔액)" DoubleHtml
- 그리드 `sumGrid` (buildSumGrid()):
  - curCode 255 "통화별 합계" TextCenter
  - preDayAmt 120 "기초잔액" Double
  - holdQty 120 "마감잔액" Double
- 그리드 `inGrid` (buildInGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - trName 100 "거래유형" TextArea
  - corpName 150 "거래처" TextArea
  - note 200 "적요" TextArea
  - drForAmt 120 "금액" Double
- 그리드 `outGrid` (buildOutGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - trName 100 "거래유형" TextArea
  - corpName 150 "거래처" TextArea
  - note 200 "적요" TextArea
  - crForAmt 120 "금액" Double

#### 이벤트
[E0] 화면 열림 (생성자 L92-138) → settings(), defaultName(), retrieve()
[E1] stdDate.ValueChange (L168) → retrieve()
[E2] retrieveButton[조회].Select (L179) → retrieve()
[E3] rdButton[출력/다운로드].Select [result.getStatus() == 1] (L185) → getGridList()
[E4] depositButton[예금잔고정리].Select (L218) → depositUpdate()
       └ [E9] msgBox.DialogHide [YES] (L478) → retrieve()
[E5] classTreeFullName[문서분류].TriggerClick (L228) → openLookupDoc()
[E6] apprButton[상신].Select (L234) → insertLinkApproval()
[E7] apprViewButton[문서보기].Select (L240) → retrieveApprStep()
[E8] grid.RowClick (L265) → retrieveInOut()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L140-160 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public buildSumGrid() | L286-295 | 필드 초기화 | 상태 처리 | 업무 |
| public buildInGrid() | L297-309 | 필드 초기화 | 상태 처리 | 업무 |
| public buildOutGrid() | L311-323 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L325-351 | 생성자,E1,E2,E9 | 서비스 ast.Ast09_Book.selectByHoldDate, ast.Ast09_Book.selectDepositCurGroupSum(companyId, holdDate, astType, searchText, companyId, holdDate, searchText) | 업무 |
| public retrieveInOut() | L353-383 | E8,retrieve | 서비스 act.Act03_JournalDtl.selectByAstId(companyId, date, astId, drCrType, companyId, date, astId, drCrType) | 업무 |
| private getGridList() | L385-391 | E3,insertLinkApproval | 상태 처리 | 업무 |
| private openLookupDoc() | L394-403 | E5 | 상태 처리 | 업무 |
| private insertLinkApproval() | L405-454 | E6 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 ast.Ast80_RelateAppr.insert, sys.Sys99_Print.insertRdDepositIoList(companyId, personId, windowClassName, holdDate) | 업무 |
| private updateApprId() | L457-470 | insertLinkApproval | 서비스 ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| private depositUpdate() | L472-513 | E4 | ConfirmBox → E9 | 업무 |
| private retrieveApprStep() | L515-564 | E7,retrieve,updateApprId | 서비스 ast.Ast80_RelateAppr.selectByCompanyId | 업무 |
| private settings() | L162-272 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 sys.Sys99_Print.insertRdDepositIoList, apr.Apr01_Appr.selectById(companyId, personId, windowClassName, holdDate), 이벤트 연결, 초기값: stdDate=startDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L274-284 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L566-568 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L570-572 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('astClassTreeNm', 200, '계좌'),  // L278 SQL 계산 컬럼(selectById: ast1.ast01_class_tree_nm)
  gb.textCenter('curCode', 55, '통화'),  // L279 SQL 계산 컬럼(selectById: COALESCE(ast1.ast01_cur_cd,'KRW'))
  // ⚠ 대응 없음 (GridBuilder L280) addDoubleHtml
  // ⚠ 대응 없음 (GridBuilder L281) addDoubleHtml
];

const buildSumGrid = () => [
  gb.textCenter('curCode', 255, '통화별 합계'),  // L290 SQL 계산 컬럼(selectById: COALESCE(ast1.ast01_cur_cd,'KRW'))
  gb.double('preDayAmt', 120, '기초잔액'),  // L291 SQL 계산 컬럼(selectByHoldDate: coalesce(( SELECT holdQty FROM ( SELECT…)
  gb.double('holdQty', 120, '마감잔액'),  // L292
];

const buildInGrid = () => [
  // ⚠DB없음 L301 newHeaderGroupMap01newHeaderGroupConfig14 100 "입 금" (act03_new_header_group_map01new_header_group_config14 컬럼 없음)
  gb.textArea('trNm', 100, '거래유형'),  // L303
  gb.textArea('corpNm', 150, '거래처'),  // L304
  gb.textArea('note', 200, '적요'),  // L305
  gb.double('drForAmt', 120, '금액'),  // L306
];

const buildOutGrid = () => [
  // ⚠DB없음 L315 newHeaderGroupMap01newHeaderGroupConfig14 100 "출 금" (act03_new_header_group_map01new_header_group_config14 컬럼 없음)
  gb.textArea('trNm', 100, '거래유형'),  // L317
  gb.textArea('corpNm', 150, '거래처'),  // L318
  gb.textArea('note', 200, '적요'),  // L319
  gb.double('crForAmt', 120, '금액'),  // L320
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={getGridList}>출력/다운로드</Button>
3. <Button type="view" onClick={depositUpdate}>예금잔고정리</Button>
4. <Button type="register" onClick={insertLinkApproval}>상신</Button>
5. <Button type="search" onClick={retrieveApprStep}>문서보기</Button>

