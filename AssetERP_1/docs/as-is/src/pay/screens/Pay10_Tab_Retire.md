# Pay10_Tab_Retire

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 퇴직정산 (#1274)
- 파일: `client/vi/pay/Pay10_Tab_Retire.java`
- 함께 쓰는 클래스 15개:
  - `Pay15_TabPage_RetireLeave` `client/vi/pay/Pay15_TabPage_RetireLeave.java`
  - `Pay13_TabPage_RetireTax` `client/vi/pay/Pay13_TabPage_RetireTax.java`
  - `Pay27_Lookup_TaxDeductTable` `client/vi/pay/Pay27_Lookup_TaxDeductTable.java`
  - `Pay26_Lookup_TaxCalcTable` `client/vi/pay/Pay26_Lookup_TaxCalcTable.java`
  - `Pay25_Lookup_PersonDeduct` `client/vi/pay/Pay25_Lookup_PersonDeduct.java`
  - `Pay24_Lookup_DeductTable` `client/vi/pay/Pay24_Lookup_DeductTable.java`
  - `Pay20_Lookup_SelectMulti` `client/vi/pay/Pay20_Lookup_SelectMulti.java`
  - `Pay13_Lookup_Rd_RetireTax` `client/vi/pay/Pay13_Lookup_Rd_RetireTax.java`
  - `Pay12_TabPage_RetireInsure` `client/vi/pay/Pay12_TabPage_RetireInsure.java`
  - `Pay12_Lookup_Rd_RetireInsure` `client/vi/pay/Pay12_Lookup_Rd_RetireInsure.java`
  - `Pay12_Lookup_RetireCreate` `client/vi/pay/Pay12_Lookup_RetireCreate.java`
  - `Pay10_TabPage_Retire` `client/vi/pay/Pay10_TabPage_Retire.java`
  - `Pay31_Lookup_Insert1` `client/vi/pay/Pay31_Lookup_Insert1.java`
  - `Pay10_Rd_Retire` `client/vi/pay/Pay10_Rd_Retire.java`
  - `Pay10_Lookup_RemLeaveDays` `client/vi/pay/Pay10_Lookup_RemLeaveDays.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay10_TabPage_Retire:101 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay10_TabPage_Retire:126, Pay10_TabPage_Retire:317 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp00_TransInfo.selectRetireEmpList` | Pay10_Tab_Retire:172 | [`Emp00_TransInfo.java:587`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectRetireEmpList`](../../emp/sql/emp00_trans_info.md) |
| `pay.Pay03_Account.selectByStartDate` | Pay10_TabPage_Retire:363 | [`Pay03_Account.java:28`](../../pay/services/Pay03_Account.md) | [`pay03_account.selectByStartDate`](../../pay/sql/pay03_account.md) |
| `pay.Pay05_RelateAppr.insertRetire` | Pay10_TabPage_Retire:299 | [`Pay05_RelateAppr.java:88`](../../pay/services/Pay05_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay05_relate_appr.insert`](../../pay/sql/pay05_relate_appr.md), [`pay05_relate_appr.selectByRetire`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay05_RelateAppr.selectByRetire` | Pay10_TabPage_Retire:239 | [`Pay05_RelateAppr.java:42`](../../pay/services/Pay05_RelateAppr.md) | [`pay05_relate_appr.selectByRetire`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay05_RelateAppr.updateApprId` | Pay10_TabPage_Retire:374 | [`Pay05_RelateAppr.java:119`](../../pay/services/Pay05_RelateAppr.md) | [`pay05_relate_appr.updateApprId`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay10_Month.getRetireInfo` | Pay12_TabPage_RetireInsure:525, Pay13_TabPage_RetireTax:836, Pay15_TabPage_RetireLeave:173 | [`Pay10_Month.java:151`](../../pay/services/Pay10_Month.md) | [`pay10_month.getRetireInfo`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.selectByPersonId` | Pay10_TabPage_Retire:212, Pay10_Tab_Retire:324 | [`Pay10_Month.java:54`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByPersonId`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.selectByRetirePayCode` | Pay10_TabPage_Retire:172, Pay10_TabPage_Retire:177 | [`Pay10_Month.java:121`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByRetirePayCode`](../../pay/sql/pay10_month.md) |
| `pay.Pay12_RetireInsure.callInsureRetire` | Pay12_TabPage_RetireInsure:240 | [`Pay12_RetireInsure.java:186`](../../pay/services/Pay12_RetireInsure.md) | [`pay12_retire_insure.getInsureRetire`](../../pay/sql/pay12_retire_insure.md) |
| `pay.Pay12_RetireInsure.getInsureRetire` | Pay10_Tab_Retire:341, Pay12_Lookup_RetireCreate:86 | [`Pay12_RetireInsure.java:47`](../../pay/services/Pay12_RetireInsure.md) | [`pay05_relate_appr.deleteRetireId`](../../pay/sql/pay05_relate_appr.md), [`pay11_month_item.getLeavePayRetire`](../../pay/sql/pay11_month_item.md), [`pay12_retire_insure.getInsureRetire`](../../pay/sql/pay12_retire_insure.md), [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay13_retire_tax.getIncomeTaxRetireC`](../../pay/sql/pay13_retire_tax.md) |
| `pay.Pay12_RetireInsure.insertRetireInfo` | Pay12_TabPage_RetireInsure:420, Pay12_TabPage_RetireInsure:452, Pay12_TabPage_RetireInsure:484 | [`Pay12_RetireInsure.java:105`](../../pay/services/Pay12_RetireInsure.md) | [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md), [`pay12_retire_insure.deleteByRetireInsureId`](../../pay/sql/pay12_retire_insure.md), [`pay12_retire_insure.selectByYear`](../../pay/sql/pay12_retire_insure.md), [`pay12_retire_insure.updateModel`](../../pay/sql/pay12_retire_insure.md) |
| `pay.Pay12_RetireInsure.selectByPersonId` | Pay12_TabPage_RetireInsure:313 | [`Pay12_RetireInsure.java:26`](../../pay/services/Pay12_RetireInsure.md) | [`pay12_retire_insure.selectByPersonId`](../../pay/sql/pay12_retire_insure.md) |
| `pay.Pay13_RetireTax.getOfficePayTax` | Pay13_TabPage_RetireTax:938 | [`Pay13_RetireTax.java:30`](../../pay/services/Pay13_RetireTax.md) | [`pay13_retire_tax.getOfficePayTax`](../../pay/sql/pay13_retire_tax.md) |
| `pay.Pay13_RetireTax.insertOfficePayTax` | Pay13_TabPage_RetireTax:773 | [`Pay13_RetireTax.java:60`](../../pay/services/Pay13_RetireTax.md) | [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay13_retire_tax.updateOfficePayTax`](../../pay/sql/pay13_retire_tax.md) |
| `pay.Pay13_RetireTax.insertRetireTax` | Pay13_TabPage_RetireTax:641, Pay13_TabPage_RetireTax:662, Pay13_TabPage_RetireTax:683, Pay13_TabPage_RetireTax:704, Pay13_TabPage_RetireTax:725, Pay13_TabPage_RetireTax:797 | [`Pay13_RetireTax.java:36`](../../pay/services/Pay13_RetireTax.md) | [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay13_retire_tax.updateAmt`](../../pay/sql/pay13_retire_tax.md) |
| `pay.Pay13_RetireTax.selectByMonthId` | Pay13_TabPage_RetireTax:859, Pay13_TabPage_RetireTax:940 | [`Pay13_RetireTax.java:24`](../../pay/services/Pay13_RetireTax.md) | [`pay13_retire_tax.selectByMonthId`](../../pay/sql/pay13_retire_tax.md) |
| `pay.Pay14_RetireTaxItem.insertRetireTaxItem` | Pay13_TabPage_RetireTax:550, Pay13_TabPage_RetireTax:583, Pay13_TabPage_RetireTax:616 | [`Pay14_RetireTaxItem.java:43`](../../pay/services/Pay14_RetireTaxItem.md) | [`pay13_retire_tax.getIncomeTaxRetire`](../../pay/sql/pay13_retire_tax.md), [`pay14_retire_tax_item.deleteByRetireTaxItemId`](../../pay/sql/pay14_retire_tax_item.md), [`pay14_retire_tax_item.updateModel`](../../pay/sql/pay14_retire_tax_item.md) |
| `pay.Pay14_RetireTaxItem.selectByMonthId` | Pay13_TabPage_RetireTax:924 | [`Pay14_RetireTaxItem.java:26`](../../pay/services/Pay14_RetireTaxItem.md) | [`pay14_retire_tax_item.selectByMonthId`](../../pay/sql/pay14_retire_tax_item.md) |
| `pay.Pay15_RetireLeave.calcRetireLeaveDays` | Pay10_Lookup_RemLeaveDays:172 | [`Pay15_RetireLeave.java:48`](../../pay/services/Pay15_RetireLeave.md) | [`pay15_retire_leave.calcRemLeaveDays`](../../pay/sql/pay15_retire_leave.md) |
| `pay.Pay15_RetireLeave.getRetireLeave` | Pay15_TabPage_RetireLeave:201 | [`Pay15_RetireLeave.java:35`](../../pay/services/Pay15_RetireLeave.md) | [`pay15_retire_leave.getRetireLeave`](../../pay/sql/pay15_retire_leave.md) |
| `pay.Pay15_RetireLeave.selectByMonthId` | Pay10_Lookup_RemLeaveDays:216, Pay15_TabPage_RetireLeave:238 | [`Pay15_RetireLeave.java:24`](../../pay/services/Pay15_RetireLeave.md) | [`pay15_retire_leave.selectByMonthId`](../../pay/sql/pay15_retire_leave.md) |
| `pay.Pay15_RetireLeave.selectRemLeaveDays` | Pay10_Lookup_RemLeaveDays:187 | [`Pay15_RetireLeave.java:57`](../../pay/services/Pay15_RetireLeave.md) | [`pay15_retire_leave.selectRemLeaveDays`](../../pay/sql/pay15_retire_leave.md) |
| `pay.Pay20_Item.selectByItemType` | Pay20_Lookup_SelectMulti:100 | [`Pay20_Item.java:41`](../../pay/services/Pay20_Item.md) | [`pay20_item.selectByItemType`](../../pay/sql/pay20_item.md) |
| `pay.Pay24_DeductTable.selectByMonthId` | Pay24_Lookup_DeductTable:95 | [`Pay24_DeductTable.java:32`](../../pay/services/Pay24_DeductTable.md) | [`pay24_deduct_table.selectByMonthId`](../../pay/sql/pay24_deduct_table.md) |
| `pay.Pay25_PersonDeduct.selectByMonthId` | Pay25_Lookup_PersonDeduct:78 | [`Pay25_PersonDeduct.java:32`](../../pay/services/Pay25_PersonDeduct.md) | [`pay25_person_deduct.selectByMonthId`](../../pay/sql/pay25_person_deduct.md) |
| `pay.Pay26_TaxCalcTable.selectByMonthId` | Pay26_Lookup_TaxCalcTable:83 | [`Pay26_TaxCalcTable.java:32`](../../pay/services/Pay26_TaxCalcTable.md) | [`pay26_tax_calc_table.selectByMonthId`](../../pay/sql/pay26_tax_calc_table.md) |
| `pay.Pay27_TaxDeductTable.selectByMonthId` | Pay27_Lookup_TaxDeductTable:114 | [`Pay27_TaxDeductTable.java:33`](../../pay/services/Pay27_TaxDeductTable.md) | [`pay27_tax_deduct_table.selectByMonthId`](../../pay/sql/pay27_tax_deduct_table.md) |
| `pay.Pay28_TaxDeductLimit.selectByMonthId` | Pay27_Lookup_TaxDeductTable:123 | [`Pay28_TaxDeductLimit.java:25`](../../pay/services/Pay28_TaxDeductLimit.md) | [`pay28_tax_deduct_limit.selectByMonthId`](../../pay/sql/pay28_tax_deduct_limit.md) |
| `pay.Pay31_InsureApply.insert1` | Pay31_Lookup_Insert1:291 | [`Pay31_InsureApply.java:81`](../../pay/services/Pay31_InsureApply.md) | [`pay31_insure_apply.insert1`](../../pay/sql/pay31_insure_apply.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay31_Lookup_Insert1:106 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdRetireInsure` | Pay12_TabPage_RetireInsure:217 | [`Sys99_Print.java:2045`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay12_retire_insure.selectByRdPersonId`](../../pay/sql/pay12_retire_insure.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay03_account`](../../../db/tables/pay.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay12_retire_insure`](../../../db/tables/pay.md), [`pay13_retire_tax`](../../../db/tables/pay.md), [`pay14_retire_tax_item`](../../../db/tables/pay.md), [`pay15_retire_leave`](../../../db/tables/pay.md), [`pay16_retire_rem_leave`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay24_deduct_table`](../../../db/tables/pay.md), [`pay25_person_deduct`](../../../db/tables/pay.md), [`pay26_tax_calc_table`](../../../db/tables/pay.md), [`pay27_tax_deduct_table`](../../../db/tables/pay.md), [`pay28_tax_deduct_limit`](../../../db/tables/pay.md), [`pay31_insure_apply`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_calc_4insure_retire`, `f_calc_income_tax_retire`, `f_calc_income_tax_retire_c`, `f_calc_leave_pay_retire`, `f_calc_rem_leave_days`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_leave_days`, `f_get_leave_days2`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay10_Tab_Retire (`client/vi/pay/Pay10_Tab_Retire.java`, 370줄)

- 레이아웃: north=hlc00, center=tabPanel
- 툴바 `buttonBar`: 성명: {personName} {retrieveButton} {insertButton} {deleteButton} {dcrLinkButton} {calcRetireLeaveDaysLink}
- 툴바 `toolTipBar`: {calcRetireLeaveDaysLink}
- 입력·하위 화면: `personName` LookupTriggerField 빈칸="선택하여 주세요", `personId` LongField, `transDate` MyDateField, `tabPage1` Pay10_TabPage_Retire, `tabPage2` Pay12_TabPage_RetireInsure, `tabPage3` Pay13_TabPage_RetireTax, `tabPage4` Pay15_TabPage_RetireLeave, `lookup` Dcr30_Lookup_Link, `remLeaveDaysLookup` Pay10_Lookup_RemLeaveDays, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `lookupCreate` Pay12_Lookup_RetireCreate

#### 이벤트
[E0] 화면 열림 (생성자 L78-152) → settings()
[E1] tabPanel.Selection [arg0 != null] (L107) → retrieveTabpage()
[E2] personName.TriggerClick (L157) → lookupPerson()
[E3] personName.Change (L165) → retrieveTabpage(), lookupPerson()
[E4] retrieveButton[조회].Select (L196) → retrieveTabpage()
[E5] insertButton[생성].Select (L202) → checkRetire()
       └ [E10] messageBox.DialogHide [YES] (L301) → retrieveTabpage(), delete()
[E6] deleteButton[삭제].Select (L208) → checkRetire()
[E7] dcrLinkButton[문서분류지정].Select (L221) → 인라인 L221-232 (new SelectHandler() { @Override publi…)
[E8] calcRetireLeaveDaysLink.Click (L233) → 메시지 "사원을 선택하여 주십시오."
[E9] tabPanel.Selection (L244) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L252-264 | E1,E3,E4,E9,E10,lookupPerson,delete | 선택 회사로 탭페이지 retrieve | 업무 |
| private lookupPerson() | L266-285 | E2,E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private checkRetire() | L287-321 | E5,E6 | 조회창 Pay12_Lookup_RetireCreate 열기, ConfirmBox → E10 | 업무 |
| public delete() | L323-365 | E10 | 서비스 pay.Pay10_Month.selectByPersonId, pay.Pay12_RetireInsure.getInsureRetire(personId, companyId, payCode) | 업무 |
| public settings() | L154-250 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 조회창 Pay10_Lookup_RemLeaveDays 열기, 서비스 emp.Emp00_TransInfo.selectRetireEmpList(companyId, searchText, transDate, transCode), 이벤트 연결, 초기값: personName=null, personId=null, personName=null, personId=null, personName=empModel.getEmpPersonModel(, personId=empModel.getPersonId(, transDate=empModel.getTransDate( | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L367-369 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveTabpage}>조회</Button>
2. <Button type="generate" onClick={checkRetire}>생성</Button>
3. <Button type="delete" onClick={checkRetire}>삭제</Button>
4. <Button type="save" onClick={() => /* 인라인 L221-232 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>

### Pay15_TabPage_RetireLeave (`client/vi/pay/Pay15_TabPage_RetireLeave.java`, 274줄)

- 입력·하위 화면: `remainLeaveDays` DoubleField, `addLeaveDays` DoubleField, `totalRemainLeaveDays` DoubleField, `retireLeaveAmt` LongField, `dailyAmt` LongField
- 그리드 `grid1` (buildGrid1(), 행번호숨김):
  - yearCntStr 100 "근속" TextCenter
  - periodDateStr 280 "대상기간" TextCenter
  - leaveDays 100 "휴가수" DoubleCenter
- 그리드 `grid2` (buildGrid2(), 행번호숨김):
  - yearCntStr 100 "근속" TextCenter
  - periodDateStr 280 "대상기간" TextCenter
  - leaveDays 100 "휴가수" DoubleCenter

#### 이벤트
[E0] 화면 열림 (생성자 L61-115) → settings()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid1() | L134-141 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid2() | L143-150 | 필드 초기화 | 상태 처리 | 업무 |
| public init() | L153-166 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L169-198 | callRetireLeave | 서비스 pay.Pay10_Month.getRetireInfo(personId) | 업무 |
| private callRetireLeave() | L200-231 | retrieve | 서비스 pay.Pay15_RetireLeave.getRetireLeave(monthId, personId, retireDate, year) | 업무 |
| public retrieve() | L234-244 | callRetireLeave | 서비스 pay.Pay15_RetireLeave.selectByMonthId, pay.Pay15_RetireLeave.selectByMonthId(calcStdType, monthId, calcStdType, monthId) | 업무 |
| public update() | L247-249 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L252-254 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L257-259 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L270-273 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L117-132 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L261-263 | 생성자,retrieve,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L265-267 | 생성자,retrieve,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid1 = () => [
  gb.textCenter('yearCntStr', 100, '근속'),  // L137 SQL 계산 컬럼(selectByMonthId: pay15_year_cnt || '년')
  gb.textCenter('periodDateStr', 280, '대상기간'),  // L138 SQL 계산 컬럼(selectByMonthId: TO_CHAR(pay15_start_date,'yyyy.mm.dd')|…)
  gb.doubleCenter('leaveDays', 100, '휴가수'),  // L139
];

const buildGrid2 = () => [
  gb.textCenter('yearCntStr', 100, '근속'),  // L146 SQL 계산 컬럼(selectByMonthId: pay15_year_cnt || '년')
  gb.textCenter('periodDateStr', 280, '대상기간'),  // L147 SQL 계산 컬럼(selectByMonthId: TO_CHAR(pay15_start_date,'yyyy.mm.dd')|…)
  gb.doubleCenter('leaveDays', 100, '휴가수'),  // L148
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Pay13_TabPage_RetireTax (`client/vi/pay/Pay13_TabPage_RetireTax.java`, 1029줄)

- 툴바 `buttonBar0`: {downloadButton}
- 툴바 `buttonBar1`: 1. 총소득액: {insertButton1} {deleteButton1} {updateButton1}
- 툴바 `buttonBar2`: 2. 근로소득공제: 100: {itemAmt2} {pyItemAmt2} {updateButton2} {viewButton2}
- 툴바 `buttonBar3`: 3. 근로소득금액: 100: {itemAmt3} {pyItemAmt3} {updateButton3}
- 툴바 `buttonBar4`: 4. 종합소득공제: {insertButton4} {deleteButton4} {updateButton4} {viewButton4}
- 툴바 `buttonBar5`: 5. 차감소득금액(과세표준): 45: {itemAmt5} {pyItemAmt5} {updateButton5}
- 툴바 `buttonBar6`: 6. 산출세액: 125: {itemAmt6} {pyItemAmt6} {updateButton6} {viewButton6}
- 툴바 `buttonBar7`: 7. 세액공제: {insertButton7} {deleteButton7} {updateButton7} {viewButton7}
- 툴바 `buttonBar8`: 8. 결정세액: 125: {itemAmt8} {pyItemAmt8} {updateButton8}
- 툴바 `buttonBar9`: 9. 기납부세액: {updateButton9}
- 툴바 `buttonBar10`: 10. 차감징수세액: 95: {itemAmt10} {pyItemAmt10} {updateButton10}
- 입력·하위 화면: `itemAmt2` LongField, `pyItemAmt2` LongField, `itemAmt3` LongField, `pyItemAmt3` LongField, `itemAmt5` LongField, `pyItemAmt5` LongField, `itemAmt6` LongField, `pyItemAmt6` LongField, `itemAmt8` LongField, `pyItemAmt8` LongField, `itemAmt10` LongField, `pyItemAmt10` LongField, `lookupRdRetireTax` Pay13_Lookup_Rd_RetireTax, `lookup` Pay24_Lookup_DeductTable
- 그리드 `grid1` (buildGrid1()):
  - itemName 180 "구분" Text
  - itemAmt 150 "당해년도" Long 편집:LongField
  - pyItemAmt 150 "전년도" Long 편집:LongField
- 그리드 `grid4` (buildGrid4()):
  - itemName 180 "구분" Text
  - itemAmt 150 "당해년도" Long 편집:LongField
  - pyItemAmt 150 "전년도" Long 편집:LongField
- 그리드 `grid7` (buildGrid7()):
  - itemName 180 "구분" Text
  - itemAmt 150 "당해년도" Long 편집:LongField
  - pyItemAmt 150 "전년도" Long 편집:LongField
- 그리드 `grid9` (buildGrid9()):
  - titleName 180 "구분" Text
  - officePayTax 150 "당해년도" Long 편집:LongField
  - pyOfficePayTax 150 "전년도" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L109-266) → settings(), setRightPadding()
[E1] downloadButton[출력/다운로드].Select (L287) → 인라인 L287-293 (new SelectHandler() { @Override publi…)
[E2] insertButton1[행 추가].Select (L295) → insertRow()
[E3] deleteButton1[행 삭제].Select (L301) → deleteRow()
[E4] updateButton1[저장].Select (L307) → update()
[E5] insertButton4[행 추가].Select (L314) → insertRow()
[E6] deleteButton4[행 삭제].Select (L320) → deleteRow()
[E7] updateButton4[저장].Select (L326) → update()
[E8] insertButton7[행 추가].Select (L333) → insertRow()
[E9] deleteButton7[행 삭제].Select (L339) → deleteRow()
[E10] updateButton7[저장].Select (L345) → update()
[E11] updateButton2[저장].Select (L353) → updateAmt()
[E12] updateButton3[저장].Select (L359) → updateAmt()
[E13] updateButton5[저장].Select (L365) → updateAmt()
[E14] updateButton6[저장].Select (L371) → updateAmt()
[E15] updateButton8[저장].Select (L377) → updateAmt()
[E16] updateButton9[저장].Select (L383) → updateAmt()
[E17] updateButton10[저장].Select (L389) → updateAmt()
[E18] viewButton2[근로소득공제표].Select [monthId != null] (L397) → 인라인 L397-405 (new SelectHandler() { @Override publi…)
[E19] viewButton4[인적공제금액].Select [monthId != null] (L406) → 인라인 L406-414 (new SelectHandler() { @Override publi…)
[E20] viewButton6[산출세액표].Select [monthId != null] (L415) → 인라인 L415-423 (new SelectHandler() { @Override publi…)
[E21] viewButton7[산출기준].Select [monthId != null] (L424) → 인라인 L424-432 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid1() | L435-441 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid4() | L443-449 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid7() | L451-457 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid9() | L459-465 | 필드 초기화 | 상태 처리 | 업무 |
| public insertRow() | L467-514 | E2,E5,E8 | 조회창 Pay20_Lookup_SelectMulti 열기 | 업무 |
| public deleteRow() | L516-533 | E3,E6,E9 | 상태 처리 | 업무 |
| public update() | L535-636 | E4,E7,E10 | 서비스 pay.Pay14_RetireTaxItem.insertRetireTaxItem, pay.Pay14_RetireTaxItem.insertRetireTaxItem, pay.Pay14_RetireTaxItem.insertRetireTaxItem(personId, updateList, deleteList, menuNum, personId, updateList, deleteList, menuNum, personId, updateList, deleteList, menuNum) | 업무 |
| public updateAmt() | L638-817 | E11,E12,E13,E14,E15,E16,E17 | 서비스 pay.Pay13_RetireTax.insertRetireTax, pay.Pay13_RetireTax.insertRetireTax, pay.Pay13_RetireTax.insertRetireTax, pay.Pay13_RetireTax.insertRetireTax, pay.Pay13_RetireTax.insertRetireTax, pay.Pay13_RetireTax.insertOfficePayTax, pay.Pay13_RetireTax.insertRetireTax(monthId, personId, itemAmt, pyItemAmt, menuNum, monthId, personId, itemAmt, pyItemAmt, menuNum, monthId, personId, itemAmt, pyItemAmt, menuNum, monthId, personId, itemAmt, pyItemAmt, menuNum, monthId, personId, itemAmt, pyItemAmt, menuNum, monthId, personId, preOfficePayTax, pyPreOfficePayTax, curOfficePayTax, pyCurOfficePayTax, menuNum, monthId, personId, itemAmt, pyItemAmt, menuNum) | 업무 |
| public init() | L820-824 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L827-856 | update,updateAmt,callRetireTax | 서비스 pay.Pay10_Month.getRetireInfo(personId) | 업무 |
| private callRetireTax() | L858-917 | retrieve | 서비스 pay.Pay13_RetireTax.selectByMonthId(monthId) | 업무 |
| public retrieve() | L920-995 | update,updateAmt,callRetireTax | 서비스 pay.Pay14_RetireTaxItem.selectByMonthId, pay.Pay14_RetireTaxItem.selectByMonthId, pay.Pay14_RetireTaxItem.selectByMonthId, pay.Pay13_RetireTax.getOfficePayTax, pay.Pay13_RetireTax.selectByMonthId(itemType, monthId, itemType, monthId, itemType, monthId, monthId, monthId) | 업무 |
| public update() | L998-1000 | E4,E7,E10 | 상태 처리 | 업무 |
| public insertRow() | L1003-1005 | E2,E5,E8 | 상태 처리 | 업무 |
| public deleteRow() | L1008-1010 | E3,E6,E9 | 상태 처리 | 업무 |
| private setRightPadding() | L1020-1022 | 생성자 | 상태 처리 | 업무 |
| public getGrid() | L1025-1028 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L268-433 | 생성자 | 조회창 Pay13_Lookup_Rd_RetireTax 열기, 조회창 Pay24_Lookup_DeductTable 열기, 조회창 Pay25_Lookup_PersonDeduct 열기, 조회창 Pay26_Lookup_TaxCalcTable 열기, 조회창 Pay27_Lookup_TaxDeductTable 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L1012-1014 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L1016-1018 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid1 = () => [
  gb.text('itemNm', 180, '구분'),  // L437
  gb.long('itemAmt', 150, '당해년도', { editor: 'number' }),  // L438
  gb.long('pyItemAmt', 150, '전년도', { editor: 'number' }),  // L439
];

const buildGrid4 = () => [
  gb.text('itemNm', 180, '구분'),  // L445
  gb.long('itemAmt', 150, '당해년도', { editor: 'number' }),  // L446
  gb.long('pyItemAmt', 150, '전년도', { editor: 'number' }),  // L447
];

const buildGrid7 = () => [
  gb.text('itemNm', 180, '구분'),  // L453
  gb.long('itemAmt', 150, '당해년도', { editor: 'number' }),  // L454
  gb.long('pyItemAmt', 150, '전년도', { editor: 'number' }),  // L455
];

const buildGrid9 = () => [
  gb.text('titleNm', 180, '구분'),  // L461 SQL 계산 컬럼(getOfficePayTax: '종(전)근무지 기납부세액')
  gb.long('officePayTax', 150, '당해년도', { editor: 'number' }),  // L462 SQL 계산 컬럼(getOfficePayTax: pay13_pre_office_pay_tax)
  gb.long('pyOfficePayTax', 150, '전년도', { editor: 'number' }),  // L463 SQL 계산 컬럼(getOfficePayTax: pay13_py_pre_office_pay_tax)
];
```

#### 사용된 버튼들
1. <Button type="download" onClick={() => /* 인라인 L287-293 (new SelectHandler() { @Override publi…) */}>출력/다운로드</Button>
2. <Button type="addRow" onClick={insertRow}>행 추가</Button>
3. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="save" onClick={updateAmt}>저장</Button>
6. <Button type="view" onClick={() => /* 인라인 L397-405 (new SelectHandler() { @Override publi…) */}>근로소득공제표</Button>
7. <Button type="save" onClick={updateAmt}>저장</Button>
8. <Button type="addRow" onClick={insertRow}>행 추가</Button>
9. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
10. <Button type="save" onClick={update}>저장</Button>
11. <Button type="view" onClick={() => /* 인라인 L406-414 (new SelectHandler() { @Override publi…) */}>인적공제금액</Button>
12. <Button type="save" onClick={updateAmt}>저장</Button>
13. <Button type="save" onClick={updateAmt}>저장</Button>
14. <Button type="view" onClick={() => /* 인라인 L415-423 (new SelectHandler() { @Override publi…) */}>산출세액표</Button>
15. <Button type="addRow" onClick={insertRow}>행 추가</Button>
16. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
17. <Button type="save" onClick={update}>저장</Button>
18. <Button type="view" onClick={() => /* 인라인 L424-432 (new SelectHandler() { @Override publi…) */}>산출기준</Button>
19. <Button type="save" onClick={updateAmt}>저장</Button>
20. <Button type="save" onClick={updateAmt}>저장</Button>
21. <Button type="save" onClick={updateAmt}>저장</Button>

### Pay27_Lookup_TaxDeductTable (`client/vi/pay/Pay27_Lookup_TaxDeductTable.java`, 134줄)

- 툴바 `buttonBar01`: <font style='font-size:14px;'><b>&nbsp;&nbsp;세액공제 </b></font>:
- 툴바 `buttonBar02`: <font style='font-size:14px;'><b>&nbsp;&nbsp;세액공제 한도 </b></font>:
- 그리드 `grid01` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 130 "초과" Long
  - toAmt 130 "이하" Long
  - deductAmt 130 "기본공제" Long
  - rate 130 "적용율(%)" Double
  - note 500 "비고" Text
- 그리드 `grid02` (buildLimitGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 130 "초과" Long
  - toAmt 130 "이하" Long
  - minLimit 130 "최소한도" Long
  - maxLimit 130 "최대한도" Long
  - rate 130 "적용율(%)" Double
  - note 500 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L42-71) → settings(), show()
[E1] closeButton[닫기].Select (L74) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| public buildLimitGrid() | L96-109 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L111-129 | open | 서비스 pay.Pay27_TaxDeductTable.selectByMonthId, pay.Pay28_TaxDeductLimit.selectByMonthId(monthId, monthId) | 업무 |
| private settings() | L73-80 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L82-94 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L131-133 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L85 newHeaderGroupMap01newHeaderGroupConfig12 100 "산출세액" (pay27_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 130, '초과'),  // L87
  gb.long('toAmt', 130, '이하'),  // L88
  gb.long('deductAmt', 130, '기본공제'),  // L89
  gb.double('rate', 130, '적용율(%)'),  // L90
  gb.text('note', 500, '비고'),  // L91
];

const buildLimitGrid = () => [
  // ⚠DB없음 L99 newHeaderGroupMap01newHeaderGroupConfig12 100 "총급여액" (pay28_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 130, '초과'),  // L101
  gb.long('toAmt', 130, '이하'),  // L102
  gb.long('minLimit', 130, '최소한도'),  // L103
  gb.long('maxLimit', 130, '최대한도'),  // L104
  gb.double('rate', 130, '적용율(%)'),  // L105
  gb.text('note', 500, '비고'),  // L106
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay26_Lookup_TaxCalcTable (`client/vi/pay/Pay26_Lookup_TaxCalcTable.java`, 89줄)

- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 150 "초과" Long
  - toAmt 150 "이하" Long
  - basicTax 150 "기본세액" Long
  - rate 200 "초과금액 적용세율(%)" Double
  - note 500 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L36-55) → settings(), show()
[E1] closeButton[닫기].Select (L58) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L31-34 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L80-84 | open | 서비스 pay.Pay26_TaxCalcTable.selectByMonthId(monthId) | 업무 |
| private settings() | L57-64 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L66-78 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L86-88 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L69 newHeaderGroupMap01newHeaderGroupConfig12 100 "과세표준(원)" (pay26_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 150, '초과'),  // L71
  gb.long('toAmt', 150, '이하'),  // L72
  gb.long('basicTax', 150, '기본세액'),  // L73
  gb.double('rate', 200, '초과금액 적용세율(%)'),  // L74
  gb.text('note', 500, '비고'),  // L75
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay25_Lookup_PersonDeduct (`client/vi/pay/Pay25_Lookup_PersonDeduct.java`, 84줄)

- 그리드 `grid` (buildGrid()):
  - personDeductName 200 "구분" Text
  - deductAmt 100 "공제금액" Long
  - note 800 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L34-53) → settings(), show()
[E1] closeButton[닫기].Select (L56) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L29-32 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L75-79 | open | 서비스 pay.Pay25_PersonDeduct.selectByMonthId(monthId) | 업무 |
| private settings() | L55-62 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L64-73 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L81-83 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personDeductNm', 200, '구분'),  // L68 SQL 계산 컬럼(selectByMonthId: f_cdnm('PersonDeductCode', pay25_person…)
  gb.long('deductAmt', 100, '공제금액'),  // L69
  gb.text('note', 800, '비고'),  // L70
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay24_Lookup_DeductTable (`client/vi/pay/Pay24_Lookup_DeductTable.java`, 131줄)

- 툴바 `buttonBar`: 공제한도: {limitAmt}
- 입력·하위 화면: `limitAmt` LongField
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 100 "초과" Long
  - toAmt 100 "이하" Long
  - deductAmt 140 "기본공제금액" Long
  - deductRate 140 "공제율(%)" Double
  - note 500 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L45-66) → settings(), show()
[E1] closeButton[닫기].Select (L72) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-43 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L94-122 | open | 서비스 pay.Pay24_DeductTable.selectByMonthId, pay.Pay24_DeductTable.selectByMonthId(monthId, dataCode, monthId, dataCode) | 업무 |
| private settings() | L68-78 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L80-92 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L124-126 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L128-130 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L83 newHeaderGroupMap01newHeaderGroupConfig12 100 "총급여액(원)" (pay24_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 100, '초과'),  // L85
  gb.long('toAmt', 100, '이하'),  // L86
  gb.long('deductAmt', 140, '기본공제금액'),  // L87
  gb.double('deductRate', 140, '공제율(%)'),  // L88
  gb.text('note', 500, '비고'),  // L89
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay20_Lookup_SelectMulti (`client/vi/pay/Pay20_Lookup_SelectMulti.java`, 122줄)

- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemTypeName 150 "지급구분" TextCenter
  - itemName 300 "항목명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L45-80) → show()
[E1] confirmButton[확인].Select (L52) → confirm()
[E2] cancelButton[취소].Select (L58) → hide()
[E3] grid.CellDoubleClick (L68) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-43 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L94-106 | open | 서비스 pay.Pay20_Item.selectByItemType(itemType) | 업무 |
| public confirm() | L108-117 | E1,E3 | 상태 처리 | 업무 |
| private buildGrid() | L82-92 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L119-121 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeNm', 150, '지급구분'),  // L88 SQL 계산 컬럼(selectByItemType: f_cdnm('PayItemType', pay20_item_type, …)
  gb.text('itemNm', 300, '항목명'),  // L89
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="cancel" onClick={hide}>취소</Button>

### Pay13_Lookup_Rd_RetireTax (`client/vi/pay/Pay13_Lookup_Rd_RetireTax.java`, 83줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-49) → show()
[E1] closeButton[닫기].Select (L38) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-77 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L79-81 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay12_TabPage_RetireInsure (`client/vi/pay/Pay12_TabPage_RetireInsure.java`, 588줄)

- 툴바 `buttonBar`: {downloadButton} {regenerationButton}
- 툴바 `buttonBar1`: 1. 건강보험: {insertButton1} {deleteButton1} {updateButton1} {anchor1}
- 툴바 `buttonBar2`: 2. 장기요양보험: {insertButton2} {deleteButton2} {updateButton2} {anchor2}
- 툴바 `buttonBar3`: 3. 고용보험: {insertButton3} {deleteButton3} {updateButton3} {anchor3}
- 입력·하위 화면: `lookupRdRetireInsure` Pay12_Lookup_Rd_RetireInsure
- 그리드 `grid1` (buildGrid1()):
  - year 60 "년도" TextCenter 편집:TextField
  - applyTerm 200 "적용기간" TextCenter 편집:TextField
  - totalPay 140 "보수총액<br>(A)" LongHtml 편집:LongField
  - workMonthCnt 80 "근무월수<br>(B)" LongHtml 편집:LongField
  - monthPay 140 "보수월액<br>(C=A/B)" LongHtml 편집:LongField
  - payMonthCnt 80 "정산월수<br>(D)" LongHtml 편집:LongField
  - insureRate 100 "보험료율(%)<br>(E)" DoubleHtml 편집:DoubleField
  - monthAmt 140 "월보험료<br>(F=C*E)" LongHtml 편집:LongField
  - fixAmt 140 "확정보험료<br>(G=F*D)" LongHtml 편집:LongField
  - payAmt 140 "납부보험료<br>(H)" LongHtml 편집:LongField
  - unpayAmt 140 "전년도<br>미정산보험료<br>(I)" LongHtml 편집:LongField
  - settleAmt 140 "정산보험료<br>(G-H+I)" LongHtml 편집:LongField
- 그리드 `grid2` (buildGrid2()):
  - year 60 "년도" TextCenter 편집:TextField
  - applyTerm 200 "적용기간" TextCenter 편집:TextField
  - monthPay 140 "건강보험 월보험료<br>(A)" LongHtml 편집:LongField
  - insureRate 100 "보험료율(%)<br>(B)" DoubleHtml 편집:DoubleField
  - payMonthCnt 80 "정산월수<br>(C)" LongHtml 편집:LongField
  - monthAmt 140 "월보험료<br>(D=A*B)" LongHtml 편집:LongField
  - fixAmt 140 "확정보험료<br>(E=D*C)" LongHtml 편집:LongField
  - payAmt 140 "납부보험료<br>(F)" LongHtml 편집:LongField
  - unpayAmt 140 "전년도<br>미정산보험료<br>(G)" LongHtml 편집:LongField
  - settleAmt 140 "정산보험료<br>(E-F+G)" LongHtml 편집:LongField
- 그리드 `grid3` (buildGrid3()):
  - year 60 "년도" TextCenter 편집:TextField
  - applyTerm 200 "적용기간" TextCenter 편집:TextField
  - totalPay 140 "보수총액<br>(A)" LongHtml 편집:LongField
  - insureRate 100 "보험료율(%)<br>(B)" DoubleHtml 편집:DoubleField
  - fixAmt 140 "확정보험료<br>(C=A*B)" LongHtml 편집:LongField
  - payAmt 140 "납부보험료<br>(D)" LongHtml 편집:LongField
  - unpayAmt 140 "전년도<br>미정산보험료<br>(E)" LongHtml 편집:LongField
  - settleAmt 140 "정산보험료<br>(C-D+E)" LongHtml 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L82-153) → settings()
[E1] anchor1.MouseDown (L86) → retrieve()
[E2] anchor2.MouseDown (L93) → retrieve()
[E3] anchor3.MouseDown (L100) → retrieve()
[E4] insertButton1[행 추가].Select (L156) → insertRow()
[E5] deleteButton1[행 삭제].Select (L162) → deleteRow()
[E6] updateButton1[저장].Select (L168) → update()
[E7] insertButton2[행 추가].Select (L175) → insertRow()
[E8] deleteButton2[행 삭제].Select (L181) → deleteRow()
[E9] updateButton2[저장].Select (L187) → update()
[E10] insertButton3[행 추가].Select (L194) → insertRow()
[E11] deleteButton3[행 삭제].Select (L200) → deleteRow()
[E12] updateButton3[저장].Select (L206) → update()
[E13] downloadButton[출력/다운로드].Select [result.getStatus() == 1] (L213) → 서비스 sys.Sys99_Print.insertRdRetireInsure(companyId, personId, windowClassName, userId)
[E14] regenerationButton[4대보험 정산 재생성].Select [result.getStatus() != 1] (L237) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid1() | L261-276 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid2() | L278-291 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid3() | L293-304 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L306-344 | E1,E2,E3,E14,update | 서비스 pay.Pay12_RetireInsure.selectByPersonId, pay.Pay12_RetireInsure.selectByPersonId, pay.Pay12_RetireInsure.selectByPersonId(personId, insureCode, personId, insureCode, personId, insureCode) | 업무 |
| public insertRow() | L346-384 | E4,E7,E10 | 상태 처리 | 업무 |
| public deleteRow() | L386-403 | E5,E8,E11 | 상태 처리 | 업무 |
| public update() | L405-503 | E6,E9,E12 | 서비스 pay.Pay12_RetireInsure.insertRetireInfo, pay.Pay12_RetireInsure.insertRetireInfo, pay.Pay12_RetireInsure.insertRetireInfo(updateList, deleteList, year, updateList, deleteList, year, updateList, deleteList, year) | 업무 |
| public init() | L506-510 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L513-547 | E1,E2,E3,E14,update | 서비스 pay.Pay10_Month.getRetireInfo(personId) | 업무 |
| private maskVlc() | L549-551 | retrieve | 상태 처리 | 업무 |
| private unmaskVlc() | L553-555 | retrieve | 상태 처리 | 업무 |
| public retrieve() | L558-562 | E1,E2,E3,E14,update | 상태 처리 | 업무 |
| public update() | L565-567 | E6,E9,E12 | 상태 처리 | 업무 |
| public insertRow() | L570-572 | E4,E7,E10 | 상태 처리 | 업무 |
| public deleteRow() | L575-577 | E5,E8,E11 | 상태 처리 | 업무 |
| public getGrid() | L584-587 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L155-259 | 생성자 | 조회창 Pay12_Lookup_Rd_RetireInsure 열기, 서비스 sys.Sys99_Print.insertRdRetireInsure, pay.Pay12_RetireInsure.callInsureRetire(companyId, personId, windowClassName, userId, personId, checkYn, actionCode), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L579-581 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid1 = () => [
  gb.textCenter('year', 60, '년도', { editor: 'text' }),  // L263
  gb.textCenter('applyTerm', 200, '적용기간', { editor: 'text' }),  // L264
  // ⚠ 대응 없음 (GridBuilder L265) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L266) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L267) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L268) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L269) addDoubleHtml
  // ⚠ 대응 없음 (GridBuilder L270) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L271) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L272) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L273) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L274) addLongHtml
];

const buildGrid2 = () => [
  gb.textCenter('year', 60, '년도', { editor: 'text' }),  // L280
  gb.textCenter('applyTerm', 200, '적용기간', { editor: 'text' }),  // L281
  // ⚠ 대응 없음 (GridBuilder L282) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L283) addDoubleHtml
  // ⚠ 대응 없음 (GridBuilder L284) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L285) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L286) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L287) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L288) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L289) addLongHtml
];

const buildGrid3 = () => [
  gb.textCenter('year', 60, '년도', { editor: 'text' }),  // L295
  gb.textCenter('applyTerm', 200, '적용기간', { editor: 'text' }),  // L296
  // ⚠ 대응 없음 (GridBuilder L297) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L298) addDoubleHtml
  // ⚠ 대응 없음 (GridBuilder L299) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L300) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L301) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L302) addLongHtml
];
```

#### 사용된 버튼들
1. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdRetireInsure(companyId, personId, windowClassName, userId) */}>출력/다운로드</Button>
2. <Button type="reset" onClick={retrieve}>4대보험 정산 재생성</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
5. <Button type="save" onClick={update}>저장</Button>
6. <Button type="addRow" onClick={insertRow}>행 추가</Button>
7. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
8. <Button type="save" onClick={update}>저장</Button>
9. <Button type="addRow" onClick={insertRow}>행 추가</Button>
10. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
11. <Button type="save" onClick={update}>저장</Button>

### Pay12_Lookup_Rd_RetireInsure (`client/vi/pay/Pay12_Lookup_Rd_RetireInsure.java`, 83줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-49) → show()
[E1] closeButton[닫기].Select (L38) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-77 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L79-81 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay12_Lookup_RetireCreate (`client/vi/pay/Pay12_Lookup_RetireCreate.java`, 113줄)

- 입력·하위 화면: `insureCheckYn` CheckBox, `taxCheckYn` CheckBox

#### 이벤트
[E1] createButton[생성].Select (L66) → create()
[E2] closeButton[닫기].Select (L72) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-83 | 공개 메서드 | 상태 처리 | 업무 |
| public create() | L85-104 | E1 | 서비스 pay.Pay12_RetireInsure.getInsureRetire | 업무 |
| private setHtmlHeaderStyle() | L106-108 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxContentStyle() | L110-112 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={create}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay10_TabPage_Retire (`client/vi/pay/Pay10_TabPage_Retire.java`, 409줄)

- 레이아웃: center=rdForm, south=hlc
- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc, `lookup` Pay31_Lookup_Insert1

#### 이벤트
[E0] 화면 열림 (생성자 L58-79) → settings(), defaultName()
[E1] classTreeFullName[문서분류].TriggerClick (L86) → openLookupDoc()
[E2] apprButton[상신].Select (L92) → insertPayRelateAppr()
[E3] apprViewButton[문서보기].Select (L98) → retrieveApprStep()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L125-144 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private openLookupDoc() | L146-155 | E1 | 상태 처리 | 업무 |
| public init() | L158-160 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L163-234 | 공개 메서드 | 서비스 pay.Pay10_Month.selectByRetirePayCode, pay.Pay10_Month.selectByRetirePayCode, pay.Pay10_Month.selectByPersonId(personId, companyId, payCode) | 업무 |
| private retrieveApprStep() | L236-286 | E3,retrieve | 서비스 pay.Pay05_RelateAppr.selectByRetire | 업무 |
| private insertPayRelateAppr() | L288-313 | E2 | 서비스 pay.Pay05_RelateAppr.insertRetire | 업무 |
| private insertLinkApproval() | L315-359 | insertPayRelateAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L362-388 | insertLinkApproval | 서비스 pay.Pay03_Account.selectByStartDate, pay.Pay05_RelateAppr.updateApprId(companyId, startDate, relateApprId, apprId, accountId) | 업무 |
| public insertRow() | L390-398 | 공개 메서드 | 조회창 Pay31_Lookup_Insert1 열기 | 업무 |
| public getGrid() | L405-408 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L81-123 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L400-402 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={insertPayRelateAppr}>상신</Button>
2. <Button type="search" onClick={retrieveApprStep}>문서보기</Button>

### Pay31_Lookup_Insert1 (`client/vi/pay/Pay31_Lookup_Insert1.java`, 321줄)

- 입력·하위 화면: `personName` LookupTriggerField 빈칸="선택", `personId` LongField, `applyMonthPay` LongField, `applyMonth` TextField 빈칸="YYYY.MM", `applyDate` MyDateField, `initDate` MyDateField, `ch00` CheckBox, `ch01` CheckBox, `ch02` CheckBox, `ch03` CheckBox, `ch04` CheckBox, `insureApplyName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `lookup` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L76-99) → settings(), getEditor(), show()
[E1] ch00[신청대상].ValueChange [!event.getValue()] (L119) → 인라인 L119-129 (new ValueChangeHandler<Boolean>() { @…)
[E2] ch01.ValueChange [!event.getValue()] (L134) → 인라인 L134-144 (new ValueChangeHandler<Boolean>() { @…)
[E3] ch02.ValueChange [!event.getValue()] (L149) → 인라인 L149-158 (new ValueChangeHandler<Boolean>() { @…)
[E4] ch03.ValueChange [!event.getValue()] (L163) → 인라인 L163-172 (new ValueChangeHandler<Boolean>() { @…)
[E5] personName[사원].TriggerClick (L179) → 인라인 L179-193 (new TriggerClickHandler(){ @Override …)
[E6] insureApplyName[신고구분].ValueChange (L195) → 인라인 L195-208 (new ValueChangeHandler<String>() { @O…)
[E7] insertButton[생성].Select (L210) → insert()
[E8] closeButton[닫기].Select (L216) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L72-74 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L224-258 | 생성자 | 상태 처리 | 업무 |
| private insert() | L260-312 | E7 | 서비스 pay.Pay31_InsureApply.insert1(companyId, personId, ch01, ch02, ch03, npsInitPayYn, insureApplyCode, applyDate, initDate, applyMonthPay, applyMonth) | 업무 |
| private settings() | L101-222 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: ch01=event.getValue(, ch02=event.getValue(, ch03=event.getValue(, ch04=false, ch00=false("신청대상"), ch04=false, ch00=true("신청대상"), ch00=false("신청대상"), ch00=true("신청대상"), ch00=false("신청대상"), ch00=true("신청대상"), personId=resultModel.getPersonId(, personName=resultModel.getEmpPersonModel(("사원"), applyMonth=null, initDate=null("취득일") | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L314-316 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L318-320 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={insert}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay10_Rd_Retire (`client/vi/pay/Pay10_Rd_Retire.java`, 70줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L27-52 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L55-56 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L59-60 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L63-64 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L67-68 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pay10_Lookup_RemLeaveDays (`client/vi/pay/Pay10_Lookup_RemLeaveDays.java`, 234줄)

- 입력·하위 화면: `retireDate` MyDateField, `remainLeaveDays` DoubleField, `addLeaveDays` DoubleField, `totalRemainLeaveDays` DoubleField
- 그리드 `grid1` (buildGrid1(), 행번호숨김):
  - yearCntStr 80 "근속" TextCenter
  - periodDateStr 200 "대상기간" TextCenter
  - leaveDays 50 "휴가수" DoubleCenter
- 그리드 `grid2` (buildGrid2(), 행번호숨김):
  - yearCntStr 80 "근속" TextCenter
  - periodDateStr 200 "대상기간" TextCenter
  - leaveDays 50 "휴가수" DoubleCenter

#### 이벤트
[E0] 화면 열림 (생성자 L56-115) → show()
[E1] calcButton[계산].Select (L133) → calcRetireLeaveDays()
[E2] closeButton[닫기].Select (L140) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L117-120 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid1() | L148-155 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid2() | L157-164 | 필드 초기화 | 상태 처리 | 업무 |
| private calcRetireLeaveDays() | L166-210 | E1 | 서비스 pay.Pay15_RetireLeave.calcRetireLeaveDays, pay.Pay15_RetireLeave.selectRemLeaveDays(personId, retireDate, personId) | 업무 |
| public retrieve() | L212-222 | calcRetireLeaveDays | 서비스 pay.Pay15_RetireLeave.selectByMonthId, pay.Pay15_RetireLeave.selectByMonthId(calcStdType, monthId, calcStdType, monthId) | 업무 |
| private settings() | L122-146 | open | 이벤트 연결, 초기값: retireDate=LoginUser.getToday(("퇴사일") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L224-226 | 생성자,calcRetireLeaveDays,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L227-229 | 생성자,calcRetireLeaveDays,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L230-232 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid1 = () => [
  gb.textCenter('yearCntStr', 80, '근속'),  // L151 SQL 계산 컬럼(selectByMonthId: pay15_year_cnt || '년')
  gb.textCenter('periodDateStr', 200, '대상기간'),  // L152 SQL 계산 컬럼(selectByMonthId: TO_CHAR(pay15_start_date,'yyyy.mm.dd')|…)
  gb.doubleCenter('leaveDays', 50, '휴가수'),  // L153
];

const buildGrid2 = () => [
  gb.textCenter('yearCntStr', 80, '근속'),  // L160 SQL 계산 컬럼(selectByMonthId: pay15_year_cnt || '년')
  gb.textCenter('periodDateStr', 200, '대상기간'),  // L161 SQL 계산 컬럼(selectByMonthId: TO_CHAR(pay15_start_date,'yyyy.mm.dd')|…)
  gb.doubleCenter('leaveDays', 50, '휴가수'),  // L162
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={calcRetireLeaveDays}>계산</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

