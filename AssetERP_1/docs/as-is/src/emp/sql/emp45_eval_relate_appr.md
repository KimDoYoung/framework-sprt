# emp45_eval_relate_appr

`server/emp/mapper/emp45_eval_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`apr01_appr`](../../../db/tables/apr.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md) | `f_cdnm` | `emp.Emp45_EvalRelateAppr.selectById` |
| `selectByTermCode` | select | 33 | [`apr01_appr`](../../../db/tables/apr.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md) | `f_cdnm` | `emp.Emp45_EvalRelateAppr.insert`, `emp.Emp45_EvalRelateAppr.insertFinal`, `emp.Emp45_EvalRelateAppr.selectByTermCode` |
| `insert` | insert | 47 | [`emp45_eval_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp45_EvalRelateAppr.insert`, `emp.Emp45_EvalRelateAppr.insertFinal` |
| `updateApprId` | update | 62 | [`emp45_eval_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp45_EvalRelateAppr.insert`, `emp.Emp45_EvalRelateAppr.updateApprId` |
| `updateFinalApprId` | update | 68 | [`emp45_eval_relate_appr`](../../../db/tables/emp.md) |  | `emp.Emp45_EvalRelateAppr.insertFinal`, `emp.Emp45_EvalRelateAppr.updateFinalApprId` |
