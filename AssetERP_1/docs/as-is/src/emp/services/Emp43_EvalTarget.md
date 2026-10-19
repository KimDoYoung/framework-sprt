# emp.Emp43_EvalTarget

`server/emp/Emp43_EvalTarget.java`

서비스 키 `emp.Emp43_EvalTarget.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md) | - |  |
| `selectByCompanyId` | 26 | [`emp43_eval_target.selectByCompanyId`](../../emp/sql/emp43_eval_target.md) | - |  |
| `selectByTermCode` | 32 | [`emp43_eval_target.selectByTermCode`](../../emp/sql/emp43_eval_target.md) | `Emp43_Tab_EvalTarget` |  |
| `selectByText` | 38 | [`emp43_eval_target.selectByText`](../../emp/sql/emp43_eval_target.md) | `Emp43_Tab_EvalExecute` |  |
| `selectByTextAdmin` | 44 | [`emp43_eval_target.selectByTextAdmin`](../../emp/sql/emp43_eval_target.md) | `Emp43_Tab_EvalResult`, `Emp43_Tab_FinalAppr`, `Emp43_Tab_FirstAppr` |  |
| `selectByTextAdminAll` | 50 | [`emp43_eval_target.selectByTextAdminAll`](../../emp/sql/emp43_eval_target.md) | `Emp43_Tab_EvalResult` |  |
| `getWrite` | 56 | [`emp43_eval_target.getWrite`](../../emp/sql/emp43_eval_target.md) | `Emp44_Lookup_Write` |  |
| `getEventChk` | 62 | [`emp43_eval_target.getEventChk`](../../emp/sql/emp43_eval_target.md) | `Emp41_Tab_EvalList`, `Emp42_Lookup_EvalGrade` |  |
| `updateReason` | 68 | [`emp43_eval_target.updateReason`](../../emp/sql/emp43_eval_target.md) | `Emp44_Lookup_Write` |  |
| `updateEndYn` | 78 | [`emp43_eval_target.updateEndYn`](../../emp/sql/emp43_eval_target.md) | `Emp44_Lookup_Write` |  |
| `updateEval` | 89 | [`emp43_eval_target.updateEval`](../../emp/sql/emp43_eval_target.md) | `Emp43_Edit_ChangeEval` |  |
| `modelUpdate` | 112 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp43_eval_target)` 동적 INSERT/UPDATE | `Emp43_Edit_CeoScore`, `Emp43_Edit_Score` | `UpdateDataModel` |
| `updateList` | 125 | [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md), [`emp44_eval_write.deleteByPersonId`](../../emp/sql/emp44_eval_write.md), `UpdateDataModel(emp43_eval_target)` 동적 INSERT/UPDATE | `Emp43_Tab_EvalTarget` | `UpdateDataModel` |
| `deleteList` | 163 | [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md), [`emp44_eval_write.deleteByPersonId`](../../emp/sql/emp44_eval_write.md), `UpdateDataModel(emp43_eval_target)` 동적 DELETE | `Emp43_Tab_EvalTarget` | `UpdateDataModel` |
| `update` | 199 | `UpdateDataModel(emp43_eval_target)` 동적 INSERT/UPDATE | `Emp43_Tab_EvalTarget` | `UpdateDataModel` |
| `delete` | 204 | `UpdateDataModel(emp43_eval_target)` 동적 DELETE | - | `UpdateDataModel` |
