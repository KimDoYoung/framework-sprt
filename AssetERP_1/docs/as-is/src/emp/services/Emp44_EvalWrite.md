# emp.Emp44_EvalWrite

`server/emp/Emp44_EvalWrite.java`

서비스 키 `emp.Emp44_EvalWrite.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`emp44_eval_write.selectById`](../../emp/sql/emp44_eval_write.md) | - |  |
| `selectByEvalTargetId` | 28 | `emp44_eval_write.selectByEvalTargetId`(없음) | - |  |
| `selectByEvaluatorId` | 34 | [`emp44_eval_write.selectByEvaluatorId`](../../emp/sql/emp44_eval_write.md) | `Emp43_Lookup_SelectSingle` |  |
| `selectByEvalListStdId` | 40 | `emp44_eval_write.selectByEvalListStdId`(없음) | - |  |
| `getEventChk` | 46 | [`emp44_eval_write.getEventChk`](../../emp/sql/emp44_eval_write.md) | - |  |
| `getEvalTargetList` | 52 | [`emp44_eval_write.getEvalTargetList`](../../emp/sql/emp44_eval_write.md) | `Emp44_Lookup_Write` |  |
| `getEmpEvalGrade` | 58 | [`emp44_eval_write.getEmpEvalGrade`](../../emp/sql/emp44_eval_write.md) | `Emp44_Lookup_Write` |  |
| `updateEvalGradeId` | 64 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp41_eval_list.selectById`](../../emp/sql/emp41_eval_list.md), [`emp42_eval_grade.selectById`](../../emp/sql/emp42_eval_grade.md), [`emp44_eval_write.checkEvalTarget`](../../emp/sql/emp44_eval_write.md), [`emp44_eval_write.updateEvalGradeId`](../../emp/sql/emp44_eval_write.md), `UpdateDataModel(emp44_eval_write)` 동적 INSERT/UPDATE | `Emp44_Lookup_Write` | `UpdateDataModel` |
| `update` | 113 | `UpdateDataModel(emp44_eval_write)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 118 | `UpdateDataModel(emp44_eval_write)` 동적 DELETE | - | `UpdateDataModel` |
