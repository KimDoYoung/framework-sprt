# pay11_month_item

`server/pay/mapper/pay11_month_item.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay11_MonthItem.selectById` |
| `selectByMonthId` | select | 37 | [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay11_MonthItem.selectByMonthId` |
| `selectByItemType` | select | 48 | [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay11_MonthItem.selectByItemType` |
| `selectByText` | select | 60 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `pay.Pay11_MonthItem.selectByText`, `sys.Sys99_Print.insertRdMonthItem` |
| `selectByDate` | select | 91 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `pay.Pay11_MonthItem.selectByDate`, `sys.Sys99_Print.insertRdMonthSearch` |
| `getInsureNps` | select | 122 | - | `f_calc_4insure_nps` | `pay.Pay10_Month.insert` |
| `getInsureHi` | select | 126 | - | `f_calc_4insure_hi` | `pay.Pay10_Month.insert` |
| `getInsureLtc` | select | 130 | - | `f_calc_4insure_ltc` | `pay.Pay10_Month.insert` |
| `getAdjustPay` | select | 134 | - | `f_create_4insure_adjust_pay` | `pay.Pay10_Month.insert` |
| `getInsureEi` | select | 138 | - | `f_calc_4insure_ei` | `pay.Pay10_Month.insert` |
| `getIncomeTax` | select | 142 | - | `f_calc_income_tax` | `pay.Pay10_Month.insert`, `pay.Pay11_MonthItem.recalculationTax`, `pay.Pay11_MonthItem.updateList`, `pay.Pay11_MonthItem.updateMonthItemList` |
| `getLocalTax` | select | 146 | - | `f_calc_income_tax`, `f_calc_local_tax` | `pay.Pay10_Month.insert`, `pay.Pay11_MonthItem.recalculationTax`, `pay.Pay11_MonthItem.updateList`, `pay.Pay11_MonthItem.updateMonthItemList` |
| `getInsureAdjustModi` | select | 150 | - | `f_create_4insure_adjust_modi` | `pay.Pay10_Month.deleteAll`, `pay.Pay11_MonthItem.getInsureAdjustModi`, `pay.Pay11_MonthItem.updateMonthItemList` |
| `getLeavePayRetire` | select | 154 | - | `f_calc_leave_pay_retire` | `pay.Pay12_RetireInsure.getInsureRetire` |
| `insert` | insert | 158 | [`pay11_month_item`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.insert`, `pay.Pay11_MonthItem.insertItemType` |
| `insertLatestInfo` | insert | 178 | [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) | `f_create_seq` | `pay.Pay10_Month.insert` |
| `deleteByMonthId` | delete | 201 | [`pay11_month_item`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.deleteAll` |
| `deleteByMonthItemId` | delete | 207 | [`pay11_month_item`](../../../db/tables/pay.md) |  | `pay.Pay11_MonthItem.getInsureAdjustModi`, `pay.Pay11_MonthItem.updateList` |
| `updateModel` | update | 213 | [`pay11_month_item`](../../../db/tables/pay.md) | `f_create_seq` | `pay.Pay11_MonthItem.getInsureAdjustModi`, `pay.Pay11_MonthItem.updateList`, `pay.Pay11_MonthItem.updateMonthItemList` |
| `updateItemAmt` | update | 247 | [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) | `f_create_seq` | `pay.Pay11_MonthItem.recalculationTax`, `pay.Pay11_MonthItem.updateList`, `pay.Pay11_MonthItem.updateMonthItemList`, `pay.Pay12_RetireInsure.insertRetireInfo` |
