# pay10_month

`server/pay/mapper/pay10_month.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 80 | [`emp01_person`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) | `f_emp_kor_nm`, `f_get_emptrans` | `pay.Pay10_Month.selectById` |
| `selectByCompanyId` | select | 115 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `pay.Pay10_Month.selectByCompanyId`, `pay.Pay11_MonthItem.insertItemType` |
| `selectByPersonId` | select | 163 | [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate` | `pay.Pay10_Month.selectByPersonId` |
| `selectBypayCode` | select | 181 | [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.selectBypayCode` |
| `selectByList` | select | 207 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `pay.Pay10_Month.selectByList` |
| `selectByPayDatePersonId` | select | 339 | [`pay10_month`](../../../db/tables/pay.md) | `f_emp_kor_nm` | `pay.Pay10_Month.insert` |
| `selectByYear` | select | 349 | [`pay10_month`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay10_Month.selectByYear` |
| `selectByYear2` | select | 368 | [`pay10_month`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | - |
| `selectByYearPersonId` | select | 383 | [`apr01_appr`](../../../db/tables/apr.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_today` | `pay.Pay10_Month.selectByYearPersonId` |
| `selectByRetirePayCode` | select | 430 | [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.selectByRetirePayCode` |
| `selectByMonthIdCount` | select | 454 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.selectByMonthIdCount` |
| `getRetireInfo` | select | 468 | [`pay10_month`](../../../db/tables/pay.md) | `f_get_emptrans` | `pay.Pay10_Month.getRetireInfo` |
| `getHtmlData` | select | 476 | [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay10_Month.getHtmlData` |
| `getHtmlData10` | select | 552 | [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.getHtmlData10` |
| `insert` | insert | 568 | [`pay10_month`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.insert` |
