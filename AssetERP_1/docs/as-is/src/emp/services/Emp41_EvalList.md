# emp.Emp41_EvalList

`server/emp/Emp41_EvalList.java`

서비스 키 `emp.Emp41_EvalList.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`emp41_eval_list.selectById`](../../emp/sql/emp41_eval_list.md) | - |  |
| `selectByEvalListStdId` | 24 | [`emp41_eval_list.selectByEvalListStdId`](../../emp/sql/emp41_eval_list.md) | `Emp41_Tab_EvalList` |  |
| `updateList` | 31 | `UpdateDataModel(emp41_eval_list)` 동적 INSERT/UPDATE, `UpdateDataModel(emp41_eval_list)` 동적 DELETE | `Emp41_Tab_EvalList` | `UpdateDataModel` |
| `update` | 60 | `UpdateDataModel(emp41_eval_list)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 65 | `UpdateDataModel(emp41_eval_list)` 동적 DELETE | - | `UpdateDataModel` |
