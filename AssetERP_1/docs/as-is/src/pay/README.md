# 도메인: pay

화면 34개, 컴포넌트 8개, 서버 클래스 34개, 매퍼 33개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Pay01_Tab_Annual`](screens/Pay01_Tab_Annual.md) | 경영관리 > 03. 연봉관리 > 연봉계약관리 | 3 | 11 |
| [`Pay01_Tab_AnnualList`](screens/Pay01_Tab_AnnualList.md) | 경영관리 > 03. 연봉관리 > 연봉계약현황 | 2 | 6 |
| [`Pay01_Tab_AnnualPerson`](screens/Pay01_Tab_AnnualPerson.md) | 경영관리 > 03. 연봉관리 > 연봉조회 | 1 | 2 |
| [`Pay02_Tab_List`](screens/Pay02_Tab_List.md) | 경영관리 > 04. 급여관리(Old) > 급여대장(old) | 6 | 15 |
| [`Pay02_Tab_Month`](screens/Pay02_Tab_Month.md) | 경영관리 > 04. 급여관리(Old) > 급여관리(old) | 5 | 8 |
| [`Pay02_Tab_PersonList`](screens/Pay02_Tab_PersonList.md) | 경영관리 > 04. 급여관리(Old) > 급여명세서(old) | 2 | 1 |
| [`Pay02_Tab_PersonListManager`](screens/Pay02_Tab_PersonListManager.md) | 경영관리 > 04. 급여관리(Old) > 급여명세서(경영관리팀)(old) | 2 | 2 |
| [`Pay03_Tab_Account`](screens/Pay03_Tab_Account.md) | 경영관리 > 04. 급여관리(Old) > 회사계좌관리(X) | 1 | 3 |
| [`Pay04_Tab_Formula`](screens/Pay04_Tab_Formula.md) | 기초자료 > 30. 자산&경영 > 임금계산방법(x) | 2 | 5 |
| [`Pay07_Tab_Retire`](screens/Pay07_Tab_Retire.md) | 경영관리 > 04. 급여관리(Old) > 퇴직정산서(old) | 8 | 11 |
| [`Pay08_Tab_TaxWithholding`](screens/Pay08_Tab_TaxWithholding.md) | 경영관리 > 04. 급여관리 > 원천징수영수증(사본) | 2 | 1 |
| [`Pay08_Tab_TaxWithholdingAdmin`](screens/Pay08_Tab_TaxWithholdingAdmin.md) | 경영관리 > 04. 급여관리 > 원천징수영수증 업로드 | 2 | 3 |
| [`Pay10_Tab_List`](screens/Pay10_Tab_List.md) | 경영관리 > 04. 급여관리 > 급여대장 | 6 | 16 |
| [`Pay10_Tab_Month`](screens/Pay10_Tab_Month.md) | 경영관리 > 04. 급여관리 > 급여관리 | 8 | 22 |
| [`Pay10_Tab_MonthItem`](screens/Pay10_Tab_MonthItem.md) | 경영관리 > 04. 급여관리 > 급여관리(항목별) | 5 | 9 |
| [`Pay10_Tab_MonthSearch`](screens/Pay10_Tab_MonthSearch.md) | 경영관리 > 04. 급여관리 > 급여항목조회 | 3 | 3 |
| [`Pay10_Tab_PersonList`](screens/Pay10_Tab_PersonList.md) | 경영관리 > 04. 급여관리 > 급여명세서 | 2 | 2 |
| [`Pay10_Tab_PersonListManager`](screens/Pay10_Tab_PersonListManager.md) | 경영관리 > 04. 급여관리 > 급여명세서(경영관리팀) | 2 | 3 |
| [`Pay10_Tab_Retire`](screens/Pay10_Tab_Retire.md) | 경영관리 > 04. 급여관리 > 퇴직정산 | 16 | 33 |
| [`Pay20_Tab_Deduct`](screens/Pay20_Tab_Deduct.md) | 경영관리 > 04. 급여관리 > 급여기초정보 | 24 | 56 |
| [`Pay20_Tab_DeductAdmin`](screens/Pay20_Tab_DeductAdmin.md) | 기초자료 > 30. 자산&경영 > 급여기초정보관리 | 24 | 56 |
| [`Pay31_Tab_InsureApply`](screens/Pay31_Tab_InsureApply.md) | 경영관리 > 04. 급여관리 > 4대보험신고(EDI) | 8 | 9 |
| [`Pay32_Tab_InsurePay`](screens/Pay32_Tab_InsurePay.md) | 경영관리 > 04. 급여관리 > 4대보험 정산내역 | 2 | 6 |
| [`Pay34_Tab_WorkTimeConfig`](screens/Pay34_Tab_WorkTimeConfig.md) | 기초자료 > 30. 자산&경영 > 근로시간기준관리 | 1 | 3 |
| [`Pay40_Tab_TaxWithholding`](screens/Pay40_Tab_TaxWithholding.md) | 경영관리 > 04. 급여관리 > 갑근세확인서 발급 | 1 | 7 |
| [`Pay50_Tab_AccountSumList`](screens/Pay50_Tab_AccountSumList.md) | 자금관리 > 20. 사업비관리 > 사업비발생현황 | 1 | 2 |
| [`Pay50_Tab_Expense`](screens/Pay50_Tab_Expense.md) | 신청 > 80. 사업비 신청 > 지출결의서 | 6 | 21 |
| [`Pay50_Tab_ExpenseConfirm`](screens/Pay50_Tab_ExpenseConfirm.md) | 신청 > 80. 사업비 신청 > 사업비 지출승인(부서장) | 3 | 4 |
| [`Pay50_Tab_ExpenseJournal`](screens/Pay50_Tab_ExpenseJournal.md) | 자금관리 > 20. 사업비관리 > 사업비 회계처리 | 4 | 11 |
| [`Pay50_Tab_ExpenseManager`](screens/Pay50_Tab_ExpenseManager.md) | 자금관리 > 20. 사업비관리 > 지출결의서(경영관리) | 9 | 28 |
| [`Pay50_Tab_ExpensePay`](screens/Pay50_Tab_ExpensePay.md) | 자금관리 > 20. 사업비관리 > 자금집행결의서 조회 | 1 | 3 |
| [`Pay50_Tab_ExpensePayWrite`](screens/Pay50_Tab_ExpensePayWrite.md) | 자금관리 > 20. 사업비관리 > 자금집행결의서 | 3 | 10 |
| [`Pay50_Tab_ExpenseRequest`](screens/Pay50_Tab_ExpenseRequest.md) | 신청 > 80. 사업비 신청 > 사업비 지출요청 | 7 | 20 |
| [`Pay50_Tab_ExpenseSettle`](screens/Pay50_Tab_ExpenseSettle.md) | 자금관리 > 20. 사업비관리 > 미지급반제처리 | 1 | 1 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Pay03_Lookup_PayAccount`](components/Pay03_Lookup_PayAccount.md) | emp | 1 | 3 |
| [`Pay04_Lookup_Formula`](components/Pay04_Lookup_Formula.md) | emp | 3 | 7 |
| [`Pay06_Lookup_LinkContent`](components/Pay06_Lookup_LinkContent.md) | apr | 1 | 1 |
| [`Pay06_Popup_Example`](components/Pay06_Popup_Example.md) | com, emp | 1 | 0 |
| [`Pay06_TabPage_ActMapping`](components/Pay06_TabPage_ActMapping.md) | sys | 2 | 3 |
| [`Pay06_TabPage_RetireMapping`](components/Pay06_TabPage_RetireMapping.md) | sys | 2 | 3 |
| [`Pay31_Popup_InsureApply`](components/Pay31_Popup_InsureApply.md) | emp | 1 | 4 |
| [`Pay50_Lookup_ExpenseOfficeAssets`](components/Pay50_Lookup_ExpenseOfficeAssets.md) | ast | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`pay.Pay01_Annual`](../pay/services/Pay01_Annual.md) | 6 |
| [`pay.Pay02_Month`](../pay/services/Pay02_Month.md) | 12 |
| [`pay.Pay03_Account`](../pay/services/Pay03_Account.md) | 5 |
| [`pay.Pay04_Formula`](../pay/services/Pay04_Formula.md) | 9 |
| [`pay.Pay04_Formula_20230620`](../pay/services/Pay04_Formula_20230620.md) | 7 |
| [`pay.Pay05_RelateAppr`](../pay/services/Pay05_RelateAppr.md) | 8 |
| [`pay.Pay06_ActMapping`](../pay/services/Pay06_ActMapping.md) | 7 |
| [`pay.Pay07_Retire`](../pay/services/Pay07_Retire.md) | 10 |
| [`pay.Pay08_TaxWithholding`](../pay/services/Pay08_TaxWithholding.md) | 5 |
| [`pay.Pay09_RelateNote`](../pay/services/Pay09_RelateNote.md) | 6 |
| [`pay.Pay10_Month`](../pay/services/Pay10_Month.md) | 18 |
| [`pay.Pay11_MonthItem`](../pay/services/Pay11_MonthItem.md) | 12 |
| [`pay.Pay12_RetireInsure`](../pay/services/Pay12_RetireInsure.md) | 8 |
| [`pay.Pay13_RetireTax`](../pay/services/Pay13_RetireTax.md) | 7 |
| [`pay.Pay14_RetireTaxItem`](../pay/services/Pay14_RetireTaxItem.md) | 6 |
| [`pay.Pay15_RetireLeave`](../pay/services/Pay15_RetireLeave.md) | 7 |
| [`pay.Pay20_Item`](../pay/services/Pay20_Item.md) | 7 |
| [`pay.Pay21_Rate`](../pay/services/Pay21_Rate.md) | 4 |
| [`pay.Pay22_SimpleTaxTable`](../pay/services/Pay22_SimpleTaxTable.md) | 5 |
| [`pay.Pay23_SimpleTaxTableOther`](../pay/services/Pay23_SimpleTaxTableOther.md) | 7 |
| [`pay.Pay24_DeductTable`](../pay/services/Pay24_DeductTable.md) | 9 |
| [`pay.Pay25_PersonDeduct`](../pay/services/Pay25_PersonDeduct.md) | 8 |
| [`pay.Pay26_TaxCalcTable`](../pay/services/Pay26_TaxCalcTable.md) | 8 |
| [`pay.Pay27_TaxDeductTable`](../pay/services/Pay27_TaxDeductTable.md) | 8 |
| [`pay.Pay28_TaxDeductLimit`](../pay/services/Pay28_TaxDeductLimit.md) | 5 |
| [`pay.Pay29_OtherSetup`](../pay/services/Pay29_OtherSetup.md) | 7 |
| [`pay.Pay30_BasicSetup`](../pay/services/Pay30_BasicSetup.md) | 5 |
| [`pay.Pay31_InsureApply`](../pay/services/Pay31_InsureApply.md) | 9 |
| [`pay.Pay32_InsurePay`](../pay/services/Pay32_InsurePay.md) | 5 |
| [`pay.Pay34_WorkTimeConfig`](../pay/services/Pay34_WorkTimeConfig.md) | 5 |
| [`pay.Pay40_IncomeTaxWithholding`](../pay/services/Pay40_IncomeTaxWithholding.md) | 6 |
| [`pay.Pay50_Expense`](../pay/services/Pay50_Expense.md) | 35 |
| [`pay.Pay51_ExpenseForm`](../pay/services/Pay51_ExpenseForm.md) | 7 |
| [`pay.Pay52_FavoriteAccount`](../pay/services/Pay52_FavoriteAccount.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`pay01_annual`](sql/pay01_annual.md) | 8 |
| [`pay02_month`](sql/pay02_month.md) | 13 |
| [`pay03_account`](sql/pay03_account.md) | 3 |
| [`pay04_formula`](sql/pay04_formula.md) | 12 |
| [`pay05_relate_appr`](sql/pay05_relate_appr.md) | 8 |
| [`pay06_act_mapping`](sql/pay06_act_mapping.md) | 5 |
| [`pay07_retire`](sql/pay07_retire.md) | 6 |
| [`pay08_tax_withholding`](sql/pay08_tax_withholding.md) | 4 |
| [`pay09_relate_note`](sql/pay09_relate_note.md) | 5 |
| [`pay10_month`](sql/pay10_month.md) | 15 |
| [`pay11_month_item`](sql/pay11_month_item.md) | 20 |
| [`pay12_retire_insure`](sql/pay12_retire_insure.md) | 8 |
| [`pay13_retire_tax`](sql/pay13_retire_tax.md) | 8 |
| [`pay14_retire_tax_item`](sql/pay14_retire_tax_item.md) | 6 |
| [`pay15_retire_leave`](sql/pay15_retire_leave.md) | 5 |
| [`pay20_item`](sql/pay20_item.md) | 5 |
| [`pay21_rate`](sql/pay21_rate.md) | 3 |
| [`pay22_simple_tax_table`](sql/pay22_simple_tax_table.md) | 5 |
| [`pay23_simple_tax_table_other`](sql/pay23_simple_tax_table_other.md) | 6 |
| [`pay24_deduct_table`](sql/pay24_deduct_table.md) | 8 |
| [`pay25_person_deduct`](sql/pay25_person_deduct.md) | 7 |
| [`pay26_tax_calc_table`](sql/pay26_tax_calc_table.md) | 7 |
| [`pay27_tax_deduct_table`](sql/pay27_tax_deduct_table.md) | 7 |
| [`pay28_tax_deduct_limit`](sql/pay28_tax_deduct_limit.md) | 6 |
| [`pay29_other_setup`](sql/pay29_other_setup.md) | 6 |
| [`pay30_basic_setup`](sql/pay30_basic_setup.md) | 3 |
| [`pay31_insure_apply`](sql/pay31_insure_apply.md) | 9 |
| [`pay32_insure_pay`](sql/pay32_insure_pay.md) | 6 |
| [`pay34_work_time_config`](sql/pay34_work_time_config.md) | 3 |
| [`pay40_income_tax_withholding`](sql/pay40_income_tax_withholding.md) | 4 |
| [`pay50_expense`](sql/pay50_expense.md) | 39 |
| [`pay51_expense_form`](sql/pay51_expense_form.md) | 5 |
| [`pay52_favorite_account`](sql/pay52_favorite_account.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `pay30_Popup_BasicSetup` | `client/vi/pay/pay30_Popup_BasicSetup.java` | `pay.Pay30_BasicSetup.modelUpdate`, `pay.Pay30_BasicSetup.selectByCompanyId` |
