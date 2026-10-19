# emp52_relate_appr

`server/emp/mapper/emp52_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`emp52_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp52_RelateAppr.selectById` |
| `selectByCompanyId` | select | 23 | [`apr01_appr`](../../../db/tables/apr.md), [`emp52_relate_appr`](../../../db/tables/emp.md) | `f_cdnm` | `emp.Emp52_RelateAppr.insert`, `emp.Emp52_RelateAppr.selectApprId`, `emp.Emp52_RelateAppr.selectByCompanyId` |
| `insert` | insert | 33 | [`emp52_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp52_RelateAppr.insert` |
| `updateApprId` | update | 49 | [`emp52_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp52_RelateAppr.updateApprId` |
| `deleteByApprId` | delete | 55 | [`emp52_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp52_RelateAppr.insert` |
