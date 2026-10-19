# pln.Pln02_Plan

`server/pln/Pln02_Plan.java`

서비스 키 `pln.Pln02_Plan.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 27 | [`pln02_plan.selectById`](../../pln/sql/pln02_plan.md) | - |  |
| `selectByPlanFundId` | 33 | [`pln02_plan.selectByPlanFundId`](../../pln/sql/pln02_plan.md) | - |  |
| `selectByFundId` | 48 | [`pln02_plan.selectByFundId`](../../pln/sql/pln02_plan.md) | `Pln02_TabPage_Plan` |  |
| `selectByFundIdEmp` | 59 | [`pln02_plan.selectByFundIdEmp`](../../pln/sql/pln02_plan.md) | `Pln02_TabPage_PlanEmp` |  |
| `selectByEmpPlanFundId` | 70 | [`pln02_plan.selectByEmpPlanFundId`](../../pln/sql/pln02_plan.md) | - |  |
| `selectByPlanFundName` | 85 | [`pln02_plan.selectByPlanFundName`](../../pln/sql/pln02_plan.md) | - |  |
| `selectByPlanPersonFund` | 94 | `pln02_plan.selectByPlanPersonFund`(없음) | - |  |
| `selectByLookupFund` | 109 | `pln02_plan.selectByLookupFund`(없음) | - |  |
| `insertAppr` | 121 | [`apr01_appr.insert`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.insert`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`pln02_plan.selectById`](../../pln/sql/pln02_plan.md), [`pln02_plan.updateApprId`](../../pln/sql/pln02_plan.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE | `Pln02_TabPage_PlanEmp` | `Apr04_ApprStep`, `UpdateDataModel` |
| `update` | 208 | `UpdateDataModel(pln02_plan)` 동적 INSERT/UPDATE | `Pln02_TabPage_Plan`, `Pln02_TabPage_PlanEmp` | `UpdateDataModel` |
| `delete` | 221 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(pln02_plan)` 동적 DELETE | `Pln02_TabPage_Plan`, `Pln02_TabPage_PlanEmp` | `UpdateDataModel` |
