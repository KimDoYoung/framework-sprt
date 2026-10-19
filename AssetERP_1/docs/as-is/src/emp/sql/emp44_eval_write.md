# emp44_eval_write

`server/emp/mapper/emp44_eval_write.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp44_EvalWrite.selectById` |
| `selectByEvaluatorId` | select | 42 | [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md) |  | `emp.Emp44_EvalWrite.selectByEvaluatorId` |
| `getEventChk` | select | 50 | [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md) |  | `emp.Emp44_EvalWrite.getEventChk` |
| `checkEvalTarget` | select | 57 | [`emp44_eval_write`](../../../db/tables/emp.md) |  | `emp.Emp44_EvalWrite.updateEvalGradeId` |
| `getEvalTargetList` | select | 65 | [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp44_EvalWrite.getEvalTargetList` |
| `getEmpEvalGrade` | select | 86 | [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md) | `f_get_empevalgradeid` | `emp.Emp44_EvalWrite.getEmpEvalGrade` |
| `updateEvalGradeId` | update | 97 | [`emp41_eval_list`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md) |  | `emp.Emp44_EvalWrite.updateEvalGradeId` |
| `deleteByPersonId` | delete | 117 | [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md) |  | `emp.Emp43_EvalTarget.deleteList`, `emp.Emp43_EvalTarget.updateList` |
