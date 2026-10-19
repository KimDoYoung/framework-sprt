# emp.Emp40_EvalListStd

`server/emp/Emp40_EvalListStd.java`

서비스 키 `emp.Emp40_EvalListStd.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`emp40_eval_list_std.selectById`](../../emp/sql/emp40_eval_list_std.md) | - |  |
| `selectByCompanyId` | 30 | [`emp40_eval_list_std.selectByCompanyId`](../../emp/sql/emp40_eval_list_std.md) | `Emp41_Tab_EvalList` |  |
| `getEvalListStdId` | 36 | [`emp40_eval_list_std.getEvalListStdId`](../../emp/sql/emp40_eval_list_std.md) | `Emp43_Tab_EvalTarget` |  |
| `deleteByEvalListStdId` | 42 | [`emp40_eval_list_std.deleteByEvalListStdId`](../../emp/sql/emp40_eval_list_std.md), [`emp41_eval_list.deleteByEvalListStdId`](../../emp/sql/emp41_eval_list.md), [`emp42_eval_grade.deleteByEvalListStdId`](../../emp/sql/emp42_eval_grade.md), [`emp43_eval_target.getEventChk`](../../emp/sql/emp43_eval_target.md) | `Emp41_Tab_EvalList` |  |
| `insert` | 60 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp40_eval_list_std.insert`](../../emp/sql/emp40_eval_list_std.md), [`emp40_eval_list_std.selectByStartDate`](../../emp/sql/emp40_eval_list_std.md), [`emp41_eval_list.insert`](../../emp/sql/emp41_eval_list.md), [`emp41_eval_list.selectByMaxCompanyId`](../../emp/sql/emp41_eval_list.md), [`emp41_eval_list.selectByMaxCompanyIdAdmin`](../../emp/sql/emp41_eval_list.md), [`emp42_eval_grade.insert`](../../emp/sql/emp42_eval_grade.md), [`emp42_eval_grade.selectByMaxCompanyId`](../../emp/sql/emp42_eval_grade.md), [`emp42_eval_grade.selectByMaxCompanyIdAdmin`](../../emp/sql/emp42_eval_grade.md), [`emp43_eval_target.getDateChk`](../../emp/sql/emp43_eval_target.md) | `Emp40_Lookup_Insert` |  |
| `updateFixYn` | 154 | [`emp40_eval_list_std.updateFixYn`](../../emp/sql/emp40_eval_list_std.md), [`emp43_eval_target.getEventChk2`](../../emp/sql/emp43_eval_target.md) | `Emp41_Tab_EvalList` |  |
| `update` | 176 | `UpdateDataModel(emp40_eval_list_std)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 181 | `UpdateDataModel(emp40_eval_list_std)` 동적 DELETE | - | `UpdateDataModel` |
