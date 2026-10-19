# fnd20_plan

`server/fnd/mapper/fnd20_plan.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd20_plan`](../../../db/tables/fnd.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `fnd.Fnd20_Plan.insertAppr`, `fnd.Fnd20_Plan.selectById`, `sch.Sch04_List.insertAppr` |
| `selectByPersonId` | select | 57 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd20_plan`](../../../db/tables/fnd.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `fnd.Fnd20_Plan.selectByPersonId` |
| `selectByFundId` | select | 88 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd20_plan`](../../../db/tables/fnd.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `fnd.Fnd20_Plan.selectByFundId` |
| `selectByFundIdEmp` | select | 119 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd20_plan`](../../../db/tables/fnd.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `fnd.Fnd20_Plan.selectByFundIdEmp` |
| `updateApprId` | update | 150 | [`fnd20_plan`](../../../db/tables/fnd.md) |  | `fnd.Fnd20_Plan.insertAppr`, `sch.Sch04_List.insertAppr` |
| `updateApprIdByApprId` | update | 156 | [`fnd20_plan`](../../../db/tables/fnd.md) |  | - |
