# pln02_plan

`server/pln/mapper/pln02_plan.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 36 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`pln02_plan`](../../../db/tables/pln.md) | `f_cdnm`, `f_sysdate` | `pln.Pln02_Plan.insertAppr`, `pln.Pln02_Plan.selectById` |
| `selectByPlanFundName` | select | 58 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`pln02_plan`](../../../db/tables/pln.md) | `f_cdnm`, `f_sysdate` | `pln.Pln02_Plan.selectByPlanFundName` |
| `selectByPlanFundId` | select | 77 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`pln02_plan`](../../../db/tables/pln.md) | `f_cdnm`, `f_sysdate` | `pln.Pln02_Plan.selectByPlanFundId` |
| `selectByFundId` | select | 99 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`pln02_plan`](../../../db/tables/pln.md) | `f_cdnm`, `f_sysdate` | `pln.Pln02_Plan.selectByFundId` |
| `selectByFundIdEmp` | select | 122 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`pln02_plan`](../../../db/tables/pln.md) | `f_cdnm` | `pln.Pln02_Plan.selectByFundIdEmp` |
| `selectByEmpPlanFundId` | select | 146 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`pln02_plan`](../../../db/tables/pln.md) | `f_cdnm`, `f_sysdate` | `pln.Pln02_Plan.selectByEmpPlanFundId` |
| `updateApprId` | update | 170 | [`pln02_plan`](../../../db/tables/pln.md) |  | `pln.Pln02_Plan.insertAppr` |
| `updateApprIdByApprId` | update | 176 | [`pln02_plan`](../../../db/tables/pln.md) |  | `apr.Apr01_Appr.deleteByApprId`, `apr.Apr90_DisposalList.updateAppr` |
