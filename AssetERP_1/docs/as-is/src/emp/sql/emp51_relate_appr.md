# emp51_relate_appr

`server/emp/mapper/emp51_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`apr01_appr`](../../../db/tables/apr.md), [`emp51_relate_appr`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `emp.Emp51_RelateAppr.selectById` |
| `selectByPersonId` | select | 44 | [`apr01_appr`](../../../db/tables/apr.md), [`emp51_relate_appr`](../../../db/tables/emp.md) | `f_cdnm` | `emp.Emp51_RelateAppr.insert`, `emp.Emp51_RelateAppr.selectApprId`, `emp.Emp51_RelateAppr.selectByPersonId` |
| `selectByCompanyId` | select | 56 | [`apr01_appr`](../../../db/tables/apr.md), [`emp51_relate_appr`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `emp.Emp51_RelateAppr.selectByCompanyId` |
| `selectByCloseYn` | select | 74 | [`emp51_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp51_RelateAppr.selectByCloseYn` |
| `selectByRegno` | select | 88 | [`emp51_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp51_RelateAppr.insert` |
| `insert` | insert | 96 | [`emp51_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp51_RelateAppr.insert` |
| `updateApprId` | update | 120 | [`emp51_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp51_RelateAppr.updateApprId` |
| `updateCloseYn` | update | 126 | [`emp51_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp51_RelateAppr.updateCloseYn` |
| `deleteByApprId` | delete | 133 | [`emp51_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp51_RelateAppr.insert` |
