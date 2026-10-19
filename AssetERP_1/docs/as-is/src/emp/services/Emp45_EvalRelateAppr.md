# emp.Emp45_EvalRelateAppr

`server/emp/Emp45_EvalRelateAppr.java`

서비스 키 `emp.Emp45_EvalRelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`emp45_eval_relate_appr.selectById`](../../emp/sql/emp45_eval_relate_appr.md) | - |  |
| `selectByTermCode` | 25 | [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md) | `Emp43_Tab_EvalTarget`, `Emp43_Tab_FinalAppr`, `Emp43_Tab_FirstAppr`, `Emp44_Lookup_Write` |  |
| `insert` | 31 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp45_eval_relate_appr.insert`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.updateApprId`](../../emp/sql/emp45_eval_relate_appr.md) | `Emp43_Tab_FirstAppr` |  |
| `insertFinal` | 64 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp45_eval_relate_appr.insert`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.updateFinalApprId`](../../emp/sql/emp45_eval_relate_appr.md) | `Emp43_Tab_FinalAppr` |  |
| `updateApprId` | 97 | [`emp45_eval_relate_appr.updateApprId`](../../emp/sql/emp45_eval_relate_appr.md) | `Emp43_Tab_FirstAppr` |  |
| `updateFinalApprId` | 106 | [`emp45_eval_relate_appr.updateFinalApprId`](../../emp/sql/emp45_eval_relate_appr.md) | `Emp43_Tab_FinalAppr` |  |
| `update` | 115 | `UpdateDataModel(emp45_eval_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 120 | `UpdateDataModel(emp45_eval_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
