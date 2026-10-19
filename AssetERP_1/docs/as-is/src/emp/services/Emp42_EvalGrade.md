# emp.Emp42_EvalGrade

`server/emp/Emp42_EvalGrade.java`

서비스 키 `emp.Emp42_EvalGrade.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`emp42_eval_grade.selectById`](../../emp/sql/emp42_eval_grade.md) | - |  |
| `selectByEvalListStdId` | 24 | [`emp42_eval_grade.selectByEvalListStdId`](../../emp/sql/emp42_eval_grade.md) | `Emp42_Lookup_EvalGrade`, `Emp44_Lookup_Write` |  |
| `updateList` | 31 | `UpdateDataModel(emp42_eval_grade)` 동적 INSERT/UPDATE, `UpdateDataModel(emp42_eval_grade)` 동적 DELETE | `Emp42_Lookup_EvalGrade` | `UpdateDataModel` |
| `update` | 60 | `UpdateDataModel(emp42_eval_grade)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 65 | `UpdateDataModel(emp42_eval_grade)` 동적 DELETE | - | `UpdateDataModel` |
