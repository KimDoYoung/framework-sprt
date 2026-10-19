# pay01_annual

`server/pay/mapper/pay01_annual.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 46 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `pay.Pay01_Annual.selectById` |
| `selectByAll` | select | 60 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `pay.Pay01_Annual.selectByAll`, `sys.Sys99_Print.insertRdAnnualListAll` |
| `selectByPersonId` | select | 166 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `pay.Pay01_Annual.selectByPersonId`, `sys.Sys99_Print.insertRdAnnualList` |
| `selectByDate` | select | 274 | [`pay01_annual`](../../../db/tables/pay.md) |  | - |
| `selectByApprStatus` | select | 289 | [`apr01_appr`](../../../db/tables/apr.md), [`pay01_annual`](../../../db/tables/pay.md) |  | `pay.Pay02_Month.insert`, `pay.Pay10_Month.insert` |
| `updateApprId` | update | 306 | [`pay01_annual`](../../../db/tables/pay.md) |  | `pay.Pay01_Annual.updateApprId` |
| `excelDelete` | delete | 312 | [`pay01_annual`](../../../db/tables/pay.md) |  | - |
| `excelInsert` | insert | 321 | [`pay01_annual`](../../../db/tables/pay.md) | `f_create_seq` | - |
