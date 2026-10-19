# pay02_month

`server/pay/mapper/pay02_month.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 68 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`pay02_month`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `pay.Pay02_Month.selectById` |
| `selectByCompanyId` | select | 131 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay02_month`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `pay.Pay02_Month.calculate`, `pay.Pay02_Month.calculateByPersonId`, `pay.Pay02_Month.selectByCompanyId` |
| `selectByPersonId` | select | 193 | [`pay02_month`](../../../db/tables/pay.md) | `f_emp_kor_nm` | - |
| `selectByPayDatePersonId` | select | 203 | [`pay02_month`](../../../db/tables/pay.md) | `f_emp_kor_nm` | `pay.Pay02_Month.insert` |
| `selectByYearPersonId` | select | 213 | [`pay02_month`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay02_Month.selectByYearPersonId` |
| `selectByLatestInfo` | select | 259 | [`pay02_month`](../../../db/tables/pay.md) | `f_emp_kor_nm` | `pay.Pay02_Month.insert` |
| `selectByYear` | select | 273 | [`pay02_month`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay02_Month.selectByYear` |
| `selectByMonth` | select | 298 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) |  | - |
| `selectByTrans` | select | 316 | [`emp14_account`](../../../db/tables/emp.md), [`pay02_month`](../../../db/tables/pay.md), [`pay03_account`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `to_decrypts` | `pay.Pay02_Month.selectByTrans` |
| `getHtmlData` | select | 341 | [`emp03_trans`](../../../db/tables/emp.md), [`pay02_month`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay02_Month.getHtmlData` |
| `insert` | insert | 393 | [`pay02_month`](../../../db/tables/pay.md) |  | `pay.Pay02_Month.insert` |
| `deleteByPayDate` | delete | 464 | [`pay02_month`](../../../db/tables/pay.md) |  | - |
| `updateRealPay` | update | 472 | [`pay02_month`](../../../db/tables/pay.md) |  | `pay.Pay02_Month.calculate`, `pay.Pay02_Month.calculateByPersonId` |
