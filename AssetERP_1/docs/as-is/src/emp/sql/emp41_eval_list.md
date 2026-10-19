# emp41_eval_list

`server/emp/mapper/emp41_eval_list.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp41_EvalList.selectById`, `emp.Emp44_EvalWrite.updateEvalGradeId` |
| `selectByEvalListStdId` | select | 26 | [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp41_EvalList.selectByEvalListStdId` |
| `selectByMaxCompanyId` | select | 35 | [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `f_today` | `emp.Emp40_EvalListStd.insert` |
| `selectByMaxCompanyIdAdmin` | select | 50 | [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `f_today` | `emp.Emp40_EvalListStd.insert` |
| `insert` | insert | 65 | [`emp41_eval_list`](../../../db/tables/emp.md) |  | `emp.Emp40_EvalListStd.insert` |
| `deleteByEvalListStdId` | delete | 86 | [`emp41_eval_list`](../../../db/tables/emp.md) |  | `emp.Emp40_EvalListStd.deleteByEvalListStdId` |
