# Pay50_Tab_ExpenseManager

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 지출결의서(경영관리) (#1385)
- 파일: `client/vi/pay/Pay50_Tab_ExpenseManager.java`
- 함께 쓰는 클래스 8개:
  - `Pay51_Lookup_ExpenseForm` `client/vi/pay/Pay51_Lookup_ExpenseForm.java`
  - `Pay50_Lookup_RejectReason` `client/vi/pay/Pay50_Lookup_RejectReason.java`
  - `Pay50_Lookup_ExpenseRequestList` `client/vi/pay/Pay50_Lookup_ExpenseRequestList.java`
  - `Pay50_Lookup_ExpenseRequestInsert` `client/vi/pay/Pay50_Lookup_ExpenseRequestInsert.java`
  - `Pay52_Lookup_AccountCode` `client/vi/pay/Pay52_Lookup_AccountCode.java`
  - `Pay50_Lookup_ExpenseCopy` `client/vi/pay/Pay50_Lookup_ExpenseCopy.java`
  - `Pay50_Lookup_Content` `client/vi/pay/Pay50_Lookup_Content.java`
  - `Pay50_Edit_Expense` `client/vi/pay/Pay50_Edit_Expense.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc2`](../../apr/components/Apr05_Lookup_LoadDoc2.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Com01_Lookup_RelateAppr`](../../com/components/Com01_Lookup_RelateAppr.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md), [`Sys17_Lookup_Account`](../../sys/components/Sys17_Lookup_Account.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay50_Lookup_ExpenseRequestInsert:870, Pay50_Tab_ExpenseManager:403 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `com.Com01_RelateAppr.delete` | Pay50_Lookup_ExpenseRequestInsert:1017 | [`Com01_RelateAppr.java:78`](../../com/services/Com01_RelateAppr.md) | `UpdateDataModel(com01_relate_appr)` 동적 DELETE |
| `com.Com01_RelateAppr.modelUpdate` | Pay50_Lookup_ExpenseRequestInsert:991 | [`Com01_RelateAppr.java:46`](../../com/services/Com01_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com01_relate_appr)` 동적 INSERT/UPDATE → [`com01_relate_appr.selectById`](../../com/sql/com01_relate_appr.md) |
| `com.Com01_RelateAppr.selectByKeyTableId` | Pay50_Lookup_ExpenseRequestInsert:963 | [`Com01_RelateAppr.java:24`](../../com/services/Com01_RelateAppr.md) | [`com01_relate_appr.selectByKeyTableId`](../../com/sql/com01_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay50_Tab_ExpenseManager:781 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `pay.Pay50_Expense.getConfirmerId` | Pay50_Lookup_ExpenseRequestInsert:206 | [`Pay50_Expense.java:133`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.getConfirmerId`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.initExpense` | Pay50_Tab_ExpenseManager:505 | [`Pay50_Expense.java:301`](../../pay/services/Pay50_Expense.md) | [`apr01_appr.selectByApprId3`](../../apr/sql/apr01_appr.md), [`pay50_expense.deleteById`](../../pay/sql/pay50_expense.md), [`pay50_expense.initExpense`](../../pay/sql/pay50_expense.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `pay.Pay50_Expense.modelUpdate` | Pay50_Lookup_ExpenseRequestInsert:1111 | [`Pay50_Expense.java:531`](../../pay/services/Pay50_Expense.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay50_expense)` 동적 INSERT/UPDATE → [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.rejectSendMessage` | Pay50_Tab_ExpenseManager:853 | [`Pay50_Expense.java:814`](../../pay/services/Pay50_Expense.md) | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`pay50_expense.getRejectSendMessageList`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateRejectSmsYn`](../../pay/sql/pay50_expense.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `pay.Pay50_Expense.selectById` | Pay50_Edit_Expense:628, Pay50_Edit_Expense:645, Pay50_Tab_ExpenseManager:482 | [`Pay50_Expense.java:40`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.selectExpenseAppr` | Pay50_Lookup_ExpenseCopy:176, Pay50_Tab_ExpenseManager:464 | [`Pay50_Expense.java:79`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectExpenseAppr`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.selectExpenseRequest` | Pay50_Lookup_ExpenseRequestList:149, Pay50_Tab_ExpenseManager:351 | [`Pay50_Expense.java:73`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectExpenseRequest`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.update` | Pay50_Edit_Expense:569 | [`Pay50_Expense.java:979`](../../pay/services/Pay50_Expense.md) | `UpdateDataModel(pay50_expense)` 동적 INSERT/UPDATE → [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateApprEmpId` | Pay50_Tab_ExpenseManager:382 | [`Pay50_Expense.java:139`](../../pay/services/Pay50_Expense.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.insertRequest`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateApprEmpId`](../../pay/sql/pay50_expense.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `pay.Pay50_Expense.updateContent` | Pay50_Lookup_Content:193 | [`Pay50_Expense.java:519`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.updateContent`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateExpenseApprId` | Pay50_Tab_ExpenseManager:839 | [`Pay50_Expense.java:211`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.updateExpenseApprId`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateRejectReason` | Pay50_Tab_ExpenseManager:663 | [`Pay50_Expense.java:506`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.updateRejectReason`](../../pay/sql/pay50_expense.md) |
| `pay.Pay51_ExpenseForm.formCheck` | Pay51_Lookup_ExpenseForm:139 | [`Pay51_ExpenseForm.java:35`](../../pay/services/Pay51_ExpenseForm.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay51_expense_form.insert`](../../pay/sql/pay51_expense_form.md), [`sys09_code.selectByExpenseForm`](../../sys/sql/sys09_code.md) |
| `pay.Pay51_ExpenseForm.formCodeCall` | Pay50_Lookup_ExpenseRequestInsert:485 | [`Pay51_ExpenseForm.java:59`](../../pay/services/Pay51_ExpenseForm.md) | [`pay51_expense_form.selectByformCode`](../../pay/sql/pay51_expense_form.md) |
| `pay.Pay51_ExpenseForm.modelUpdate` | Pay51_Lookup_ExpenseForm:162 | [`Pay51_ExpenseForm.java:72`](../../pay/services/Pay51_ExpenseForm.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay51_expense_form)` 동적 INSERT/UPDATE → [`pay51_expense_form.selectById`](../../pay/sql/pay51_expense_form.md) |
| `pay.Pay51_ExpenseForm.selectByCompanyId` | Pay51_Lookup_ExpenseForm:130 | [`Pay51_ExpenseForm.java:27`](../../pay/services/Pay51_ExpenseForm.md) | [`pay51_expense_form.selectByCompanyId`](../../pay/sql/pay51_expense_form.md) |
| `pay.Pay52_FavoriteAccount.delete` | Pay52_Lookup_AccountCode:293 | [`Pay52_FavoriteAccount.java:57`](../../pay/services/Pay52_FavoriteAccount.md) | `UpdateDataModel(pay52_favorite_account)` 동적 DELETE |
| `pay.Pay52_FavoriteAccount.insert` | Pay52_Lookup_AccountCode:258 | [`Pay52_FavoriteAccount.java:30`](../../pay/services/Pay52_FavoriteAccount.md) | [`pay52_favorite_account.countByAccountCodeId`](../../pay/sql/pay52_favorite_account.md), [`pay52_favorite_account.insert`](../../pay/sql/pay52_favorite_account.md) |
| `pay.Pay52_FavoriteAccount.selectByCompanyId` | Pay52_Lookup_AccountCode:213 | [`Pay52_FavoriteAccount.java:24`](../../pay/services/Pay52_FavoriteAccount.md) | [`pay52_favorite_account.selectByCompanyId`](../../pay/sql/pay52_favorite_account.md) |
| `pay.Pay52_FavoriteAccount.update` | Pay52_Lookup_AccountCode:276 | [`Pay52_FavoriteAccount.java:52`](../../pay/services/Pay52_FavoriteAccount.md) | `UpdateDataModel(pay52_favorite_account)` 동적 INSERT/UPDATE → [`pay52_favorite_account.selectById`](../../pay/sql/pay52_favorite_account.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay50_Lookup_ExpenseRequestInsert:145, Pay50_Tab_ExpenseManager:205 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Pay50_Lookup_ExpenseRequestInsert:970 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Pay50_Lookup_ExpenseRequestInsert:1187 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`bbs20_floral_request`](../../../db/tables/bbs.md), [`com01_relate_appr`](../../../db/tables/com.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp92_sms_notice`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay50_expense`](../../../db/tables/pay.md), [`pay51_expense_form`](../../../db/tables/pay.md), [`pay52_favorite_account`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_confirmer_parent`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Tab_ExpenseManager (`client/vi/pay/Pay50_Tab_ExpenseManager.java`, 875줄)

- 레이아웃: center=vlc, south=editForm
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 구분: {expenseComboBox} 지급방법: {payMethodComboBox} 검색: {searchText} {statusCheckBox} {retrieveButton} {deleteButton} {insertButton} {updateFormButton}
- 툴바 `buttonBar02`: {apprButton} {rejectButton} {rejectSMSButton} {rejectCancelButton} {msgHlc}
- 입력·하위 화면: `editForm` Pay50_Edit_Expense, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="구분/지출내역/지출처/요청자/비고", `statusCheckBox` CheckBox, `payMethodComboBox` ComboBoxField("PayMethodCode", "%", "전체", "전체"), `expenseComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `lookup` Pay51_Lookup_ExpenseForm, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - occDate 90 "발생일자" Date
  - dueDate 90 "지급요청일" Date
  - expenseName 100 "구분" Text
  - desc 250 "지출내역" Text
  - corpName 150 "지출처" Text
  - settleAmt 100 "지출금액" Long
  - accountName 100 "계정과목" Text
  - fileCountStr 60 "증빙자료" TextCenter
  - regDate 90 "요청일" Date
  - regEmpOrgName 150 "요청자" Text
  - expenseStatusName 70 "처리상태" TextCenter
  - expenseApprTitle 150 "상신문서명" Text
  - expenseApprStatusName 70 "상신상태" TextCenter
  - actionCell 50 "문서보기" Cell 편집:apprViewCell
  - note 150 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L108-168) → settings()
[E1] refresh.MouseDown (L187) → setAnchorText()
[E2] hiperLink[<b>지출요청내역 가져오기</b>].MouseDown (L194) → lookupRequest()
[E3] expenseComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L213) → retrieve()
[E4] payMethodComboBox[PayMethodCode].Collapse (L221) → retrieve()
[E5] searchText.KeyPress [Enter] (L230) → retrieve()
[E6] retrieveButton[조회].Select (L242) → retrieve()
[E7] deleteButton[삭제].Select (L248) → delete()
       └ [E15] msgBox.DialogHide [YES] (L498) → execute(), retrieve()
[E8] insertButton[바로등록].Select (L254) → insert()
[E9] apprButton[상신].Select (L260) → apprCheck()
       └ [E18] msgBox.DialogHide [YES] (L762) → apprSelect()
[E10] rejectButton[반려].Select (L266) → rejectCheck()
       └ [E16] msgBox.DialogHide [YES] (L575) → reject()
[E11] rejectSMSButton[반려건 일괄 알림발송].Select (L272) → rejectSMS()
[E12] rejectCancelButton[반려취소].Select (L278) → rejectCancelCheck()
       └ [E17] msgBox.DialogHide [YES] (L629) → updateReject()
[E13] updateFormButton[양식관리].Select (L284) → execute()
[E14] grid.SelectionChanged [선택>0] (L297) → retrieveEditForm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L85-87 | E13,E15,settings,buildGrid,lookupRequest,viewAppr,retrieve,insert,reject,apprSelect,insertLinkApproval | 상태 처리 | 업무 |
| private setAnchorText() | L343-369 | E1,settings,retrieve | 서비스 pay.Pay50_Expense.selectExpenseRequest(companyId, searchText) | 업무 |
| private lookupRequest() | L371-396 | E2 | 조회창 Pay50_Lookup_ExpenseRequestList 열기, 서비스 pay.Pay50_Expense.updateApprEmpId(apprEmpId) | 업무 |
| private viewAppr() | L398-433 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById | 업무 |
| private retrieveEditForm() | L435-448 | E14 | 상태 처리 | 업무 |
| public retrieve() | L450-477 | E3,E4,E5,E6,E15,settings,lookupRequest,insert,updateReject,updateExpenseApprId,rejectSMS | 서비스 pay.Pay50_Expense.selectExpenseAppr(companyId, personId, startDate, closeDate, statusCheckYn, expenseCode, payMethodCode, searchText, managerYn) | 업무 |
| private refreshOne() | L479-493 | viewAppr | 서비스 pay.Pay50_Expense.selectById(expenseId) | 업무 |
| private delete() | L495-527 | E7 | ConfirmBox → E15 | 업무 |
| private insert() | L529-537 | E8 | 조회창 Pay50_Lookup_ExpenseRequestInsert 열기 | 업무 |
| private rejectCheck() | L539-591 | E10 | 미선택 시 alert "반려할 내용을 선택해주세요" → 확인창 E16 | 업무 |
| private rejectCancelCheck() | L593-645 | E12 | 미선택 시 alert "반려 취소할 내용을 선택해주세요" → 확인창 E17 | 업무 |
| private reject() | L647-660 | E16 | 조회창 Pay50_Lookup_RejectReason 열기 | 업무 |
| private updateReject() | L662-680 | E17,reject | 서비스 pay.Pay50_Expense.updateRejectReason(rejectReason) | 업무 |
| private apprCheck() | L682-778 | E9 | 미선택 시 alert "상신할 내용을 선택해주세요" → 확인창 E18 | 업무 |
| private apprSelect() | L780-810 | E18 | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L812-835 | apprSelect | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateExpenseApprId() | L838-850 | insertLinkApproval | 서비스 pay.Pay50_Expense.updateExpenseApprId(expenseApprId) | 업무 |
| private rejectSMS() | L852-867 | E11 | 서비스 pay.Pay50_Expense.rejectSendMessage(companyId, sendPersonId) | 업무 |
| private settings() | L170-308 | 생성자 | 조회창 Pay51_Lookup_ExpenseForm 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: startDate=start, closeDate=close, statusCheckBox=true("완료/반려건 제외") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L310-341 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L869-871 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L872-874 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('occDate', 90, '발생일자'),  // L321
  gb.date('dueDate', 90, '지급요청일'),  // L322
  gb.text('expenseNm', 100, '구분'),  // L323
  gb.text('desc', 250, '지출내역'),  // L324
  gb.text('corpNm', 150, '지출처'),  // L325
  gb.long('settleAmt', 100, '지출금액'),  // L326
  gb.text('accountNm', 100, '계정과목'),  // L327
  gb.textCenter('fileCountStr', 60, '증빙자료'),  // L328
  gb.date('regDate', 90, '요청일'),  // L329
  gb.text('regEmpOrgNm', 150, '요청자'),  // L330
  gb.textCenter('expenseStatusNm', 70, '처리상태'),  // L331
  gb.text('expenseApprTitle', 150, '상신문서명'),  // L332
  gb.textCenter('expenseApprStatusNm', 70, '상신상태'),  // L333
  // ⚠ 대응 없음 (GridBuilder L334) addCell
  gb.text('note', 150, '비고'),  // L335
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={delete}>삭제</Button>
3. <Button type="register" onClick={insert}>바로등록</Button>
4. <Button type="register" onClick={execute}>양식관리</Button>
5. <Button type="register" onClick={apprCheck}>상신</Button>
6. <Button type="cancel" onClick={rejectCheck}>반려</Button>
7. <Button type="send" onClick={rejectSMS}>반려건 일괄 알림발송</Button>
8. <Button type="cancel" onClick={rejectCancelCheck}>반려취소</Button>

### Pay51_Lookup_ExpenseForm (`client/vi/pay/Pay51_Lookup_ExpenseForm.java`, 193줄)

- 레이아웃: west=grid, center=htmlLayoutContainer
- 그리드 `grid` (buildGrid()):
  - formName 155 "양식명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L57-84) → settings(), show()
[E1] grid.RowClick (L88) → 인라인 L88-105 (new RowClickHandler() { @Override pub…)
[E2] updateButton[저장].Select (L106) → modelUpdate()
[E3] cancleButton[닫기].Select (L112) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-55 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L127-136 | formCheck,modelUpdate | 서비스 pay.Pay51_ExpenseForm.selectByCompanyId(companyId) | 업무 |
| private formCheck() | L138-150 | open | 서비스 pay.Pay51_ExpenseForm.formCheck | 업무 |
| private modelUpdate() | L152-174 | E2 | 미선택 시 alert "양식을 선택 후 저장 가능합니다.", 서비스 pay.Pay51_ExpenseForm.modelUpdate | 업무 |
| private settings() | L86-119 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L121-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L186-188 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L190-192 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('formNm', 155, '양식명'),  // L123 SQL 계산 컬럼(selectByCompanyId: f_cdnm('ExpenseDetailType', pay51_form_…)
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={modelUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay50_Lookup_RejectReason (`client/vi/pay/Pay50_Lookup_RejectReason.java`, 107줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L30-51) → settings(), show()
[E1] updateButton[저장].Select (L74) → update()
[E2] closeButton[닫기].Select (L80) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-56 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L58-62 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L64-71 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L93-102 | E1 | 상태 처리 | 업무 |
| private settings() | L73-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L104-106 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay50_Lookup_ExpenseRequestList (`client/vi/pay/Pay50_Lookup_ExpenseRequestList.java`, 177줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="요청자/구분/지출내역/지출처"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - occDate 100 "발생일자" Date
  - dueDate 100 "지급요청일" Date
  - expenseName 100 "구분" Text
  - desc 300 "지출내역" TextArea
  - corpName 150 "지출처" Text
  - settleAmt 120 "지출금액" Long
  - regDate 100 "요청일" Date
  - regEmpOrgName 200 "요청자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-55) → 초기화
[E1] searchText.KeyPress [Enter] (L85) → retrieve()
[E2] retrieveButton[조회].Select (L94) → retrieve()
[E3] selectButton[선택].Select (L100) → confirm()
[E4] cancelButton[닫기].Select (L106) → hide()
[E5] grid.CellDoubleClick (L113) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-79 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L142-155 | E1,E2,open | 서비스 pay.Pay50_Expense.selectExpenseRequest(companyId, searchText) | 업무 |
| public confirm() | L157-168 | E3,E5 | 미선택 시 alert "선택된 내역이 없습니다" | 업무 |
| private settings() | L81-119 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L121-140 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L170-172 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L173-175 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('occDate', 100, '발생일자'),  // L127
  gb.date('dueDate', 100, '지급요청일'),  // L128
  gb.text('expenseNm', 100, '구분'),  // L129
  gb.textArea('desc', 300, '지출내역'),  // L130
  gb.text('corpNm', 150, '지출처'),  // L131
  gb.long('settleAmt', 120, '지출금액'),  // L132
  gb.date('regDate', 100, '요청일'),  // L133
  gb.text('regEmpOrgNm', 200, '요청자'),  // L134
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay50_Lookup_ExpenseRequestInsert (`client/vi/pay/Pay50_Lookup_ExpenseRequestInsert.java`, 1303줄)

- 툴바 `buttonBarApr`: {aprHlc}
- 툴바 `buttonBarFile`: {fileHlc}
- 입력·하위 화면: `occDate` MyDateField, `dueDate` MyDateField, `confirmerId` LongField, `corpId` LongField, `amt` LongField, `tax` LongField, `settleAmt` LongField, `depositId` LongField, `astId` LongField, `desc` TextField, `expenseCode` TextField, `taxType` TextField, `payMethodCode` TextField, `accountCode` TextField, `astName` TextField, `expenseName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `taxTypeName` ComboBoxField("TaxType"), `payMethodName` ComboBoxField("PayMethodCode"), `formComboBox` ComboBoxField("ExpenseDetailType", "(해당없음)"), `confirmerName` LookupTriggerField, `corpName` LookupTriggerField, `payAccountInfo` LookupTriggerField 빈칸="(해당없음", `accountName` LookupTriggerField, `depositName` LookupTriggerField 빈칸="선급관리계좌를 선택하세요", `lookup` Pay50_Lookup_Content, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `lookupCorp` Ast01_Lookup_CorpAccount, `lookupAccount` Pay52_Lookup_AccountCode, `editor` Apr01_Edit_ApprDoc, `lookupViewer` Sys10_Lookup_FileViewer, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `relateGrid` (relateGrid(), 체크박스(다중)):
  - title 250 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 60 "상세보기" Cell 편집:actionCell
- 그리드 `fileGrid` (buildFileGrid(), 체크박스):
  - fileName 450 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L303-422) → settings(), getEditor()
[E1] anchor.MouseDown (L313) → 인라인 L313-324 (new MouseDownHandler() { @Override pu…)
[E2] expenseName[구분].Collapse (L464) → 인라인 L464-475 (new CollapseHandler() { @Override pub…)
[E3] formComboBox[ExpenseDetailType].Collapse (L479) → 서비스 pay.Pay51_ExpenseForm.formCodeCall
[E4] fileUpload.Change (L504) → 인라인 L504-511 (new ChangeHandler() { @Override publi…)
[E5] fileUploadForm.SubmitComplete (L514) → fileRetrieve()
[E6] updateButton[저장].Select (L523) → update()
[E7] copyButton[불러오기].Select (L529) → expenseCopy()
[E8] closeButton[닫기].Select (L535) → hide()
[E9] confirmerName[승인자].TriggerClick (L542) → 인라인 L542-556 (new TriggerClickHandler(){ @Override …)
[E10] corpName[지출처].TriggerClick (L558) → 인라인 L558-619 (new TriggerClickHandler(){ @Override …)
[E11] accountName[계정과목].TriggerClick [result != null] (L621) → 인라인 L621-636 (new TriggerClickHandler() { @Override…)
[E12] payAccountInfo[지급계좌].TriggerClick [corpId.getValue() == null] (L638) → 메시지 "지출처 선택 후 지급요청계좌 선택이 가능합니다"
[E13] payAccountInfo[지급계좌].KeyDown (L661) → 인라인 L661-669 (new KeyDownHandler() { @Override publ…)
[E14] payMethodName[지급방법].Selection (L671) → payMethodValueChangeEvent()
[E15] depositName.TriggerClick [corpId.getValue() == null] (L679) → 메시지 "먼저 지출처를 선택하세요"
[E16] taxTypeName[면세구분].Selection (L704) → 인라인 L704-728 (new SelectionHandler<String>() { @Ove…)
[E17] amt[공급가액].Change (L730) → 인라인 L730-757 (new ChangeHandler() { @Override publi…)
[E18] tax[세액].Change (L758) → 인라인 L758-772 (new ChangeHandler() { @Override publi…)
[E19] amt[공급가액].KeyUp (L774) → updateSettleAmt(), updateAmt()
[E20] tax[세액].KeyUp (L784) → updateSettleAmt()
[E21] retrieveButton[조회].Select (L791) → relateRetrieve()
[E22] insertButton[불러오기].Select (L797) → relateInsert()
[E23] apprButton[신규문서 작성].Select (L803) → selectDcrClass()
[E24] deleteButton[연결제거].Select (L809) → relateDelete()
       └ [E27] messageBox.DialogHide [YES] (L1011) → 서비스 com.Com01_RelateAppr.delete
[E25] uploadFileButton[파일업로드].Select (L815) → 인라인 L815-820 (new SelectHandler() { @Override publi…)
[E26] messageBox.DialogHide [YES] (L926) → checkFileDelete()
[E28] fileDeleteForm.SubmitComplete (L1205) → fileRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insertPass() | L187-198 | 공개 메서드 | 상태 처리 | 업무 |
| public insert() | L200-253 | insertPass,relateInsert,createAppr | 서비스 pay.Pay50_Expense.getConfirmerId(companyId, personId, stdDate) | 업무 |
| public edit() | L255-276 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L278-301 | 공개 메서드 | 상태 처리 | 업무 |
| private showBottomButton() | L424-432 | insert,edit,view | 상태 처리 | 업무 |
| private payMethodValueChangeEvent() | L823-848 | E14,expenseCopy | 상태 처리 | 업무 |
| private getEditor() | L850-862 | 생성자 | 상태 처리 | 업무 |
| private relateGrid() | L864-904 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private buildFileGrid() | L906-957 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| private relateRetrieve() | L959-965 | E21,edit,view,insert | 서비스 com.Com01_RelateAppr.selectByKeyTableId(companyId, keyTableId) | 업무 |
| private fileRetrieve() | L967-972 | E5,E28,edit,view,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private relateInsert() | L974-983 | E22 | 조회창 Apr05_Lookup_LoadDoc2 열기 | 업무 |
| private insert() | L985-1001 | insertPass,relateInsert,createAppr | 서비스 com.Com01_RelateAppr.modelUpdate | 업무 |
| private relateDelete() | L1003-1023 | E24 | ConfirmBox → E27 | 업무 |
| private selectDcrClass() | L1025-1033 | E23 | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| private createAppr() | L1035-1051 | selectDcrClass | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private update() | L1053-1124 | E6 | 서비스 pay.Pay50_Expense.modelUpdate | 업무 |
| private expenseCopy() | L1126-1182 | E7 | 조회창 Pay50_Lookup_ExpenseCopy 열기 | 업무 |
| private checkFileDelete() | L1184-1215 | E26 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private updateAmt() | L1217-1225 | E19 | 상태 처리 | 업무 |
| private updateSettleAmt() | L1227-1234 | E19,E20 | 상태 처리 | 업무 |
| private disabled() | L1236-1260 | view | 상태 처리 | 업무 |
| private tabIndexSetting() | L1262-1276 | settings | 상태 처리 | 업무 |
| private settings() | L434-821 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 조회창 Ast01_Lookup_CorpAccount 열기, 조회창 Sys15_Lookup_Corp 열기, 조회창 Pay52_Lookup_AccountCode 열기, 조회창 Sys17_Lookup_Account 열기, 서비스 pay.Pay51_ExpenseForm.formCodeCall, 이벤트 연결, 초기값: corpName=null("지출처"), corpId=null, payAccountInfo=null("지급계좌"), astId=null, astName=null, confirmerName=empTransInfoModel.getEmpPersonModel(("승인자"), confirmerId=empTransInfoModel.getPersonId(, corpId=astModel.getCorpId(, corpName=astModel.getCorpName(("지출처"), payAccountInfo=astModel.getCorpPayAccountInfo(("지급계좌"), astId=astModel.getClassTreeId(, astName=astModel.getClassTreeName(, payMethodName="계좌이체"("지급방법"), payMethodCode="10", depositId=null, depositName=null, corpName=null("지출처"), corpId=null, payAccountInfo=null("지급계좌"), astId=null, astName=null, corpId=corpModel.getCorpId(, corpName=corpModel.getCorpName(("지출처"), payAccountInfo=corpModel.getPayAccountInfo(("지급계좌"), payMethodName="계좌이체"("지급방법"), payMethodCode="10", depositId=null, depositName=null, corpName=null("지출처"), corpId=null, payAccountInfo=null("지급계좌"), astId=null, astName=null, accountCode=actModel.getAccountCode(, accountName=actModel.getAccountName(("계정과목"), payAccountInfo=corpAccountModel.getBankName(("지급계좌"), depositId=astModel.getClassTreeId(, depositName=astModel.getClassTreeName(, depositId=null, depositName=null, tax=taxValue("세액"), settleAmt=amtValue + taxValue("합계"), tax=taxValue("세액"), settleAmt=amtValue + taxValue("합계"), settleAmt=amtValue + taxValue("합계"), tax=taxValue("세액"), settleAmt=amtValue + taxValue("합계"), settleAmt=amtValue + taxValue("합계") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L1293-1295 | 생성자,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L1297-1299 | 생성자,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L1300-1302 | insert,edit,view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const relateGrid = () => [
  gb.text('title', 250, '제목'),  // L896 SQL 계산 컬럼(selectByKeyTableId: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L897 SQL 계산 컬럼(selectByKeyTableId: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L898 SQL 계산 컬럼(selectByKeyTableId: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L899 SQL 계산 컬럼(selectByKeyTableId: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L900 SQL 계산 컬럼(selectByKeyTableId: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L901) addCell
];

const buildFileGrid = () => [
  gb.text('fileNm', 450, '첨부파일'),  // L951
  // ⚠ 대응 없음 (GridBuilder L952) addCell
  // ⚠ 대응 없음 (GridBuilder L953) addCell
  // ⚠ 대응 없음 (GridBuilder L954) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={expenseCopy}>불러오기</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="search" onClick={relateRetrieve}>조회</Button>
5. <Button type="register" onClick={relateInsert}>불러오기</Button>
6. <Button type="delete" onClick={relateDelete}>연결제거</Button>
7. <Button type="register" onClick={selectDcrClass}>신규문서 작성</Button>
8. <Button type="upload" onClick={() => /* 인라인 L815-820 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

### Pay52_Lookup_AccountCode (`client/vi/pay/Pay52_Lookup_AccountCode.java`, 311줄)

- 툴바 `buttonBar`: 계정속성: {attributeComboBox} 검색: {searchText} {allAccountCheckBox} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="계정코드/계정과목", `allAccountCheckBox` CheckBox, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체", "전체"), `lookup` Act01_Lookup_AccountCode
- 그리드 `grid` (buildGrid(), 체크박스):
  - attributeName 80 "속성" TextCenter
  - accountCode 100 "계정코드" TextCenter
  - accountName 450 "계정과목" TextArea
  - seq 100 "조회순서" LongCenter 편집:LongField

#### 이벤트
[E1] grid.CellDoubleClick (L113) → confirm()
[E2] attributeComboBox[AccountAttributeCode].Collapse (L133) → retrieve()
[E3] searchText.KeyPress [Enter] (L145) → retrieve()
[E4] retrieveButton[조회].Select (L154) → retrieve()
[E5] insertButton[추가].Select (L160) → insertAccountCode()
[E6] deleteButton[제거].Select (L166) → deleteAccountCode()
       └ [E10] messageBox.DialogHide [YES] (L288) → 서비스 pay.Pay52_FavoriteAccount.delete
[E7] updateButton[저장].Select (L172) → update()
[E8] oKButton[확인].Select (L178) → confirm()
[E9] cancelButton[취소].Select (L184) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L74-121 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L205-229 | E2,E3,E4,settings,insertAccountCode,update | 서비스 pay.Pay52_FavoriteAccount.selectByCompanyId(companyId, attributeCode, searchText, allAccountYn), 건수 표시 | 업무 |
| public confirm() | L231-242 | E1,E8 | 미선택 시 alert "선택된 계정과목이 없습니다." | 업무 |
| private insertAccountCode() | L244-272 | E5 | 조회창 Act01_Lookup_AccountCode 열기, 서비스 pay.Pay52_FavoriteAccount.insert(companyId) | 업무 |
| private update() | L274-283 | E7 | 서비스 pay.Pay52_FavoriteAccount.update | 업무 |
| private deleteAccountCode() | L285-299 | E6 | ConfirmBox → E10 | 업무 |
| private settings() | L123-190 | open | 이벤트 연결, 초기값: allAccountCheckBox=false("모든 계정과목") | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L192-203 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L301-303 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L304-306 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L307-309 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('attributeNm', 80, '속성'),  // L197 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AccountAttributeCode', pay52_at…)
  gb.textCenter('accountCd', 100, '계정코드'),  // L198 SQL 계산 컬럼(selectByCompanyId: act01_account_cd)
  gb.textArea('accountNm', 450, '계정과목'),  // L199 SQL 계산 컬럼(selectByCompanyId: act01_account_nm)
  gb.longCenter('seq', 100, '조회순서', { editor: 'number' }),  // L200
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertAccountCode}>추가</Button>
3. <Button type="delete" onClick={deleteAccountCode}>제거</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="save" onClick={confirm}>확인</Button>
6. <Button type="cancel" onClick={hide}>취소</Button>

### Pay50_Lookup_ExpenseCopy (`client/vi/pay/Pay50_Lookup_ExpenseCopy.java`, 204줄)

- 툴바 `buttonBar`: 구분: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="구분/지출내역/지출처"
- 그리드 `grid` (buildGrid(), 체크박스):
  - occDate 100 "발생일자" Date
  - expenseName 100 "구분" Text
  - desc 500 "지출내역" TextArea
  - corpName 150 "지출처" Text
  - settleAmt 100 "지출금액" Long
  - accountName 150 "계정과목" Text

#### 이벤트
[E0] 화면 열림 (생성자 L57-65) → 초기화
[E1] searchText.KeyPress [Enter] (L113) → retrieve()
[E2] grid.RowDoubleClick (L122) → confirm()
[E3] retrieveButton[조회].Select (L129) → retrieve()
[E4] selectButton[확인].Select (L135) → confirm()
[E5] cancelButton[닫기].Select (L141) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L67-99 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L163-182 | E1,E3,open | 서비스 pay.Pay50_Expense.selectExpenseAppr(companyId, personId, startDate, closeDate, expenseCode, searchText, managerYn, limit) | 업무 |
| private confirm() | L184-195 | E2,E4 | 미선택 시 alert "선택한 내역이 없습니다" | 업무 |
| private settings() | L101-147 | open | 이벤트 연결, 초기값: startDate=stdDate, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L149-161 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L197-199 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L200-202 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('occDate', 100, '발생일자'),  // L153
  gb.text('expenseNm', 100, '구분'),  // L154
  gb.textArea('desc', 500, '지출내역'),  // L155
  gb.text('corpNm', 150, '지출처'),  // L156
  gb.long('settleAmt', 100, '지출금액'),  // L157
  gb.text('accountNm', 150, '계정과목'),  // L158
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay50_Lookup_Content (`client/vi/pay/Pay50_Lookup_Content.java`, 230줄)


#### 이벤트
[E0] 화면 열림 (생성자 L54-62) → 초기화
[E1] updateButton[저장].Select (L172) → update()
[E2] confirmButton[확인].Select (L178) → confirm()
[E3] closeButton[닫기].Select (L184) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-96 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L98-132 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L134-169 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L192-205 | E1 | 서비스 pay.Pay50_Expense.updateContent(content, expenseId) | 업무 |
| private confirm() | L207-210 | E2 | 상태 처리 | 업무 |
| private settings() | L171-190 | open,edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L212-214 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="save" onClick={update}>저장</Button>

### Pay50_Edit_Expense (`client/vi/pay/Pay50_Edit_Expense.java`, 724줄)

- 입력·하위 화면: `regDate` MyDateField, `occDate` MyDateField, `dueDate` MyDateField, `amt` LongField, `tax` LongField, `settleAmt` LongField, `corpId` LongField, `astId` LongField, `depositId` LongField, `expenseCode` TextField, `accountCode` TextField, `regEmpOrgName` TextField, `confirmerOrgName` TextField, `apprEmpOrgName` TextField, `fileCountStr` TextField, `expenseStatusName` TextField, `desc` TextField, `taxType` TextField, `payMethodCode` TextField, `astName` TextField, `rejectReason` MyTextArea, `note` MyTextArea, `taxTypeName` ComboBoxField("TaxType"), `payMethodName` ComboBoxField("PayMethodCode"), `payAccountInfo` LookupTriggerField 빈칸="(해당없음)", `corpName` LookupTriggerField, `accountName` LookupTriggerField, `depositName` LookupTriggerField 빈칸="선급관리계좌를 선택하세요", `lookupCorp` Ast01_Lookup_CorpAccount, `lookup` Ast01_Lookup_CorpAccount, `lookupAccount` Pay52_Lookup_AccountCode

#### 이벤트
[E0] 화면 열림 (생성자 L109-119) → getEditor()
[E1] contentButton[내역상세].Select (L144) → lookupContent()
[E2] fileButton[증빙자료].Select (L151) → lookupFile()
[E3] updateButton[저장].Select (L158) → update()
[E4] corpName[지출처].TriggerClick (L165) → 인라인 L165-220 (new TriggerClickHandler(){ @Override …)
[E5] depositName.TriggerClick [corpId.getValue() == null] (L222) → 메시지 "먼저 지출처를 선택하세요"
[E6] payAccountInfo[지급요청계좌].TriggerClick [corpId.getValue() == null] (L247) → 메시지 "지출처 선택 후 지급요청계좌 선택이 가능합니다"
[E7] payMethodName[지급방법].Selection (L268) → setPayAccountInfo()
[E8] taxTypeName[면세구분].Selection (L275) → 인라인 L275-299 (new SelectionHandler<String>() { @Ove…)
[E9] accountName[계정과목].TriggerClick (L301) → openLookupAccount()
[E10] amt[공급가액].Change (L308) → 인라인 L308-335 (new ChangeHandler() { @Override publi…)
[E11] tax[세액].Change (L336) → 인라인 L336-350 (new ChangeHandler() { @Override publi…)
[E12] amt[공급가액].KeyUp (L352) → updateSettleAmt(), updateAmt()
[E13] tax[세액].KeyUp (L362) → updateSettleAmt()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setPayAccountInfo() | L370-393 | E7,retrieve | 상태 처리 | 업무 |
| private getEditor() | L395-491 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L493-516 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L518-520 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L522-582 | E3 | 서비스 pay.Pay50_Expense.update | 업무 |
| private updateAmt() | L584-592 | E12 | 상태 처리 | 업무 |
| private updateSettleAmt() | L594-601 | E12,E13 | 상태 처리 | 업무 |
| private lookupContent() | L603-617 | E1 | 조회창 Pay50_Lookup_Content 열기, 미선택 시 alert "내역상세가 저장되었습니다." | 업무 |
| private lookupFile() | L619-659 | E2 | 조회창 Com01_Lookup_RelateAppr 열기, 서비스 pay.Pay50_Expense.selectById, pay.Pay50_Expense.selectById(expenseId, expenseId) | 업무 |
| private disabled() | L661-693 | retrieve | 상태 처리 | 업무 |
| private openLookupAccount() | L695-704 | E9 | 조회창 Pay52_Lookup_AccountCode 열기 | 업무 |
| private setAccount() | L706-714 | openLookupAccount | 상태 처리 | 업무 |
| private settings() | L121-368 | getEditor | 조회창 Ast01_Lookup_CorpAccount 열기, 조회창 Sys15_Lookup_Corp 열기, 조회창 Sys17_Lookup_Account 열기, 이벤트 연결, 초기값: corpId=astModel.getCorpId(, corpName=astModel.getCorpName(("지출처"), payAccountInfo=astModel.getCorpPayAccountInfo(("지급요청계좌"), astId=astModel.getClassTreeId(, astName=astModel.getClassTreeName(, payMethodName="계좌이체"("지급방법"), payMethodCode="10", corpName=null("지출처"), corpId=null, payAccountInfo=null("지급요청계좌"), astId=null, astName=null, corpId=corpModel.getCorpId(, corpName=corpModel.getCorpName(("지출처"), payAccountInfo=corpModel.getPayAccountInfo(("지급요청계좌"), payMethodName="계좌이체"("지급방법"), payMethodCode="10", corpName=null("지출처"), corpId=null, payAccountInfo=null("지급요청계좌"), astId=null, astName=null, depositId=astModel.getClassTreeId(, depositName=astModel.getClassTreeName(, depositId=null, depositName=null, payAccountInfo=corpAccountModel.getBankName(("지급요청계좌"), tax=taxValue("세액"), settleAmt=amtValue + taxValue("합계"), tax=taxValue("세액"), settleAmt=amtValue + taxValue("합계"), settleAmt=amtValue + taxValue("합계"), tax=taxValue("세액"), settleAmt=amtValue + taxValue("합계"), settleAmt=amtValue + taxValue("합계") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L716-718 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L720-722 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={lookupContent}>내역상세</Button>
2. <Button type="unknown" onClick={lookupFile}>증빙자료(0건)</Button>
3. <Button type="save" onClick={update}>저장</Button>

