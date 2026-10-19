# fnd.Fnd20_Plan

`server/fnd/Fnd20_Plan.java`

서비스 키 `fnd.Fnd20_Plan.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`fnd20_plan.selectById`](../../fnd/sql/fnd20_plan.md) | `Fnd20_Lookup_ToDoList` |  |
| `selectByPersonId` | 31 | [`fnd20_plan.selectByPersonId`](../../fnd/sql/fnd20_plan.md) | `Fnd20_Lookup_ToDoList` |  |
| `selectByPlanFundId` | 42 | `fnd20_plan.selectByPlanFundId`(없음) | - |  |
| `selectByFundId` | 50 | [`fnd20_plan.selectByFundId`](../../fnd/sql/fnd20_plan.md) | `Fnd20_TabPage_Plan` |  |
| `selectByFundIdEmp` | 55 | [`fnd20_plan.selectByFundIdEmp`](../../fnd/sql/fnd20_plan.md) | `Fnd20_TabPage_PlanEmp` |  |
| `selectByEmpPlanFundId` | 60 | `fnd20_plan.selectByEmpPlanFundId`(없음) | - |  |
| `selectByPlanFundName` | 69 | `fnd20_plan.selectByPlanFundName`(없음) | - |  |
| `selectByPlanPersonFund` | 78 | `fnd20_plan.selectByPlanPersonFund`(없음) | - |  |
| `selectByLookupFund` | 87 | `fnd20_plan.selectByLookupFund`(없음) | - |  |
| `insertAppr` | 93 | [`apr01_appr.insert`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.insert`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`dcr05_doc_type.selectByDefaultClassTreeId`](../../dcr/sql/dcr05_doc_type.md), [`fnd20_plan.selectById`](../../fnd/sql/fnd20_plan.md), [`fnd20_plan.updateApprId`](../../fnd/sql/fnd20_plan.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE | `Fnd20_Lookup_ToDoList`, `Fnd20_TabPage_PlanEmp` | `Apr04_ApprStep`, `UpdateDataModel` |
| `update` | 181 | `UpdateDataModel(fnd20_plan)` 동적 INSERT/UPDATE | `Fnd20_Lookup_ToDoList`, `Fnd20_TabPage_Plan`, `Fnd20_TabPage_PlanEmp` | `UpdateDataModel` |
| `delete` | 186 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(fnd20_plan)` 동적 DELETE | `Fnd20_TabPage_Plan`, `Fnd20_TabPage_PlanEmp` | `UpdateDataModel` |
