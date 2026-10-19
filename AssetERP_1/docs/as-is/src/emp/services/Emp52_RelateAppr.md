# emp.Emp52_RelateAppr

`server/emp/Emp52_RelateAppr.java`

서비스 키 `emp.Emp52_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`emp52_relate_appr.selectById`](../../emp/sql/emp52_relate_appr.md) | - |  |
| `selectByCompanyId` | 25 | [`emp52_relate_appr.selectByCompanyId`](../../emp/sql/emp52_relate_appr.md) | `Emp50_Tab_TransportExpenseMng` |  |
| `selectApprId` | 39 | [`emp52_relate_appr.selectByCompanyId`](../../emp/sql/emp52_relate_appr.md) | `Emp50_Tab_TransportExpenseMng` |  |
| `insert` | 53 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp52_relate_appr.deleteByApprId`](../../emp/sql/emp52_relate_appr.md), [`emp52_relate_appr.insert`](../../emp/sql/emp52_relate_appr.md), [`emp52_relate_appr.selectByCompanyId`](../../emp/sql/emp52_relate_appr.md) | `Emp50_Tab_TransportExpenseMng` |  |
| `updateApprId` | 86 | [`emp52_relate_appr.updateApprId`](../../emp/sql/emp52_relate_appr.md) | `Emp50_Tab_TransportExpenseMng` |  |
| `update` | 95 | `UpdateDataModel(emp52_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 100 | `UpdateDataModel(emp52_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
