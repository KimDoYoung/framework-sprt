# emp.Emp51_RelateAppr

`server/emp/Emp51_RelateAppr.java`

서비스 키 `emp.Emp51_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp51_relate_appr.selectById`](../../emp/sql/emp51_relate_appr.md) | - |  |
| `selectByPersonId` | 26 | [`emp51_relate_appr.selectByPersonId`](../../emp/sql/emp51_relate_appr.md) | `Emp50_Tab_TransportExpense` |  |
| `selectByCompanyId` | 42 | [`emp51_relate_appr.selectByCompanyId`](../../emp/sql/emp51_relate_appr.md) | `Emp50_Tab_TransportExpenseMng` |  |
| `selectByCloseYn` | 56 | [`emp51_relate_appr.selectByCloseYn`](../../emp/sql/emp51_relate_appr.md) | `Emp50_Tab_TransportExpense` |  |
| `selectApprId` | 70 | [`emp51_relate_appr.selectByPersonId`](../../emp/sql/emp51_relate_appr.md) | `Emp50_Tab_TransportExpense` |  |
| `insert` | 86 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp51_relate_appr.deleteByApprId`](../../emp/sql/emp51_relate_appr.md), [`emp51_relate_appr.insert`](../../emp/sql/emp51_relate_appr.md), [`emp51_relate_appr.selectByPersonId`](../../emp/sql/emp51_relate_appr.md), [`emp51_relate_appr.selectByRegno`](../../emp/sql/emp51_relate_appr.md) | `Emp50_Tab_TransportExpense` |  |
| `updateCloseYn` | 130 | [`emp51_relate_appr.updateCloseYn`](../../emp/sql/emp51_relate_appr.md) | `Emp50_Tab_TransportExpenseMng` |  |
| `updateApprId` | 140 | [`emp51_relate_appr.updateApprId`](../../emp/sql/emp51_relate_appr.md) | `Emp50_Tab_TransportExpense` |  |
| `update` | 149 | `UpdateDataModel(emp51_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 154 | `UpdateDataModel(emp51_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
