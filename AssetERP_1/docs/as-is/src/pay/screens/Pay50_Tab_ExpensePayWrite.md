# Pay50_Tab_ExpensePayWrite

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 자금집행결의서 (#1386)
- 파일: `client/vi/pay/Pay50_Tab_ExpensePayWrite.java`
- 함께 쓰는 클래스 2개:
  - `Pay50_Lookup_UpdateDeposit` `client/vi/pay/Pay50_Lookup_UpdateDeposit.java`
  - `Pay50_Lookup_NewExpenseApprList` `client/vi/pay/Pay50_Lookup_NewExpenseApprList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys15_Lookup_TelInfo`](../../sys/components/Sys15_Lookup_TelInfo.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay50_Tab_ExpensePayWrite:430, Pay50_Tab_ExpensePayWrite:466 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay50_Tab_ExpensePayWrite:705 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `pay.Pay50_Expense.initExpenseSettle` | Pay50_Tab_ExpensePayWrite:575 | [`Pay50_Expense.java:351`](../../pay/services/Pay50_Expense.md) | [`apr01_appr.selectByApprId3`](../../apr/sql/apr01_appr.md), [`ast07_settle.countByExpenseId`](../../ast/sql/ast07_settle.md), [`pay50_expense.deleteById`](../../pay/sql/pay50_expense.md), [`pay50_expense.initExpenseSettle`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.selectExpensePay` | Pay50_Tab_ExpensePayWrite:509 | [`Pay50_Expense.java:91`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectExpensePay`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.selectNewExpenseAppr` | Pay50_Lookup_NewExpenseApprList:168, Pay50_Tab_ExpensePayWrite:320 | [`Pay50_Expense.java:85`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectNewExpenseAppr`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.update` | Pay50_Tab_ExpensePayWrite:562 | [`Pay50_Expense.java:979`](../../pay/services/Pay50_Expense.md) | `UpdateDataModel(pay50_expense)` 동적 INSERT/UPDATE → [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateDeposit` | Pay50_Lookup_UpdateDeposit:147 | [`Pay50_Expense.java:456`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.updateDepositId`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateSettleEmpId` | Pay50_Tab_ExpensePayWrite:352 | [`Pay50_Expense.java:241`](../../pay/services/Pay50_Expense.md) | [`ast06_tr.updateExpenseId`](../../ast/sql/ast06_tr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.insertExpense`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateSettleEmpId`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updatesSttleApprId` | Pay50_Tab_ExpensePayWrite:756 | [`Pay50_Expense.java:226`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.updateSettleApprId`](../../pay/sql/pay50_expense.md) |
| `sys.Sys99_Print.insertRdExpensePay` | Pay50_Tab_ExpensePayWrite:797 | [`Sys99_Print.java:4285`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.selectExpensePay`](../../pay/sql/pay50_expense.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`crd01_card`](../../../db/tables/crd.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp14_account`](../../../db/tables/emp.md), [`emp17_benefit`](../../../db/tables/emp.md), [`emp50_transport_expense`](../../../db/tables/emp.md), [`emp51_relate_appr`](../../../db/tables/emp.md), [`emp52_relate_appr`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Tab_ExpensePayWrite (`client/vi/pay/Pay50_Tab_ExpensePayWrite.java`, 869줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 구분: {expenseComboBox} 지급여부: {payYnComboBox} 검색: {searchText} {statusCheckBox} {retrieveButton} {deleteButton}
- 툴바 `buttonBar02`: {apprButton} {updateButton} {selectUpdateButton} {downloadButton} {rdFileDownloadForm} {msgHlc}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="지출내역/지출처", `expenseComboBox` ComboBoxField("ExpenseType", "%", "전체", "전체"), `payYnComboBox` ComboBoxField("PayYnCode", "%", "전체"), `statusCheckBox` CheckBox, `lookup` Pay50_Lookup_UpdateDeposit, `payMethodCombo` ComboBoxField("PayMethodCode"), `lookupDeposit` LookupTriggerField, `editor` Apr01_Edit_ApprDoc, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - dueDate 90 "지급요청일" Date
  - expenseName 100 "구분" Text
  - desc 200 "지출내역" Text
  - corpName 150 "지출처" Text
  - settleAmt 100 "지급금액" Long
  - payMethodName 100 "지급방법" TextCenter 편집:"0069B4"
  - payAccountInfo 200 "지급요청계좌" Text 편집:"0069B4"
  - settleDate 90 "자금집행일" Date 편집:"0069B4"
  - depositName 150 "출금계좌" Text 편집:"0069B4"
  - settleNote 130 "비고" Text 편집:"0069B4"
  - actionCell 80 "지출결의서" Cell 편집:expenseApprViewCell
  - settleApprStatusName 65 "집행결의서" TextCenter
  - actionCell 30 "" Cell 편집:apprViewCell
  - payYn 60 "지급여부" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L119-171) → settings()
[E1] expenseComboBox[ExpenseType].Collapse (L188) → retrieve()
[E2] payYnComboBox[PayYnCode].Collapse (L197) → retrieve()
[E3] searchText.KeyPress [Enter] (L206) → retrieve()
[E4] grid.CellDoubleClick [event.getCellIndex() == 5] (L220) → lookupOpenCorpInfo()
[E5] refresh.MouseDown (L230) → setAnchorText()
[E6] hiperLink[<b>자금집행 예정내역 가져오기</b>].MouseDown (L237) → lookupNewExpenseAppr()
[E7] retrieveButton[조회].Select (L244) → retrieve()
[E8] updateButton[저장].Select (L250) → preUpdate()
[E9] selectUpdateButton[일괄저장].Select (L256) → lookupUpdateDeposit()
[E10] deleteButton[삭제].Select (L262) → preDelete()
       └ [E15] msgBox.DialogHide [YES] (L568) → execute(), retrieve()
[E11] apprButton[상신].Select (L268) → apprCheck()
       └ [E16] msgBox.DialogHide [YES] (L687) → apprSelect()
[E12] downloadButton[엑셀다운로드].Select (L274) → createRdExcel()
[E13] payMethodCombo[PayMethodCode].Collapse (L370) → 인라인 L370-376 (new CollapseHandler() { @Override pub…)
[E14] lookupDeposit.TriggerClick (L380) → lookupDeposit()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L90-93 | E15,lookupUpdateDeposit,lookupNewExpenseAppr,buildGrid,viewExpenseAppr,viewAppr,retrieve,lookupDeposit,apprSelect,insertLinkApproval | 상태 처리 | 업무 |
| private lookupUpdateDeposit() | L282-310 | E9 | 조회창 Pay50_Lookup_UpdateDeposit 열기 | 업무 |
| private setAnchorText() | L312-339 | E5,settings,retrieve | 서비스 pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType, searchText) | 업무 |
| private lookupNewExpenseAppr() | L341-366 | E6 | 조회창 Pay50_Lookup_NewExpenseApprList 열기, 서비스 pay.Pay50_Expense.updateSettleEmpId(settleEmpId) | 업무 |
| private viewExpenseAppr() | L425-459 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById | 업무 |
| private viewAppr() | L461-495 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById | 업무 |
| private retrieve() | L497-516 | E1,E2,E3,E7,E15,execute,lookupUpdateDeposit,lookupNewExpenseAppr,updateExpenseApprId | 서비스 pay.Pay50_Expense.selectExpensePay(companyId, startDate, closeDate, expenseCode, payYnCode, statusCheckYn, searchText) | 업무 |
| private preUpdate() | L518-558 | E8 | 상태 처리 | 업무 |
| private update() | L560-563 | preUpdate | 서비스 pay.Pay50_Expense.update | 업무 |
| private preDelete() | L565-597 | E10 | ConfirmBox → E15 | 업무 |
| private lookupDeposit() | L599-632 | E14 | 조회창 Ast01_Lookup_CorpAccount 열기, 미선택 시 alert "자금집행일을 선택하세요" | 업무 |
| private apprCheck() | L634-702 | E11 | 미선택 시 alert "상신할 내용을 선택해주세요" → 확인창 E16 | 업무 |
| private apprSelect() | L704-734 | E16 | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L736-752 | apprSelect | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateExpenseApprId() | L755-767 | insertLinkApproval | 서비스 pay.Pay50_Expense.updatesSttleApprId(settleApprId) | 업무 |
| private checkApprStatus() | L769-787 | preUpdate,apprCheck | 상태 처리 | 업무 |
| private lookupOpenCorpInfo() | L789-792 | E4 | 조회창 Sys15_Lookup_TelInfo 열기 | 업무 |
| private createRdExcel() | L794-850 | E12 | 서비스 sys.Sys99_Print.insertRdExpensePay(companyId, personId, windowClassName, startDate, closeDate, expenseCode, payYnCode, statusCheckYn, searchText) | 업무 |
| private getStartDate() | L852-855 | createRdExcel | 상태 처리 | 업무 |
| private getCloseDate() | L857-860 | createRdExcel | 상태 처리 | 업무 |
| private settings() | L173-280 | 생성자 | 이벤트 연결, 초기값: startDate=start, closeDate=close, statusCheckBox=true | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L368-423 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L862-864 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L865-867 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('dueDate', 90, '지급요청일'),  // L404
  gb.text('expenseNm', 100, '구분'),  // L405
  gb.text('desc', 200, '지출내역'),  // L406
  gb.text('corpNm', 150, '지출처'),  // L407
  gb.long('settleAmt', 100, '지급금액'),  // L408
  gb.textCenter('payMethodNm', 100, '지급방법'),  // L409
  gb.text('payAccountInfo', 200, '지급요청계좌', { editor: 'text' }),  // L410
  gb.date('settleDate', 90, '자금집행일', { editor: 'date' }),  // L411
  gb.text('depositNm', 150, '출금계좌'),  // L412
  gb.text('settleNote', 130, '비고', { editor: 'text' }),  // L413
  // ⚠ 대응 없음 (GridBuilder L414) addCell
  gb.textCenter('settleApprStatusNm', 65, '집행결의서'),  // L415
  // ⚠ 대응 없음 (GridBuilder L416) addCell
  gb.booleanYn2('payYn', 60, '지급여부'),  // L417
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={preDelete}>삭제</Button>
3. <Button type="register" onClick={apprCheck}>상신</Button>
4. <Button type="save" onClick={preUpdate}>저장</Button>
5. <Button type="save" onClick={lookupUpdateDeposit}>일괄저장</Button>
6. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

### Pay50_Lookup_UpdateDeposit (`client/vi/pay/Pay50_Lookup_UpdateDeposit.java`, 173줄)

- 입력·하위 화면: `depositId` LongField, `depositName` LookupTriggerField, `settleDate` MyDateField, `lookup` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L55-77) → show()
[E1] depositName[출금계좌].TriggerClick (L88) → lookupDeposit()
[E2] updateButton[저장].Select (L95) → update()
[E3] closeButton[닫기].Select (L102) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L79-82 | 공개 메서드 | 상태 처리 | 업무 |
| private lookupDeposit() | L110-130 | E1 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private update() | L132-163 | E2 | 미선택 시 alert "자금집행일을 선택하세요", 서비스 pay.Pay50_Expense.updateDeposit(settleDate, depositId) | 업무 |
| private settings() | L84-108 | open | 이벤트 연결, 초기값: settleDate=LoginUser.getToday(("자금집행일") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L165-167 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L169-171 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay50_Lookup_NewExpenseApprList (`client/vi/pay/Pay50_Lookup_NewExpenseApprList.java`, 196줄)

- 툴바 `buttonBar`: 구분: {expenseComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `expenseComboBox` ComboBoxField("ExpenseType", "%", "전체"), `searchText` TextField 빈칸="구분/지출내역/지출처"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - dueDate 100 "지급요청일" Date
  - occDate 100 "발생일" Date
  - expenseName 100 "구분" Text
  - desc 400 "지출내역" TextArea
  - corpName 150 "지출처" Text
  - settleAmt 120 "지출금액" Long
  - payMethodName 100 "지급방법" TextCenter
  - payAccountInfo 200 "지급요청계좌" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-59) → 초기화
[E1] expenseComboBox[ExpenseType].Collapse (L93) → retrieve()
[E2] searchText.KeyPress [Enter] (L102) → retrieve()
[E3] retrieveButton[조회].Select (L111) → retrieve()
[E4] selectButton[선택].Select (L117) → confirm()
[E5] cancelButton[닫기].Select (L123) → hide()
[E6] grid.CellDoubleClick (L130) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-86 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L159-174 | E1,E2,E3,open | 서비스 pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType, expenseCode, searchText) | 업무 |
| public confirm() | L176-187 | E4,E6 | 미선택 시 alert "선택된 내역이 없습니다" | 업무 |
| private settings() | L88-136 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L138-157 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L189-191 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L192-194 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('dueDate', 100, '지급요청일'),  // L144
  gb.date('occDate', 100, '발생일'),  // L145
  gb.text('expenseNm', 100, '구분'),  // L146
  gb.textArea('desc', 400, '지출내역'),  // L147
  gb.text('corpNm', 150, '지출처'),  // L148
  gb.long('settleAmt', 120, '지출금액'),  // L149
  gb.textCenter('payMethodNm', 100, '지급방법'),  // L150
  gb.text('payAccountInfo', 200, '지급요청계좌'),  // L151
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

